/* Validate any review JSON against the page's own validator and smoke-render it.
   Usage: node check-review.js <review.json> */
const fs = require('fs');
const path = require('path');

const target = process.argv[2];
if (!target) { console.error('usage: node check-review.js <review.json>'); process.exit(1); }

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

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
global.sessionStorage = { getItem(){ return null; }, setItem(){} };
global.FileReader = function(){};
global.setInterval = () => 0; global.clearInterval = () => {}; global.setTimeout = () => 0;

const marker = '/* ===' + 'CHECK=== */';
const checkSrc = fs.readFileSync(__filename, 'utf8').split(marker)[1];
eval(script + '\n' + checkSrc);
/* ===CHECK=== */

const obj = JSON.parse(fs.readFileSync(target, 'utf8'));
const errs = loadReview(obj, 'loaded');
if (errs.length) {
  console.log('INVALID:');
  errs.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
const tiles = (elems['timeline'].innerHTML.match(/class="cell"/g) || []).length;
console.log('VALID. Rendered: ' + tiles + ' tiles, ' +
  obj.findings.length + ' findings, verdict "' + obj.scorecard.verdict + '", overall ' + obj.scorecard.overall);
if (tiles !== obj.meta.slideCount) console.log('NOTE: tile count (' + tiles + ') differs from meta.slideCount (' + obj.meta.slideCount + ')');
process.exit(0);
