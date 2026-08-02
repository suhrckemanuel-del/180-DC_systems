# check-gold.js fixtures

Fabricated fixtures for the gold consistency checker. Fake case **real-00**, invented
content, no real client anywhere in here. Safe to commit and to run any time.

- `real-00.gold.PASS.md` — a well-formed gold. `node ../../../check-gold.js real-00.gold.PASS.md`
  must print `CONSISTENT` and exit 0.
- `real-00.gold.FAIL.md` — deliberately self-contradictory. Same command on it must print
  `CONTRADICTIONS` and exit 1.
- `check-gold.test.sh` — exhaustive per-rule harness. Builds tiny throwaway fixtures in a
  temp dir, one per check (both the blocking-present and blocking-absent branches), and
  asserts each rule fires or stays quiet as expected. Run: `bash check-gold.test.sh`.

These never touch a real case. The hard rule holds: no AI-written or AI-suggested gold for
any real case, and the checker only reports contradictions, it never sets a label.
