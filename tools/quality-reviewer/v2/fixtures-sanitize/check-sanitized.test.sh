#!/usr/bin/env bash
# Per-category test for check-sanitized.js. Builds tiny fixtures in a temp dir, each aimed
# at one detection, and asserts the expected id and exit code. No real case is touched.
# Also runs the two committed fixtures (clean passes, dirty is caught).
# Run: bash check-sanitized.test.sh
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
V2="$(cd "$HERE/.." && pwd)"
CHK="$V2/check-sanitized.js"
TMP="$(mktemp -d)"
pass=0; fail=0

emit() { printf '%s\n' "$2" > "$TMP/$1"; }

# want <label> <grep-pattern> <file> <expected-exit>
want() {
  out="$(node "$CHK" "$TMP/$3" 2>&1)"; code=$?
  if echo "$out" | grep -q "$2" && [ "$code" = "$4" ]; then
    echo "  ok   $1 -> $2 (exit $code)"; pass=$((pass+1))
  else
    echo "  FAIL $1 -> expected $2 exit $4, got exit $code"; echo "$out" | sed 's/^/       /'; fail=$((fail+1))
  fi
}
# wantnot <label> <grep-pattern> <file>  (asserts pattern absent, exit 0)
wantnot() {
  out="$(node "$CHK" "$TMP/$3" 2>&1)"; code=$?
  if echo "$out" | grep -q "$2"; then
    echo "  FAIL $1 -> did not expect $2"; fail=$((fail+1))
  elif [ "$code" != "0" ]; then
    echo "  FAIL $1 -> expected exit 0, got $code"; echo "$out" | sed 's/^/       /'; fail=$((fail+1))
  else
    echo "  ok   $1 -> no $2 (exit 0)"; pass=$((pass+1))
  fi
}

echo "== high-confidence categories (each must block, exit 1) =="
emit email.md   'Reach me at jane.doe@bigcorp.com for details.';            want email      '\[email\]'          email.md   1
emit url.md     'See https://bigcorp.com/deck for the model.';              want url        '\[url\]'            url.md     1
emit handle.md  'Follow updates on @bigcorp for the latest.';              want handle     '\[handle\]'         handle.md  1
emit org.md     'Prepared for Acme Logistics Holdings this quarter.';       want org        '\[company-suffix\]' org.md     1
emit person.md  'Contact Dr Helena Vos about the scope.';                   want person     '\[honorific-name\]' person.md  1
emit phone.md   'Call the desk at +31 20 123 4567 any weekday.';           want phone      '\[phone\]'          phone.md   1
emit domain.md  'More detail lives at bigcorp.nl for reference.';           want domain     '\[domain\]'         domain.md  1

echo "== review-tier categories (must surface, do not block, exit 0) =="
emit conf.md    'This deck is CONFIDENTIAL and internal use only.';         want conf       '\[confidential-mark\]' conf.md 0
emit logo.md    'The client logo sits on the title slide.';                 want logo       '\[logo-mark\]'      logo.md    0
emit money.md   'Cost to serve was EUR 1,284,530 last year.';               want money      '\[precise-money\]'  money.md   0

echo "== must NOT flag (sanitized placeholders and plain data) =="
emit ph1.md     'Prepared for Client A by the team.';                       wantnot ph1     'NOT SAFE'           ph1.md
emit ph2.md     'Stakeholder B, the finance lead, approved scope.';        wantnot ph2     'NOT SAFE'           ph2.md
emit ph3.md     'Cost was in the [BANDED] range last year.';               wantnot ph3     'NOT SAFE'           ph3.md
emit ph4.md     'Order counts were 4,231 / 5,003 / 4,988 per depot.';      wantnot ph4     'NOT SAFE'           ph4.md
emit ph5.md     'Volume ranged from 4,000 to 6,000 orders (banded).';      wantnot ph5     'NOT SAFE'           ph5.md
emit ph6.md     'Reference deck at example.com/deck for the layout.';       wantnot ph6     'NOT SAFE'           ph6.md
emit ph7.md     'The renderer is index.html and the check is check-review-v2.js.'; wantnot ph7 'NOT SAFE'       ph7.md

echo "== committed fixtures =="
out="$(node "$CHK" "$HERE/clean.md" 2>&1)"; code=$?
if echo "$out" | grep -q 'CLEAN' && [ "$code" = 0 ]; then echo "  ok   clean.md -> CLEAN (exit 0)"; pass=$((pass+1)); else echo "  FAIL clean.md"; echo "$out" | sed 's/^/       /'; fail=$((fail+1)); fi
out="$(node "$CHK" "$HERE/dirty.md" 2>&1)"; code=$?
if echo "$out" | grep -q 'NOT SAFE TO RUN' && [ "$code" = 1 ]; then echo "  ok   dirty.md -> NOT SAFE (exit 1)"; pass=$((pass+1)); else echo "  FAIL dirty.md"; echo "$out" | sed 's/^/       /'; fail=$((fail+1)); fi

echo
echo "pass=$pass fail=$fail"
rm -rf "$TMP"
[ "$fail" = 0 ]
