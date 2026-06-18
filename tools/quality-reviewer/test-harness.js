/* Headless test for index.html: validation, adapter rendering, gate, cap, self-explanation.
   The page script uses let/const, so the tests are eval'd in the same scope (see marker below). */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error('FAIL: no script block found'); process.exit(1); }
const script = m[1];

/* ---- DOM stubs ---- */
const elems = {};
function mkEl() {
  const e = {
    style: {}, _cls: new Set(),
    innerHTML: '', textContent: '', value: '', className: '',
    disabled: false, files: [],
    addEventListener(){}, querySelectorAll(){ return []; }
  };
  e.classList = {
    add(c){ e._cls.add(c); }, remove(c){ e._cls.delete(c); },
    toggle(c, on){ on ? e._cls.add(c) : e._cls.delete(c); },
    contains(c){ return e._cls.has(c); }
  };
  return e;
}
global.document = {
  getElementById(id){ if (!elems[id]) elems[id] = mkEl(); return elems[id]; },
  querySelectorAll(){ return []; }
};
global.sessionStorage = { _m: {}, getItem(k){ return this._m[k] || null; }, setItem(k,v){ this._m[k] = v; } };
global.FileReader = function(){};
global.setInterval = () => 0; global.clearInterval = () => {}; global.setTimeout = () => 0;

const marker = '/* ===' + 'TESTS=== */';
const testSrc = fs.readFileSync(__filename, 'utf8').split(marker)[1];
try {
  eval(script + '\n' + testSrc);
} catch (ex) {
  console.error('FAIL: threw: ' + ex.stack);
  process.exit(1);
}
/* Everything below runs inside the eval above, sharing scope with the page script.
   process.exit at the end of the tests stops the module before this point is reached twice. */
/* ===TESTS=== */

let pass = 0, fail = 0;
function check(name, cond, detail){
  if (cond) { pass++; console.log('OK   ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

/* 1. demo review loaded at init */
check('demo loads at init', REVIEW && REVIEW.meta.title === 'Vantage IP Patent Strategy' && REVIEW.timeline.tiles.length === 32);
check('demo validates clean', validateReview(DEMO_REVIEW).length === 0, JSON.stringify(validateReview(DEMO_REVIEW)));

/* 2. sample-review.json validates and renders */
const sample = JSON.parse(fs.readFileSync(path.join(__dirname, 'examples', 'sample-review.json'), 'utf8'));
const errs = loadReview(sample, 'loaded');
check('sample JSON loads with zero errors', errs.length === 0, JSON.stringify(errs));
check('33 tiles rendered', (elems['timeline'].innerHTML.match(/class="cell"/g) || []).length === 33);
check('verdict text set', elems['vVerdictText'].textContent === 'Needs revision');
check('score 2.6 shown', elems['vScore'].textContent === '2.6 / 5');
check('criteria strip has 5 chips', (elems['critStrip'].innerHTML.match(/crit-chip/g) || []).length === 5);
check('connector rendered', elems['timeline'].innerHTML.includes('Unresolved contradiction'));
check('3 findings in sidebar', (elems['findingList'].innerHTML.match(/finding-btn/g) || []).length === 3);
check('evidence quotes rendered in diagnosis row', (elems['c-evidence'].innerHTML.match(/equote/g) || []).length >= 3);
check('main issue set', elems['mainIssueText'].textContent.includes('slide 11'));
check('fix list has 3 items', (elems['fixList'].innerHTML.match(/<li>/g) || []).length === 3);
check('src label shows Loaded', elems['srcLabel'].innerHTML.includes('Loaded'));

/* 3. validation rejects bad input */
const bad1 = JSON.parse(JSON.stringify(sample)); bad1.findings[0].evidence = [];
check('rejects finding with no evidence', validateReview(bad1).some(e => e.includes('Quote or abstain')));
const bad2 = JSON.parse(JSON.stringify(sample)); bad2.findings.push(bad2.findings[0], bad2.findings[1]);
check('rejects more than three findings', validateReview(bad2).some(e => e.includes('Maximum three')));
const bad3 = JSON.parse(JSON.stringify(sample)); delete bad3.scorecard;
check('rejects missing scorecard', validateReview(bad3).some(e => e.includes('scorecard is missing')));
const bad4 = JSON.parse(JSON.stringify(sample)); bad4.findings[0].severity = 'huge';
check('rejects bad severity', validateReview(bad4).some(e => e.includes('severity')));
check('rejects non-object', validateReview([1,2]).length === 1);

/* 4. typed-attempt gate */
loadReview(sample, 'loaded');
selectFinding(0);
check('reveal disabled with empty attempt', elems['revealBtn'].disabled === true);
coachState[0].attempt = 'short';
updateGate();
check('reveal disabled with short attempt', elems['revealBtn'].disabled === true);
coachState[0].attempt = REVIEW.findings[0].reflect;            /* copy of the question */
updateGate();
check('reveal disabled when answer copies the question', elems['revealBtn'].disabled === true, elems['gateNote'].textContent);
check('copy-of-question message shown', elems['gateNote'].textContent.includes('restates the question'));
coachState[0].attempt = 'Kove won against AWS and the verdict survived appeal, so I would open with mid tier targets to build precedent and save the hyperscalers for after the patent survives review.';
updateGate();
check('reveal enabled with a real attempt', elems['revealBtn'].disabled === false, elems['gateNote'].textContent);
revealFix();
check('finding 1 revealed', coachState[0].revealed === true);
check('compare shows student answer', elems['cmpYou'].innerHTML.includes('Kove won against AWS'));
check('fix box shown', elems['fixBox']._cls.has('show'));

/* 5. no-ghostwrite cap: two reveals without a rewrite, third requires it */
check('skip streak is 1 after reveal without rewrite', skipStreak === 1);
selectFinding(1);
coachState[1].attempt = 'A partner could not state the answer from the opening. One sentence naming the categories to acquire, the timing window and the order would fix the opening for the reader.';
updateGate();
check('finding 2 unlocks with attempt only (streak below cap)', elems['revealBtn'].disabled === false);
revealFix();
check('skip streak is 2 after second reveal without rewrite', skipStreak === 2);
selectFinding(2);
coachState[2].attempt = 'In the next 90 days the client should bid on the adaptive streaming patent, price it from comparable PAE deals and set a licensing revenue target for the first enforcement.';
updateGate();
check('finding 3 reveal blocked: rewrite now required', elems['revealBtn'].disabled === true);
check('rewrite label switches to required', elems['rewriteLabel'].textContent.startsWith('Required'));
check('cap warning shown', elems['gateNote'].textContent.includes('without drafting an attempt'));
coachState[2].rewrite = 'Acquire US9313529B2 first at an estimated 2 to 4 million, enforce against one mid tier streamer by Q2.';
updateGate();
check('rewrite attempt unlocks the reveal', elems['revealBtn'].disabled === false);
revealFix();
check('streak resets after a drafted rewrite', skipStreak === 0);
check('compare shows the draft', elems['cmpYou'].innerHTML.includes('Your draft'));

/* 6. self-explanation */
elems['explainBox'].value = 'too short';
saveExplain();
check('short explanation rejected', coachState[2].explainSaved === false);
elems['explainBox'].value = 'It carries the slide 16 ranking into an action the client can fund and verify.';
saveExplain();
check('explanation saved', coachState[2].explainSaved === true);
check('explanation persisted to session', Object.keys(sessionStorage._m).length === 1);

/* 7. state preserved when switching findings */
selectFinding(0);
check('finding 1 still revealed after switching back', elems['fixBox']._cls.has('show'));
selectFinding(2);
check('finding 3 explanation restored', elems['explainBox'].value.includes('slide 16 ranking'));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
