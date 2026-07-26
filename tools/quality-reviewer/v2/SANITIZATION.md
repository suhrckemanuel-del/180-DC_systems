# Sanitization gate

The one thing a lead does before any real deck is run through the reviewer. Ten minutes.
No real client material touches the tool until this is done and the confidentiality owner
has signed the gate. This is plan item 3a, drawn from [07-workflow.md](07-workflow.md)
section E and [12-real-deck-intake.md](12-real-deck-intake.md) Q3.

## Why this exists

A single leaked client identifier can end a client relationship and expose the branch. The
reviewer only needs the shape of the work, the argument, the evidence and the
recommendation, not who the client is. So strip identity, keep substance.

## The ten-minute checklist

Work through the deck text top to bottom and do all seven:

1. **Client name to a label.** Replace the client name everywhere with `Client A`. Same for
   any second party: `Vendor B`, `Competitor C`, `Partner D`.
2. **People to roles.** Replace every named person with a role: `Stakeholder B`,
   `the finance lead`, `the operations lead`. Remove honorifics and titles that name someone.
3. **Contact details out.** Delete every email address, phone number, URL, web domain and
   social or chat handle. If a link matters, describe what it pointed to.
4. **Logos, headers and footers.** Remove client logos, letterheads and any header or footer
   that names or brands the client. Delete confidentiality markings that are the client's own
   (`CONFIDENTIAL`, `do not distribute`), they identify the source.
5. **Figures banded.** Round or band any figure precise enough to identify the client, and
   mark it banded, for example `about EUR 5,000` or `low six figures` or `[BANDED]`. Plain
   operational data (order counts, percentages) can stay if it does not identify anyone.
6. **Places and specifics.** Generalise a location, product name or contract detail that
   points to one client. `Region A`, `the western depot`, `the flagship product`.
7. **Cannot sanitize a slide? Describe it.** If a slide loses its point once scrubbed, review
   it by describing what it shows, do not paste it.

If a slide cannot be sanitized and cannot be usefully described, leave it out. The reviewer
never needs the client's identity to do its job.

## The machine backstop

After you sanitize, run the scanner. It catches patterns a tired human misses. It never
edits the file and never says a deck is safe, it only flags what you must clear:

```
node check-sanitized.js path/to/deck.md
```

- Exit 0 and `CLEAN`: no automatable identifier found. Still your judgement, not a sign-off.
- Exit 1 and `NOT SAFE TO RUN`: high-confidence identifiers remain (email, URL, domain,
  handle, named organisation, named person, phone). Fix them and re-run.
- `REVIEW` items (confidentiality markings, logo references, precise currency figures) do not
  block, but you clear each one by hand before the run.

The scanner errs toward flagging. A false flag costs you a second to clear. A missed
identifier costs a client. When they conflict, it flags. Categories and the test harness are
in [fixtures-sanitize/](fixtures-sanitize/) (`bash check-sanitized.test.sh`).

## First live run is a two-person act

For the first sanitized real deck of the pilot, the project lead sanitizes and a second
person checks, per [12-real-deck-intake.md](12-real-deck-intake.md) Q3. After that a single
lead may sanitize solo, with the scanner as the backstop.

## Where this sits in the pilot proxy

When the serverless proxy is built (build track item 2), this gate is enforced server-side
BEFORE the API call, not after. The proxy runs the `check-sanitized.js` logic on the
uploaded deck first, and if it returns exit 1 the deck is rejected with the flag list and no
API call is made. A human still applies the checklist, the proxy only guarantees no
high-confidence identifier reaches the model. The sanitization step never runs after the
call, because by then the client text has already left the building.

## The rule

No reviewer run on any real deck before this checklist is applied, the scanner is clean of
high-confidence hits, and the confidentiality owner has signed the gate (plan item 3b).
Never commit a real client name or identifier to any file in this repo.
