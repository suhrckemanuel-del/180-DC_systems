#!/usr/bin/env bash
# Per-rule test for score-review.js. Runs the fabricated real-00 review fixtures against
# the fabricated real-00 golds and asserts every verdict the scorer can produce.
# Portable: resolves paths relative to this file. No real case is touched.
# Run: bash score-review.test.sh
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
V2="$(cd "$HERE/../../.." && pwd)"
SCORE="$V2/score-review.js"
TMP="$(mktemp -d)"
# node here is a Windows binary under Git Bash and cannot resolve a /tmp/... path
command -v cygpath >/dev/null 2>&1 && TMP="$(cygpath -m "$TMP")"
pass=0; fail=0

score() { # $1 review fixture  $2 gold fixture -> writes $TMP/out.json
  node "$SCORE" "$HERE/$1" "$HERE/$2" --json > "$TMP/out.json" 2>"$TMP/err.txt"
}
check() { # $1 label  $2 js expression over `s`  $3 expected
  got="$(node -e "const s=require('$TMP/out.json'); const v=($2); console.log(typeof v==='string'?v:JSON.stringify(v));" 2>&1)"
  if [ "$got" = "$3" ]; then echo "  ok   $1"; pass=$((pass+1));
  else echo "  FAIL $1 -> expected $3, got $got"; fail=$((fail+1)); fi
}

echo "== HIT review vs the PASS gold: exact readiness, must-catch found =="
score real-00.review.HIT.json real-00.gold.PASS.md
check "readiness exact"          "s.readiness.exact"              "true"
check "readiness within-one"     "s.readiness.withinOne"          "true"
check "readiness direction"      "s.readiness.direction"          "exact"
check "must-catch hit"           "s.mustCatch.verdict"            "hit"
check "match is finding 1"       "s.mustCatch.match.findingIndex" "0"
check "all three signals agree"  "s.mustCatch.match.support"      "3"
check "severity exact"           "s.severityAlignment.exact"      "true"
check "no over-flag"             "s.restraint.overFlag"           "false"

echo "== NEAR review: right concept, wrong slide and wrong type, stays a near miss =="
score real-00.review.NEAR.json real-00.gold.PASS.md
check "verdict near"             "s.mustCatch.verdict"            "near"
check "text score is high"       "s.mustCatch.match.textScore>=0.45" "true"
check "only one signal"          "s.mustCatch.match.support"      "1"
check "no severity alignment"    "s.severityAlignment"            "null"

echo "== MISS review: catches only surface issues =="
score real-00.review.MISS.json real-00.gold.PASS.md
check "verdict miss"             "s.mustCatch.verdict"            "miss"
check "no match recorded"        "s.mustCatch.match"              "null"
check "readiness not exact"      "s.readiness.exact"              "false"
check "readiness within-one"     "s.readiness.withinOne"          "true"
check "under-flag"               "s.readiness.direction"          "under-flag"
check "non-must-catch still counted" "s.issueCoverage.hits"       "1"

echo "== OVERFLAG review vs the PASS gold: two levels harsh =="
score real-00.review.OVERFLAG.json real-00.gold.PASS.md
check "delta"                    "s.readiness.delta"              "-2"
check "not within-one"           "s.readiness.withinOne"          "false"
check "over-flag"                "s.readiness.direction"          "over-flag"
check "escalation steps"         "s.restraint.escalationSteps"    "2"
check "criticals with none in gold" "s.restraint.manufacturedCriticals" "2"
check "severity harsher"         "s.severityAlignment.direction"  "harsher"
check "must-catch still found"   "s.mustCatch.verdict"            "hit"

echo "== restraint gold: escalating a strong deck is a scored failure =="
score real-00.review.OVERFLAG.json real-00.gold.RESTRAINT.md
check "restraint case detected"  "s.restraint.isRestraintCase"    "true"
check "violation"                "s.restraint.violation"          "true"
check "blocking false positive"  "s.restraint.blockingFalsePositive" "true"
check "no must-catch to score"   "s.mustCatch.present"            "false"
check "must-catch verdict na"    "s.mustCatch.verdict"            "na"

score real-00.review.HIT.json real-00.gold.RESTRAINT.md
check "one level of escalation still violates" "s.restraint.violation" "true"
check "but it is within one"     "s.readiness.withinOne"          "true"

score real-00.review.MISS.json real-00.gold.RESTRAINT.md
check "restrained review, no violation" "s.restraint.violation"   "false"
check "restrained review, exact"        "s.readiness.exact"       "true"

echo "== hard rule 2: a gold that fails check-gold.js is never scored =="
if node "$SCORE" "$HERE/real-00.review.HIT.json" "$HERE/real-00.gold.FAIL.md" >/dev/null 2>&1; then
  echo "  FAIL scored against a contradictory gold"; fail=$((fail+1))
else
  echo "  ok   refused a contradictory gold"; pass=$((pass+1))
fi

echo "== eligibility gate (copies, so no real gold is touched) =="
mkdir -p "$TMP/golds"
cp "$HERE/real-00.gold.PASS.md"      "$TMP/golds/real-90.gold.md"
cp "$HERE/real-00.gold.FAIL.md"      "$TMP/golds/real-91.gold.md"
cp "$HERE/real-00.gold.RESTRAINT.md" "$TMP/golds/real-92.gold.md"
{ head -1 "$HERE/real-00.gold.PASS.md"; echo; echo "> REVIEW-NEEDED: readiness call pending a human."; tail -n +2 "$HERE/real-00.gold.PASS.md"; } > "$TMP/golds/real-93.gold.md"
node "$SCORE" --eligible "$TMP/golds" --json > "$TMP/out.json" 2>&1
check "two of four usable"       "s.filter(r=>r.eligible).length" "2"
check "contradictory one skipped" "s.find(r=>r.file.includes('real-91')).eligible" "false"
check "review-needed one skipped" "s.find(r=>r.file.includes('real-93')).reasons[0]" "carries a REVIEW-NEEDED banner, human call pending"

echo "== matcher internals =="
SCORE_REQ="$SCORE"
command -v cygpath >/dev/null 2>&1 && SCORE_REQ="$(cygpath -m "$SCORE")"
got="$(node -e "const{_concepts}=require('$SCORE_REQ');console.log([..._concepts('reccomendation')].join(','))")"
if [ "$got" = "@recommendation" ]; then echo "  ok   a typed gold typo still reaches its concept"; pass=$((pass+1));
else echo "  FAIL typo folding -> got $got"; fail=$((fail+1)); fi
got="$(node -e "const{_concepts}=require('$SCORE_REQ');console.log([..._concepts('the deck has no executive summary')].join(','))")"
if [ "$got" = "@execsummary" ]; then echo "  ok   phrase folds to one concept"; pass=$((pass+1));
else echo "  FAIL phrase folding -> got $got"; fail=$((fail+1)); fi

rm -rf "$TMP"
echo
echo "passed $pass, failed $fail"
[ "$fail" -eq 0 ]
