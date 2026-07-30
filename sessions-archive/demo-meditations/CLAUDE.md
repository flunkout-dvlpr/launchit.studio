# Project Brief: Daily Meditations

## What this is

A complete pipeline for a daily-passage philosophy app: Marcus Aurelius's
_Meditations_ (public domain translation), turned into a tagged dataset,
served through a small companion webpage, and delivered as one text message
a day, at the right local time, to anyone who signs up. No login, no app to
install, just a link that arrives by SMS.

## Why

Reading a full old translation of _Meditations_ can feel like homework, the
insight is excellent, the language is the barrier. This project preprocesses
the whole text once into a reusable dataset, then wraps it in the smallest
possible delivery mechanism: a daily text, timed to the recipient's own
timezone, linking to a page built to feel like reading rather than checking
a notification.

## The four phases, build in this order

1. **Dataset** — turn the source text into ~500 clean, tagged passages.
2. **Backend** — a scheduled job that texts the right passage to the right
   person at the right local hour, plus the API the webpage reads from.
3. **Frontend** — the page someone lands on when they tap their daily link.
4. **Deployment** — get both halves live, plus a fix for shared links.

Each phase below has enough detail to build that phase on its own. Together
they're the whole project.

---

## Phase 1 — Dataset

**Source material & copyright**: use a public-domain translation only,
George Long's 1862 translation via Standard Ebooks
(`https://standardebooks.org/ebooks/marcus-aurelius/meditations/george-long`)
is clean, well-formatted, and easy to parse. Do not use a modern copyrighted
translation (Gregory Hays especially) as pipeline input, it's fine as a
human reference for phrasing quality, never as source text.

**Chunking**: the source HTML has 12 `<section>` elements (one per book),
each a stream of `<p>`/`<blockquote>` tags with no passage numbers. Walk
each book's paragraphs and treat each `<p>` as a new passage, unless it's
short and immediately follows a `<blockquote>`, in which case treat it as a
trailing line belonging to that quote (needed because a few books quote
other writers at length, and without this rule those quotes get split from
their context). Expect roughly 480-510 final passages after a manual review
pass for any that need splitting or merging.

**Locked style instruction**, reused for every single passage rather than
improvised per-passage:

> Rewrite in warm, reflective modern English, as a thoughtful friend
> speaking gently to someone they respect. Keep it to 2-4 sentences. Favor
> invitations and quiet observations over commands. Preserve the original
> insight exactly, soften the delivery, never the truth. Light period detail
> is fine if it adds texture; otherwise keep imagery contemporary.

Think of it as independent knobs, not one vague instruction: directness
(low-medium), warmth (high), compression (medium), register (contemporary,
not slangy), address ("you," never commands), imagery (modernized by
default).

**Structured output**: have Claude call a tool (not free text) to produce
each passage: the modern rewrite, 1-3 situational tags (`starting-the-day`,
`difficult-people`, `overwhelmed`, `mortality`, etc., not academic
categories), and a short reflection question. Forced structured output
means never parsing free text, and makes the batch job resumable, if it
fails partway through, rerun it and it skips everything already written.

**Output schema** (one object per passage, NDJSON so it's resumable):

```json
{
  "id": "book2-num1",
  "source_book": 2,
  "source_number": 1,
  "original_text": "Betimes in the morning say to thyself...",
  "modern_text": "You'll probably run into someone today who's short-tempered...",
  "tags": ["difficult-people", "patience"],
  "reflection": "Who are you bracing for today, and could you expect them without resenting them?"
}
```

---

## Phase 2 — Backend

AWS SAM, deployed with `sam deploy`. Two DynamoDB tables, five Lambda
functions, one scheduled job.

**Tables**: `Subscribers` (hash key `phone`, holds `timezone`, `notifyHour`
0-23, `status`). `Assignments` (hash key `token`, a random ID per sent
passage, plus a secondary index on `phone` + `date`, used both for a
subscriber's send history and as the same-day dedupe check).

**Five functions, each doing one thing**: `Signup` (validates phone/timezone,
writes the subscriber, sends a welcome text plus an immediate first
passage so new subscribers don't wait up to 24h). `GetAssignment` (what the
webpage calls to fetch a passage by token). `SubmitReflection` (saves a
reflection back onto its assignment row). `DailySend` (the scheduler, next
section). `EdgePreview` (covered in Phase 4, it's a deploy-time concern).

**One clock, not one per timezone**: a single EventBridge schedule,
`cron(0 * * * ? *)`, fires once every hour. Each run, `DailySend` scans
active subscribers and computes each one's current local hour:

```js
function computeLocalHour(timezone, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, hour: "numeric", hour12: false,
  }).formatToParts(date)
  const hour = Number(parts.find((p) => p.type === "hour").value)
  return hour === 24 ? 0 : hour
}
```

If the local hour doesn't match the subscriber's `notifyHour`, skip them
this run. Twenty-four runs a day, each subscriber only actually gets
processed on the one run that matches. Before sending, query the
`phone`+`date` index for that subscriber's history, skip if today's date is
already in it (the same-day dedupe check), otherwise pick a passage they
haven't seen yet (looping back once the full set has been sent) and send.

**Sending**: SNS `PublishCommand` directly to the phone number (not a topic),
`MessageAttributes: { "AWS.SNS.SMS.SMSType": "Transactional" }`. Validate
phone numbers against a simple E.164 regex before writing or sending
anything. Opt-out (STOP/START) is handled automatically by SNS at the AWS
account level for messages sent this way, no custom STOP-keyword handling
needed or expected.

**Shared layer**: put the DynamoDB client, SNS client, phone/timezone
validation, the local-hour math, and the passage-picking logic in one
Lambda layer all five functions import from, instead of five copies of the
same boilerplate.

---

## Phase 3 — Frontend

A small Quasar (Vue 3) SPA, three pages, no login.

**Pages**: a signup form (phone, timezone, notify hour), a daily-passage
page at `/d/:token` (the link every text message points to), an about page.
No accounts, the token in the URL is the entire auth model.

**Design system**: two fonts only (Cinzel for headings, EB Garamond for
body), a small named color palette (parchment background, ink text, bronze
accent, muted "verdigris" and "terracotta" for success/error states), a
drop cap on each passage's first letter, a `❧` fleuron divider reused as
every section break, and paper/marble background textures built from SVG
`feTurbulence` noise filters rather than image files (no licensing
question, scales to any screen). Lock this vocabulary in early and reuse it
everywhere rather than inventing something new per page.

**Word-by-word reveal**: split the passage text on spaces in a plain
computed property, wrap each word in its own `<span>`, then animate all of
them in with GSAP. Budget the per-word stagger against total word count
(`Math.min(0.03, 1.4 / wordCount)`) so a 150-word passage and a 40-word one
both finish revealing in roughly the same total time, rather than a fixed
per-word delay making long passages take proportionally longer.

**State**: no state management library. Each page holds its own
`loading`/`error`/data locally; a thin `fetch` wrapper handles the three
API calls (get assignment, submit reflection, sign up). Three pages sharing
nothing don't need a global store.

---

## Phase 4 — Deployment

Backend deploys the standard way, `sam deploy`. Frontend is a static SPA
(S3 + CloudFront) deployed by a custom idempotent Node script rather than a
SAM template, so it's safe to re-run:

1. Build the app.
2. Reuse the S3 bucket, CloudFront origin access control, and distribution
   from a prior run if they exist (tracked in a small local state file),
   create them if not.
3. Configure the distribution so any path that isn't a real file falls back
   to `index.html` (required for client-side routing).
4. Scope the bucket policy to only that specific distribution.
5. Upload the build: `index.html` never cached, everything else cached for
   a year (safe, since the build fingerprints filenames), then delete any
   stale files left from a previous build.
6. Invalidate the CloudFront cache and save the run's IDs back to the state
   file for next time.

**The two-way bootstrap dependency**: the backend needs the frontend's
domain (so SMS links point somewhere real), the frontend needs a value the
backend only outputs after its own deploy (the edge function's ARN, next
section). In practice: deploy the frontend once, copy its domain into the
backend's config, deploy the backend, copy its output back into the
frontend's config, redeploy the frontend once more to pick it up.

**Getting shared links to preview correctly**: a link-preview crawler
(iMessage, Slack, social platforms) fetches a shared URL's raw HTML once
and reads whatever `<title>`/`<meta>` tags it finds, it doesn't render the
app. A single-page app's raw HTML is identical for every passage, so
without help every shared link previews with the same blank, generic card.
Fix: a small function running at the CloudFront edge, on a
**viewer-request** trigger (not origin-request, since the cache doesn't
vary by requester and a crawler's cached response could otherwise get
served to a real visitor), that matches only `/d/{token}` URLs, fetches
that token's real passage data plus the real `index.html` in parallel, and
rewrites the title/description/OG/Twitter meta tags before returning the
page. No user-agent sniffing, everyone gets the same corrected HTML. On any
failure it falls back to the unmodified page rather than breaking anything.
Lambda@Edge functions can't use environment variables or layers, so
anything the function needs (like which API to call) has to be hardcoded
directly into it.

---

## Conventions

- Never write delivery code before the dataset exists, phase order matters.
- Keep the tone-tuning knobs and the design-system vocabulary each locked
  to one written instruction, reused everywhere, not reinvented per use.
- No accounts, no passwords, anywhere in this project. A private link is
  the entire auth model, for both the daily passage page and, implicitly,
  for who's allowed to see a given assignment.
- Treat SNS's built-in opt-out handling as sufficient, don't build custom
  STOP-keyword logic that duplicates what the platform already does.

## Explicitly out of scope

- User accounts or login of any kind.
- Multi-tenant/team support, this is a single personal subscriber list.
- Any SEO or user-agent-based branching in the edge function, it exists
  purely to fix link previews, not to serve different content to bots.

## Definition of done

- The dataset pipeline produces a clean, tagged NDJSON file, resumable if
  interrupted.
- The hourly scheduler correctly sends exactly one text per subscriber per
  day, at their local notify hour, with no duplicates.
- The daily page renders a passage with the word-by-word reveal and lets a
  subscriber save a reflection.
- Both halves deploy from a clean checkout, and a shared `/d/{token}` link
  previews with that passage's real title and description.
