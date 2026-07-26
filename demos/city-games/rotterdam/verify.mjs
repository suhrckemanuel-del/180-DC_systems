/* Headless structural verification for ROTTERDAM — "Nachtstad aan de Maas".
   Runs the game's own script against a stubbed DOM and a recording
   WebGL2 context, then drives window.__game.step() directly.

   Usage:  node verify.mjs
   Exits nonzero on the first failed check group.

   What this cannot prove: real GLSL compilation, real frame rate, and
   how the thing feels. Those need a browser and a human. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const HTML = readFileSync(join(HERE, 'index.html'), 'utf8');

/* ---------------------------------------------------------------- */
/* stubs                                                             */
/* ---------------------------------------------------------------- */

const GLCALLS = { count: 0, byName: Object.create(null), bufferData: 0, draws: 0 };

function glStub(){
  const tok = (n) => ({ __tok: n });
  const handler = {
    get(target, prop){
      if (prop in target) { return target[prop]; }
      if (typeof prop !== 'string') { return undefined; }
      /* GL enums: any unknown CONSTANT_CASE name is a number */
      if (/^[A-Z0-9_]+$/.test(prop)){
        if (!(prop in target)) { target[prop] = target.__enum++; }
        return target[prop];
      }
      const fn = (...args) => {
        GLCALLS.count++;
        GLCALLS.byName[prop] = (GLCALLS.byName[prop] || 0) + 1;
        if (prop === 'bufferData') { GLCALLS.bufferData++; }
        if (prop.startsWith('drawArrays')) { GLCALLS.draws++; }
        if (prop === 'getShaderParameter' || prop === 'getProgramParameter'){
          /* COMPILE_STATUS / LINK_STATUS true; ACTIVE_UNIFORMS 0 */
          return args[1] === target.ACTIVE_UNIFORMS ? 0 : true;
        }
        if (prop === 'getShaderInfoLog' || prop === 'getProgramInfoLog') { return ''; }
        if (prop === 'getActiveUniform') { return null; }
        if (prop === 'getUniformLocation') { return tok(args[1]); }
        if (prop.startsWith('create')) { return tok(prop); }
        if (prop === 'getError') { return 0; }
        return undefined;
      };
      target[prop] = fn;
      return fn;
    }
  };
  return new Proxy({ __enum: 0x8000 }, handler);
}

function makeEl(tag = 'div'){
  const el = {
    tagName: tag, id: '', className: '', innerHTML: '', textContent: '',
    style: {}, children: [], width: 1280, height: 720,
    clientWidth: 1280, clientHeight: 720,
    classList: {
      _s: new Set(),
      add(...c){ c.forEach(x => this._s.add(x)); },
      remove(...c){ c.forEach(x => this._s.delete(x)); },
      toggle(c, on){ if (on === undefined) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); } else { on ? this._s.add(c) : this._s.delete(c); } },
      contains(c){ return this._s.has(c); }
    },
    appendChild(c){ el.children.push(c); return c; },
    removeChild(c){ const i = el.children.indexOf(c); if (i >= 0) { el.children.splice(i, 1); } return c; },
    querySelector(){ return makeEl('span'); },
    addEventListener(){}, removeEventListener(){},
    getContext(kind){ return kind === 'webgl2' ? GL : null; },
    toBlob(cb){ cb(null); },
    click(){}, focus(){}, getBoundingClientRect(){ return { left: 0, top: 0, width: 1280, height: 720 }; }
  };
  return el;
}

const GL = glStub();
const ELEMS = Object.create(null);
const TIMERS = [];

const documentStub = {
  readyState: 'complete',
  pointerLockElement: null,
  hidden: false,
  body: makeEl('body'),
  documentElement: makeEl('html'),
  getElementById(id){ return (ELEMS[id] = ELEMS[id] || makeEl('div')); },
  createElement(tag){ return makeEl(tag); },
  querySelector(){ return makeEl('div'); },
  addEventListener(){}, removeEventListener(){}
};

const storage = new Map();
const windowStub = {
  innerWidth: 1280, innerHeight: 720, devicePixelRatio: 2,
  addEventListener(){}, removeEventListener(){},
  requestAnimationFrame(){ return 1; }, cancelAnimationFrame(){},
  setTimeout(fn, ms){ TIMERS.push({ fn, ms }); return TIMERS.length; },
  clearTimeout(){},
  matchMedia(q){ return { matches: false, media: q, addEventListener(){}, addListener(){} }; },
  localStorage: {
    getItem(k){ return storage.has(k) ? storage.get(k) : null; },
    setItem(k, v){ storage.set(k, String(v)); },
    removeItem(k){ storage.delete(k); }
  },
  URL: { createObjectURL(){ return 'blob:x'; }, revokeObjectURL(){} },
  AudioContext: null, webkitAudioContext: null,
  performance: { now: () => Number(process.hrtime.bigint() / 1000n) / 1000 }
};
windowStub.window = windowStub;
windowStub.document = documentStub;

const navigatorStub = { getGamepads: () => [], userAgent: 'node', maxTouchPoints: 0 };

/* ---------------------------------------------------------------- */
/* boot                                                              */
/* ---------------------------------------------------------------- */

const m = HTML.match(/<script>([\s\S]*)<\/script>/);
if (!m) { fail('W1', 'no <script> block found in index.html'); }
const SRC = m[1];

const results = [];
let failed = false;
function ok(id, msg){ results.push(['PASS', id, msg]); }
function fail(id, msg){ results.push(['FAIL', id, msg]); failed = true; }
function check(id, cond, msg){ cond ? ok(id, msg) : fail(id, msg); }

let G = null;
try {
  const fn = new Function('window', 'document', 'navigator', 'performance', 'requestAnimationFrame', 'localStorage', SRC);
  fn(windowStub, documentStub, navigatorStub, windowStub.performance, windowStub.requestAnimationFrame, windowStub.localStorage);
  G = windowStub.__game;
  check('W1', !!G, 'boots clean and exposes window.__game');
} catch (e) {
  fail('W1', 'threw during boot: ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e));
}
if (!G) { report(); }

const T = G.TUNE;

/* ---- W2: NaN / range sweep -------------------------------------- */
{
  const buf = G.worldBuf();
  const dv = new DataView(buf);
  const stride = 20, n = buf.byteLength / stride;
  let bad = 0, oob = 0;
  const LIM = 1400;
  for (let i = 0; i < n; i++){
    const o = i * stride;
    for (let k = 0; k < 3; k++){
      const v = dv.getFloat32(o + k * 4, true);
      if (!Number.isFinite(v)) { bad++; }
      else if (Math.abs(v) > LIM) { oob++; }
    }
  }
  const gb = G.glowBuf(); for (let i = 0; i < gb.length; i++){ if (!Number.isFinite(gb[i])) bad++; }
  const pb = G.propBuf(); for (let i = 0; i < pb.length; i++){ if (!Number.isFinite(pb[i])) bad++; }
  const wv = G.waterV();
  for (let i = 0; i < wv.length; i++){ if (!Number.isFinite(wv[i])) { bad++; } }
  check('W2', bad === 0 && oob === 0,
    `finite geometry (${n} verts, ${bad} non-finite, ${oob} out of ±${LIM}m)`);
}

/* ---- W3: winding / normal coherence ------------------------------ */
{
  const buf = G.worldBuf();
  const dv = new DataView(buf);
  const stride = 20, tris = (buf.byteLength / stride / 3) | 0;
  let agree = 0, tested = 0, degenerate = 0;
  const p = [0,0,0,0,0,0,0,0,0];
  for (let t = 0; t < tris; t++){
    const base = t * 3 * stride;
    for (let v = 0; v < 3; v++){
      const o = base + v * stride;
      p[v*3] = dv.getFloat32(o, true);
      p[v*3+1] = dv.getFloat32(o + 4, true);
      p[v*3+2] = dv.getFloat32(o + 8, true);
    }
    const ux = p[3]-p[0], uy = p[4]-p[1], uz = p[5]-p[2];
    const vx = p[6]-p[0], vy = p[7]-p[1], vz = p[8]-p[2];
    const gx = uy*vz - uz*vy, gy = uz*vx - ux*vz, gz = ux*vy - uy*vx;
    const gl2 = gx*gx + gy*gy + gz*gz;
    if (gl2 < 1e-12){ degenerate++; continue; }
    const nx = dv.getInt8(base + 12) / 127, ny = dv.getInt8(base + 13) / 127, nz = dv.getInt8(base + 14) / 127;
    tested++;
    if (gx*nx + gy*ny + gz*nz > 0) { agree++; }
  }
  const pct = tested ? agree / tested : 0;
  check('W3', pct >= 0.995 && degenerate <= tris * 0.005,
    `winding coherent with stored normals: ${(pct*100).toFixed(2)}% of ${tested} tris (${degenerate} degenerate)`);
}

/* ---- W4: budgets -------------------------------------------------- */
{
  const S = G.STATS;
  const mb = S.vboBytes / 1048576;
  const okTris = S.tris <= T.MAX_TRIS;
  const okChunk = S.chunkTrisMax <= T.MAX_CHUNK_TRIS;
  const okVbo = mb <= T.MAX_VBO_MB;
  check('W4', okTris && okChunk && okVbo,
    `budgets: ${Math.round(S.tris)} tris (max ${T.MAX_TRIS}), worst chunk ${Math.round(S.chunkTrisMax)} (max ${T.MAX_CHUNK_TRIS}), VBO ${mb.toFixed(1)}MB (max ${T.MAX_VBO_MB})`);
}

/* ---- W5: determinism ---------------------------------------------- */
{
  const hash = (buf) => {
    const u8 = new Uint8Array(buf);
    let h = 0x811c9dc5;
    for (let i = 0; i < u8.length; i++){ h ^= u8[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16);
  };
  const a = hash(G.worldBuf());
  G.buildWorld(); G.packWorld();
  const b = hash(G.worldBuf());
  check('W5', a === b, `world regenerates identically from the seed (${a})`);
}

/* ---- W6: collider / patch sanity ---------------------------------- */
{
  let bad = [];
  /* A landmark's trigger centre is the building itself, so it may well
     sit inside a collider — that is by design. What must hold is that
     the ground query resolves and that the trigger ring is reachable:
     at least one point on the radius must be free, walkable ground. */
  for (const L of G.LM){
    const y = G.groundAt(L.x, L.z, 2);
    if (!Number.isFinite(y)) { bad.push(L.id + ':ground'); }
    let reachable = 0;
    for (let a = 0; a < 16; a++){
      const th = a / 16 * Math.PI * 2;
      const rx = L.x + Math.cos(th) * L.r * 0.85, rz = L.z + Math.sin(th) * L.r * 0.85;
      if (G.colPenetration(rx, rz, T.PLAYER_R) < 0.001){
        G.groundAt(rx, rz, (L.y || 0) + 0.5);
        const g = G.gInfo();
        if (g.found && Number.isFinite(g.y) && g.y > T.WATER_Y + 0.2) { reachable++; }
      }
    }
    if (reachable < 2) { bad.push(L.id + ':unreachable(' + reachable + ')'); }
  }
  G.RESPAWN.forEach((r, i) => {
    const y = G.groundAt(r[0], r[1], 2);
    if (!Number.isFinite(y)) { bad.push('respawn' + i + ':ground'); }
    if (G.colPenetration(r[0], r[1], T.PLAYER_R) > 0.001) { bad.push('respawn' + i + ':inside-wall'); }
  });
  check('W6', bad.length === 0,
    `every landmark trigger and respawn point stands on solid, unoccupied ground${bad.length ? ' — ' + bad.join(', ') : ''}`);
}

/* ---- C1: collision fuzz ------------------------------------------- */
{
  let seed = 12345;
  const rnd = () => { seed = (Math.imul(seed ^ (seed >>> 15), 1 | seed) + 0x6D2B79F5) | 0; return ((seed >>> 8) & 0xffffff) / 0xffffff; };
  const bad = [];
  const K = G.KEY, S = G.GS;
  let maxPen = 0, maxSpeed = 0, escapes = 0;
  /* Fuzz from the places the game can actually put the player: its
     respawn points, plus free ground on each landmark's trigger ring.
     (Teleporting into the middle of a church is not a thing the game
     does — recovery from that is covered separately by C3.) */
  const spots = [];
  for (const r of G.RESPAWN){ spots.push(r); }
  for (const L of G.LM){
    for (let a = 0; a < 8; a++){
      const th = a / 8 * Math.PI * 2;
      const rx = L.x + Math.cos(th) * L.r * 0.85, rz = L.z + Math.sin(th) * L.r * 0.85;
      if (G.colPenetration(rx, rz, T.PLAYER_R) < 0.001) { spots.push([rx, rz]); }
    }
  }

  for (let trial = 0; trial < 40; trial++){
    const s = spots[(rnd() * spots.length) | 0];
    G.spawn(s[0] + (rnd() - 0.5) * 4, s[1] + (rnd() - 0.5) * 4, rnd() * 6.28);
    for (let i = 0; i < 500; i++){
      K.w = rnd() < 0.72; K.s = rnd() < 0.12;
      K.a = rnd() < 0.22; K.d = rnd() < 0.22;
      K.shift = rnd() < 0.35;
      G.IN.lookDX = (rnd() - 0.5) * 60;
      G.step(T.STEP);
      if (!Number.isFinite(S.px + S.py + S.pz)){ bad.push('non-finite at trial ' + trial); break; }
      const pen = G.colPenetration(S.px, S.pz, T.PLAYER_R);
      if (pen > maxPen) { maxPen = pen; }
      const sp = Math.hypot(S.vx, S.vz);
      if (sp > maxSpeed) { maxSpeed = sp; }
      if (S.py < T.BED_Y - 4) { escapes++; }
    }
  }
  for (const k of ['w','s','a','d','shift']) { K[k] = false; }
  check('C1', bad.length === 0 && maxPen <= 0.02 && maxSpeed <= T.SPRINT * 1.05 && escapes === 0,
    `20k fuzz steps: worst penetration ${(maxPen*1000).toFixed(2)}mm, peak speed ${maxSpeed.toFixed(2)}m/s (cap ${(T.SPRINT*1.05).toFixed(2)}), ${escapes} escapes${bad.length ? ' — ' + bad[0] : ''}`);
}

/* ---- C3: recovery from inside geometry ---------------------------- */
{
  /* If the player ever ends up inside a building — a teleport, a
     collision bug, a future edit — the solver must push them back out
     rather than trapping them. Start dead inside each landmark. */
  const S = G.GS, K = G.KEY;
  const stuck = [];
  for (const L of G.LM){
    G.spawn(L.x, L.z, 0);
    K.w = true;
    for (let i = 0; i < 360; i++){ G.step(T.STEP); }
    K.w = false;
    const pen = G.colPenetration(S.px, S.pz, T.PLAYER_R);
    if (!Number.isFinite(S.px + S.py + S.pz) || pen > 0.02) { stuck.push(`${L.id}(${pen.toFixed(2)}m)`); }
  }
  check('C3', stuck.length === 0,
    `player pushes free when started inside geometry${stuck.length ? ' — stuck in ' + stuck.join(', ') : ' at all 11 landmarks'}`);
}

/* ---- C2: scripted traversals -------------------------------------- */
{
  const S = G.GS, K = G.KEY;
  const notes = [];

  /* Over the Erasmusbrug: the deck is a parabola patch, so walking the
     span must climb toward the crest and never touch the water. Start
     on the deck at the south end, in the bridge's own frame. */
  const B = G.BRIDGE, c = Math.cos(B.yaw), sn = Math.sin(B.yaw);
  const deck = (lx) => [B.cx + c * lx, B.cz - sn * lx];
  const p0 = deck(-(B.half - 6)), p1 = deck(0);
  G.spawn(p0[0], p0[1], Math.atan2(p1[0] - p0[0], -(p1[1] - p0[1])));
  let wet = 0, peak = -99;
  K.w = true;
  for (let i = 0; i < 3600; i++){
    G.step(T.STEP);
    if (S.py < T.WATER_Y + 0.2) wet++;
    if (S.py > peak) peak = S.py;
  }
  K.w = false;
  if (peak < B.crest * 0.5) notes.push(`never climbed the bridge (peak y=${peak.toFixed(1)} of ${B.crest})`);
  if (wet > 0) notes.push(`fell in while crossing (${wet} steps below water)`);

  /* Walking off a quay must end on solid ground, not in the river. */
  G.spawn(-251, 75, 0);
  const yaw0 = Math.atan2(0 - S.px, -(140 - S.pz));
  S.yaw = yaw0;
  K.w = true;
  for (let i = 0; i < 1600; i++) G.step(T.STEP);
  K.w = false;
  const safe = Number.isFinite(S.px) && S.py > T.WATER_Y + 0.2
            && G.colPenetration(S.px, S.pz, T.PLAYER_R) < 0.02;
  if (!safe) notes.push(`quay edge left the player at y=${S.py.toFixed(2)}`);

  check('C2', notes.length === 0,
    `scripted traversals: bridge deck and quay edge behave${notes.length ? ' — ' + notes.join('; ') : ''}`);
}

/* ---- G1: discovery loop ------------------------------------------- */
{
  const S = G.GS;
  for (const k of Object.keys(G.SAVE.found)) { delete G.SAVE.found[k]; }
  let fired = 0;
  for (const L of G.LM){
    const yaw = Math.atan2(L.x - (L.x - 6), -(L.z - (L.z - 6)));
    G.spawn(L.x - 6, L.z - 6, Math.atan2(6, 6));
    /* face the landmark exactly */
    S.yaw = Math.atan2(L.x - S.px, -(L.z - S.pz));
    S.pitch = 0;
    const before = G.foundCount();
    for (let i = 0; i < 90; i++){ G.step(T.STEP); }
    if (G.foundCount() > before) { fired++; }
  }
  check('G1', fired === G.LM.length && G.SAVE.done === true,
    `discovery: ${fired}/${G.LM.length} landmarks fire when approached and faced; completion state set`);
}

/* ---- P1: CPU proxy ------------------------------------------------ */
{
  const S = G.GS;
  G.spawn(0, -62, 0);
  const t0 = process.hrtime.bigint();
  const N = 1000;
  for (let i = 0; i < N; i++){ G.step(T.STEP); G.cull(); }
  const ms = Number(process.hrtime.bigint() - t0) / 1e6 / N;
  check('P1', ms < 2.0, `step + cull costs ${ms.toFixed(3)}ms mean (budget 2ms)`);
}

/* ---- S1: shader lint ---------------------------------------------- */
{
  const sh = G.shaders();
  const problems = [];
  const pairs = [['vsWorld','fsWorld'], ['vsProp','fsWorld'], ['vsWater','fsWater'],
                 ['vsGlow','fsGlow'], ['vsSky','fsSky']];
  for (const [vn, fn] of pairs){
    const vs = sh[vn], fs = sh[fn];
    if (!vs.startsWith('#version 300 es')) { problems.push(vn + ': missing #version first line'); }
    if (!fs.startsWith('#version 300 es')) { problems.push(fn + ': missing #version first line'); }
    if (!/precision\s+\w+\s+float/.test(fs)) { problems.push(fn + ': no float precision'); }
    if (!/out\s+vec4\s+\w+/.test(fs)) { problems.push(fn + ': no out colour'); }
    /* every varying written by the vertex stage must be read by the fragment stage */
    const outs = [...vs.matchAll(/^\s*out\s+\w+\s+(\w+)\s*;/gm)].map(x => x[1]);
    const ins = [...fs.matchAll(/^\s*in\s+\w+\s+(\w+)\s*;/gm)].map(x => x[1]);
    for (const o of outs){ if (!ins.includes(o)) { problems.push(`${vn}->${fn}: varying ${o} unconsumed`); } }
    for (const i of ins){ if (!outs.includes(i)) { problems.push(`${vn}->${fn}: fragment reads undeclared ${i}`); } }
    /* uniforms referenced in main() must be declared */
    for (const src of [vs, fs]){
      const decl = new Set([...src.matchAll(/uniform\s+\w+\s+(\w+)\s*(?:\[\d+\])?\s*;/g)].map(x => x[1]));
      for (const u of [...src.matchAll(/\bu[A-Z]\w*/g)].map(x => x[0])){
        if (!decl.has(u)) { problems.push(`undeclared uniform ${u}`); }
      }
    }
  }
  const uniq = [...new Set(problems)];
  check('S1', uniq.length === 0, `shader structure${uniq.length ? ': ' + uniq.slice(0, 6).join('; ') : ' sound across all four programs'}`);
}

/* ---- GL call sanity ------------------------------------------------ */
{
  check('P2', GLCALLS.bufferData <= 8 && GLCALLS.bufferData >= 3,
    `world uploaded once: ${GLCALLS.bufferData} bufferData calls at init`);
}

report();

function report(){
  const w = Math.max(...results.map(r => r[1].length));
  for (const [state, id, msg] of results){
    const mark = state === 'PASS' ? '  ok  ' : ' FAIL ';
    console.log(`[${mark}] ${id.padEnd(w)}  ${msg}`);
  }
  const bad = results.filter(r => r[0] === 'FAIL').length;
  console.log(`\n${results.length - bad}/${results.length} checks passed.`);
  process.exit(failed ? 1 : 0);
}
