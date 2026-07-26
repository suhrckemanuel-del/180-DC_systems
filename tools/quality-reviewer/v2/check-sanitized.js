/* Scan a deck for likely client identifiers before it is run through the reviewer.
   Usage: node check-sanitized.js <deck.md|deck.txt> [--json]
   This is the machine backstop for SANITIZATION.md. It never edits the file and never
   decides a deck is safe: it flags what a human must clear. A clean scan means the
   automatable checks found nothing, not that the deck is confirmed sanitized.
   It mirrors the sanitization protocol in 07-workflow.md section E and the pre-API
   sanitization step the pilot proxy will enforce.
   Exit 0 no high-confidence identifiers (review-tier items may still print),
   exit 1 at least one high-confidence identifier, exit 2 usage or read error. */
'use strict';
const fs = require('fs');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const path = args.find(a => !a.startsWith('--'));
if (!path) {
  console.error('usage: node check-sanitized.js <deck.md|deck.txt> [--json]');
  process.exit(2);
}

let text;
try { text = fs.readFileSync(path, 'utf8'); }
catch (e) { console.error('cannot read ' + path + ': ' + e.message); process.exit(2); }

const lines = text.split(/\r?\n/);

// Placeholders a sanitized deck is expected to use. Matches on these are never flagged,
// so a correctly scrubbed deck passes clean. Drawn from 07-workflow.md section E.
const PLACEHOLDER = /\b(client|stakeholder|team|project|company|vendor|partner|supplier|competitor|region|city|product|brand)\s+[A-Z]\b/i;
const PLACEHOLDER_ROLE = /\bthe\s+(finance|marketing|operations|hr|it|sales|product|strategy|commercial|legal|procurement)\s+(lead|head|director|manager|team|department)\b/i;
const REDACTION_TOKEN = /\[(redacted|client|banded|removed|name|figure|anon[a-z]*)\b[^\]]*\]/i;
// Placeholder / documentation domains that never identify a real client.
const SAFE_DOMAIN = /\b(example|localhost|test|invalid|placeholder|clienta|company[abc])\.(com|org|net|nl|eu|io|co)\b/i;

// High-confidence identifier patterns. A hit here means the deck is not safe to run.
const HIGH = [
  { id: 'email',
    re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    msg: 'email address' },
  { id: 'url',
    re: /\bhttps?:\/\/[^\s)>\]]+/gi,
    msg: 'web URL' },
  { id: 'handle',
    re: /(^|[\s(])@[A-Za-z0-9_]{2,}\b/g,
    msg: 'social or chat handle' },
  { id: 'company-suffix',
    re: /\b[A-Z][A-Za-z&.\-]+(?:\s+[A-Z][A-Za-z&.\-]+)*[\s,]+(?:Ltd|Limited|Inc|Incorporated|LLC|PLC|GmbH|B\.?V\.?|N\.?V\.?|S\.?A\.?|Corp|Corporation|Holding|Holdings|Group)\b\.?/g,
    msg: 'named organisation (legal suffix)' },
  { id: 'honorific-name',
    re: /\b(?:Mr|Mrs|Ms|Dr|Prof|Sir|Madam)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g,
    msg: 'named person (honorific)' },
  { id: 'phone',
    // requires + country code or a parenthesised area code, so data tables do not trip it
    re: /(?:\+\d{1,3}[\s.\-]?)(?:\(0?\d{1,4}\)[\s.\-]?|\d{1,4}[\s.\-]?)\d{2,4}[\s.\-]?\d{2,4}(?:[\s.\-]?\d{2,4})?|\(0\d{1,3}\)[\s.\-]?\d{3,4}[\s.\-]?\d{2,4}/g,
    msg: 'phone number' }
];

// Web domain, checked with a real-TLD list so filenames like index.html do not trip it.
const DOMAIN_RE = /\b(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(com|org|net|nl|eu|io|co|de|fr|be|uk|gov|edu|info|biz|ai|app|dev)\b/gi;

// Review-tier patterns. These do not block automatically but a human must clear them.
const REVIEW = [
  { id: 'confidential-mark',
    re: /\b(confidential|proprietary|do not distribute|internal use only)\b/gi,
    msg: 'confidentiality marking (often a client header or footer)' },
  { id: 'logo-mark',
    re: /\b(logo|letterhead|header image|footer image)\b/gi,
    msg: 'logo or letterhead reference' },
  { id: 'precise-money',
    // grouped currency amount whose last three digits are not round, so it looks unbanded
    re: /(?:[€$£]|EUR|USD|GBP)\s?\d{1,3}(?:[.,]\d{3})+(?![+\-\u2013\u2014])|\d{1,3}(?:[.,]\d{3})+\s?(?:euros?|dollars?|pounds?)\b/gi,
    msg: 'precise currency figure (band it or mark it banded)' }
];

function safeContext(line, matchIndex, matchText) {
  // A match is safe if it sits inside a placeholder, role, redaction token or safe domain.
  const around = line.slice(Math.max(0, matchIndex - 30), matchIndex + matchText.length + 30);
  return PLACEHOLDER.test(around) || PLACEHOLDER_ROLE.test(around) ||
         REDACTION_TOKEN.test(around) || SAFE_DOMAIN.test(matchText) ||
         SAFE_DOMAIN.test(around);
}

const hits = [];   // high-confidence
const reviews = []; // review-tier

function scan(patterns, bucket, tier) {
  for (let n = 0; n < lines.length; n++) {
    const line = lines[n];
    for (const p of patterns) {
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(line)) !== null) {
        const matchText = m[0].trim();
        if (!matchText) { if (m.index === p.re.lastIndex) p.re.lastIndex++; continue; }
        if (!safeContext(line, m.index, m[0])) {
          bucket.push({ tier, id: p.id, line: n + 1, msg: p.msg, snippet: matchText.slice(0, 80) });
        }
        if (m.index === p.re.lastIndex) p.re.lastIndex++;
      }
    }
  }
}

scan(HIGH, hits, 'high');
scan(REVIEW, reviews, 'review');

// Domains, filtered so plain filenames and safe domains do not count.
for (let n = 0; n < lines.length; n++) {
  const line = lines[n];
  DOMAIN_RE.lastIndex = 0;
  let m;
  while ((m = DOMAIN_RE.exec(line)) !== null) {
    const matchText = m[0].trim();
    if (SAFE_DOMAIN.test(matchText) || safeContext(line, m.index, m[0])) continue;
    // skip if already caught as part of an email or url on this line at this position
    if (hits.some(h => h.line === n + 1 && h.snippet.includes(matchText))) continue;
    hits.push({ tier: 'high', id: 'domain', line: n + 1, msg: 'web domain', snippet: matchText.slice(0, 80) });
  }
}

hits.sort((a, b) => a.line - b.line);
reviews.sort((a, b) => a.line - b.line);

if (asJson) {
  console.log(JSON.stringify({ file: path, high: hits, review: reviews,
    safe: hits.length === 0 }, null, 2));
  process.exit(hits.length ? 1 : 0);
}

function fmt(list) {
  return list.map(h => '  - line ' + h.line + ' [' + h.id + '] ' + h.msg + ': "' + h.snippet + '"').join('\n');
}

if (hits.length === 0 && reviews.length === 0) {
  console.log('CLEAN: no automatable identifiers found in ' + path);
  console.log('  This is not a sign-off. A human must still apply SANITIZATION.md before any run.');
  process.exit(0);
}

if (hits.length) {
  console.log('NOT SAFE TO RUN: ' + hits.length + ' high-confidence identifier(s) in ' + path);
  console.log(fmt(hits));
}
if (reviews.length) {
  console.log((hits.length ? '\n' : '') + 'REVIEW: ' + reviews.length + ' item(s) a human must clear');
  console.log(fmt(reviews));
}
console.log('\nSanitize per SANITIZATION.md, then re-run. The scanner catches patterns, not judgement.');
process.exit(hits.length ? 1 : 0);
