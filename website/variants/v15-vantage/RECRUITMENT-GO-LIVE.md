# Recruitment go-live checklist

What changes on the site the day applications open, and what changes back when
they close. Written before the window so nobody has to work it out under time
pressure in September.

The application form is live and accepting responses **now**. That is why the
site does not link it yet: an application sent in August sits unread for a month,
and if the form is edited before the window opens, early applicants answered a
different set of questions than later ones, which makes them impossible to
compare fairly.

Form: `https://forms.monday.com/forms/b92d244ad59426f52dbe3d5fe76327d6?r=use1`

---

## The day the window opens

Four edits, all in `website/variants/v15-vantage/`.

### 1. Turn the gate into a link — `for-students.html`

Find the `<details class="gate">` block in the `#apply` section. Replace the
whole element with a plain link:

```html
<a class="button button--deep" href="FORM_URL" target="_blank" rel="noopener">Apply now</a>
```

The `<details>` exists only because there was nothing to link to. Once there is,
it is an ordinary button and the explanation it holds is no longer true.

### 2. Update the placeholder line — `for-students.html`

In the `#apply` section head, this line comes out entirely:

```html
<p><span class="placeholder">Placeholder — recruitment form opens in September…</span></p>
```

Replace with the real deadline, which is the single most useful fact on the page:

```html
<p class="apply-note"><strong>Applications close [DATE].</strong> Interviews run
[DATES]. Decisions before the cycle starts.</p>
```

Do not ship this step without a real closing date. A page that says applications
are open but never says until when is worse than one that says neither.

### 3. Update the placeholder count — `tools/audit-v15-r3.mjs`

`expectPlaceholders` drops `"for-students"` from 3 to 2. The suite fails on a
count mismatch, which is deliberate: it stops a placeholder being removed by
accident.

### 4. Check the stage descriptions still match reality

`#apply` publishes the selection process: screen, behavioural, read-a-slide,
case. If the process changed since it was written, the page is now telling
applicants how to prepare for something that will not happen.

---

## What must NOT change

**Email does not become the application route.** With hundreds of applicants a
shared inbox is not a pipeline: no dedupe, no status, no way to compare two
people side by side, and every reply is somebody's evening. The form feeds
Monday, which is where applicant data already lives. Email stays for questions
only.

**The stage descriptions stay published.** Naming what each interview looks at
is the fairness argument, not just reassurance: it means the criteria are known
to everyone rather than only to whoever knows a board member.

**No claim about what a consultant will have built.** Still not agreed by the
board.

---

## When the window closes

1. Revert step 1: the link becomes a `<details>` again, saying when the next
   window opens rather than repeating September.
2. Restore the placeholder in step 2, or replace it with the next window's dates
   if they are known.
3. Put the placeholder count back to 3.

A dead form link is worse than no link. Somebody who applies to a closed form
believes they have applied.

---

## Open, needs a person

- **Closing date, and the interview dates.** Step 2 cannot ship without them.
- **Who answers recruitment questions.** Currently the branch address. If it
  should be a named person, it needs an `@180dc.org` address and someone
  prepared for the volume.
- **Does the form still ask what the page says it asks?** The page lists CV,
  motivation letter, grade transcript and LinkedIn URL, read off the live form on
  2026-08-11. If fields change, the page is wrong.
- **Position options in form field 7** should match the role names on the page.
  Note the terminology conflict: `_brand/BRAND.md` says the official 180DC table
  bans "Team Leader" in favour of **Project Manager**, and uses **Junior** and
  **Senior Consultant**. The site currently says "Consultant / Team Leader".
  Whatever the form offers and the page says must agree, and both should match
  the official table.
