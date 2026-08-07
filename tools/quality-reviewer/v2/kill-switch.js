#!/usr/bin/env node
/* The kill switch. 22-trust-boundary.md section 4.

   If A1 or A2 is falsified, the hosted tool has to stop being used within the
   hour. There is no backend and there is not going to be one: index.html makes
   no network request of any kind, and that property is worth more to this
   project than a remote kill would be. So the switch is a committed constant
   and a redeploy, and the whole path is three commands.

       node kill-switch.js on "one line on why, shown to whoever opens it"
       node build-site.js
       npx wrangler pages deploy site --project-name=180dc-reviewer --branch=main

   Reverse it with `node kill-switch.js off` and the same two deploy commands.
   `node kill-switch.js status` prints the current state and writes nothing.

   What this reaches: the hosted URL, on the next page load, for everyone.
   What it does not reach: a tab already open, a copy saved to a laptop, a
   student pack already sent. Those are covered by the build-age notice in
   index.html and by telling people, and the honest limits are written down in
   22-trust-boundary section 4. */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'index.html');
const BLOCK = /var KILL = \{[^}]*\};/;

const mode = (process.argv[2] || 'status').toLowerCase();
const reason = process.argv[3] || '';

const html = fs.readFileSync(SRC, 'utf8');
const found = BLOCK.exec(html);
if (!found) {
  console.error('no KILL block in index.html. It should read: var KILL = { active:false, ... };');
  process.exit(1);
}

function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/[\r\n]+/g, ' '); }

if (mode === 'status') {
  console.log(found[0]);
  console.log('\non:  node kill-switch.js on "why"     off: node kill-switch.js off');
  process.exit(0);
}

if (mode !== 'on' && mode !== 'off') {
  console.error('usage: node kill-switch.js on "why" | off | status');
  process.exit(1);
}

if (mode === 'on' && reason.trim().length < 15) {
  console.error('give a reason in a sentence. It is the only thing anyone opening the link will see.');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const next = mode === 'on'
  ? `var KILL = { active:true, since:'${today}', reason:'${esc(reason.trim())}', contact:'the reviewer owner named in STATUS.md' };`
  : `var KILL = { active:false, since:'', reason:'', contact:'' };`;

fs.writeFileSync(SRC, html.replace(BLOCK, next));

/* Read back what was written rather than trusting the write, same rule as
   build-site.js. A kill switch that silently failed to flip is worse than none. */
const after = BLOCK.exec(fs.readFileSync(SRC, 'utf8'));
if (!after || after[0] !== next) {
  console.error('the write did not take. index.html still reads:\n  ' + (after ? after[0] : 'no KILL block'));
  process.exit(1);
}

console.log(after[0]);
console.log(`\nthe tool is now ${mode === 'on' ? 'OFF' : 'ON'} in the source. It is not live until you deploy:`);
console.log('  node build-site.js');
console.log('  npx wrangler pages deploy site --project-name=180dc-reviewer --branch=main');
