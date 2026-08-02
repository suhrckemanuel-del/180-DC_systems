#!/usr/bin/env bash
# Exhaustive per-rule test for check-gold.js. Builds tiny fabricated real-00 fixtures in a
# temp dir, each aimed at one check, and asserts the expected code appears (or is absent).
# Portable: resolves paths relative to this file. No real case is touched.
# Run: bash check-gold.test.sh
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
V2="$(cd "$HERE/../../.." && pwd)"
CHK="$V2/check-gold.js"
TMP="$(mktemp -d)"
pass=0; fail=0

base_head='# Worksheet: real-00. Labeler: ZZ. Date: 2026-07-25

- **Case file:** real-00-fabricated-fixture.md
- **Conflicts:** no
- **Time spent:** 30 min
'
tail_sections='
## Acceptable AI feedback
ok
## Unacceptable AI feedback
ok
## False positives to avoid
ok
## False negatives to catch
ok
## Honest uncertainty
ok
'

emit() { # $1 file  $2 readiness-line  $3 blocking-line  $4 issues-block
  printf '%s\n## Expected readiness\n\n- **Level:** %s\n- **One-sentence reason:** r\n- **Blocking rules fired, if any:** %s\n\n## Real top issues, ranked\n\n%s\n%s' \
    "$base_head" "$2" "$3" "$4" "$tail_sections" > "$1"
}
want()   { out="$(node "$CHK" "$3" 2>&1)"; if echo "$out" | grep -q "$2"; then echo "  ok   $1 -> $2"; pass=$((pass+1)); else echo "  FAIL $1 -> expected $2"; echo "$out" | sed 's/^/       /'; fail=$((fail+1)); fi; }
wantnot(){ out="$(node "$CHK" "$3" 2>&1)"; if echo "$out" | grep -q "$2"; then echo "  FAIL $1 -> did not expect $2"; fail=$((fail+1)); else echo "  ok   $1 -> no $2"; pass=$((pass+1)); fi; }

I1='1. issue one.
   - severity: major; dimension: Evidence quality; type: evidence; at: s9
   - **[MUST-CATCH]**'

echo "== canonical fixtures =="
node "$CHK" "$HERE/real-00.gold.PASS.md" >/dev/null 2>&1 && { echo "  ok   PASS fixture exits 0"; pass=$((pass+1)); } || { echo "  FAIL PASS fixture should exit 0"; fail=$((fail+1)); }
node "$CHK" "$HERE/real-00.gold.FAIL.md" >/dev/null 2>&1 && { echo "  FAIL FAIL fixture should exit 1"; fail=$((fail+1)); } || { echo "  ok   FAIL fixture exits 1"; pass=$((pass+1)); }

echo "== C-mustcatch =="
emit "$TMP/mc0.md" "R2 Needs targeted revision" "under-supported (R2 ceiling)" '1. x
   - severity: major; dimension: Evidence quality; type: evidence; at: s9'
want "no must-catch, not restraint" "C-mustcatch:" "$TMP/mc0.md"
emit "$TMP/mc2.md" "R2 Needs targeted revision" "under-supported (R2 ceiling)" '1. a
   - severity: major; dimension: Evidence quality; type: evidence; at: s9
   - **[MUST-CATCH]**
2. b
   - severity: major; dimension: Problem framing; type: logic; at: s3
   - **[MUST-CATCH]**'
want "two must-catch" "C-mustcatch:" "$TMP/mc2.md"

echo "== C-readiness =="
emit "$TMP/rl.md" "totally not a level" "none" "$I1"
want "invalid readiness" "C-readiness:" "$TMP/rl.md"

echo "== C-severity / C-dimension / C-issuetype =="
emit "$TMP/badmeta.md" "R2 Needs targeted revision" "under-supported (R2 ceiling)" '1. x
   - severity: hgih; dimension: Made-up dim; type: banana; at: s9
   - **[MUST-CATCH]**'
want "invalid severity" "C-severity:" "$TMP/badmeta.md"
want "invalid dimension" "C-dimension:" "$TMP/badmeta.md"
want "invalid issuetype" "C-issuetype:" "$TMP/badmeta.md"

echo "== C-ceiling =="
emit "$TMP/ceil.md" "R3 Nearly ready with minor edits" "unsupported core (R1 ceiling)" "$I1"
want "readiness above cited ceiling" "C-ceiling:" "$TMP/ceil.md"

echo "== C-escalation-floor (blocking absent) =="
emit "$TMP/floor.md" "R1 Needs substantial revision" "none" '1. x
   - severity: major; dimension: Evidence quality; type: evidence; at: s9
   - **[MUST-CATCH]**'
want "R1 with no blocking rule" "C-escalation-floor:" "$TMP/floor.md"

echo "== C-over-escalation (blocking absent, all minor) =="
emit "$TMP/over.md" "R2 Needs targeted revision" "none" '1. x
   - severity: minor; dimension: Slide-level communication; type: communication; at: s9
   - **[MUST-CATCH]**'
want "R2 no-blocker all-minor" "C-over-escalation:" "$TMP/over.md"

echo "== C-critical-under-R3 =="
emit "$TMP/critr3.md" "R3 Nearly ready with minor edits" "unsupported core (R3 ceiling)" '1. x
   - severity: critical; dimension: Evidence quality; type: evidence; at: s9
   - **[MUST-CATCH]**'
want "critical under R3" "C-critical-under-R3:" "$TMP/critr3.md"

echo "== C-crit-needs-block (blocking absent) =="
emit "$TMP/critnb.md" "R2 Needs targeted revision" "none" '1. x
   - severity: critical; dimension: Evidence quality; type: evidence; at: s9
   - **[MUST-CATCH]**'
want "critical without blocking rule" "C-crit-needs-block:" "$TMP/critnb.md"

echo "== C-mustcatch-minor =="
emit "$TMP/mcmin.md" "R2 Needs targeted revision" "under-supported (R2 ceiling)" '1. x
   - severity: minor; dimension: Slide-level communication; type: communication; at: s9
   - **[MUST-CATCH]**'
want "minor must-catch" "C-mustcatch-minor:" "$TMP/mcmin.md"

echo "== C-section (missing sections) =="
printf '%s\n## Expected readiness\n\n- **Level:** R2 Needs targeted revision\n- **One-sentence reason:** r\n- **Blocking rules fired, if any:** under-supported (R2 ceiling)\n\n## Real top issues, ranked\n\n%s\n' "$base_head" "$I1" > "$TMP/nosec.md"
want "missing prose sections" "C-section:" "$TMP/nosec.md"

echo "== restraint case reads clean =="
emit "$TMP/restraint.md" "R3 Nearly ready with minor edits" "none" '1. deck is strong, only polish.
   - severity: minor; dimension: Slide-level communication; type: communication; at: s2

**none, restraint case.** What a good review should praise is under Acceptable AI feedback.'
wantnot "restraint no false mustcatch flag" "C-mustcatch:" "$TMP/restraint.md"
wantnot "restraint no over-escalation" "C-over-escalation:" "$TMP/restraint.md"

echo
echo "RESULT: $pass passed, $fail failed"
rm -rf "$TMP"
exit $fail
