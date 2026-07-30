# Project Brief: Daily Meditations Pipeline

## What this is

A preprocessing pipeline that takes Marcus Aurelius's _Meditations_ (public domain
translation) and transforms it into short, situational, modern-English passages —
each with tags and a reflection prompt — suitable for delivery as a daily "snippet"
(SMS, web app, or similar; delivery channel intentionally not yet decided, see
"Delivery — open" below).

Think _The Daily Stoic_, but strictly sourced from _Meditations_ itself rather than
mixed Stoic authors, and matched to situation/topic rather than calendar day.

## Why

Reading full translations of _Meditations_ can feel like homework — older
translations in particular read as removed from modern English. The insight is
excellent, the delivery is the barrier. This project preprocesses the whole text
once, offline, into a reusable dataset so future delivery (however built) never has
to do translation/tagging work live.

## Source material & copyright

- Use a **public domain** translation only — Meric Casaubon (1634) or George Long
  (1862), both freely available via Project Gutenberg / Standard Ebooks.
- Recommended: **Standard Ebooks' George Long edition**
  (https://standardebooks.org/ebooks/marcus-aurelius/meditations/george-long) —
  clean, well-formatted, easy to parse into individual numbered passages (12 books,
  ~487 passages total).
- Do NOT use the Gregory Hays translation (Modern Library) as source text — it's
  still under copyright. It's fine as a human reference for phrasing quality, just
  not as pipeline input.
- Our modern rewrites are transformative (new wording, new structure, added
  metadata) — not reproductions of the PD source, so no copyright concern there
  either way.

## Pipeline overview

1. **Ingest**: Pull full PD text, split into individual numbered passages (Book +
   Number), producing a raw list of ~487 short entries.
2. **Process** (one-time batch, via Claude API): For each passage, generate:
   - `modern_text` — rewritten in the locked voice (see below)
   - `tags` — 1–3 situational/topical tags (see taxonomy below)
   - `reflection` — one short open-ended question tied to the passage
   - Keep `source_book`, `source_number`, and `original_text` (PD) for reference/audit
3. **Store**: Output as structured JSON, one object per passage. This becomes the
   permanent dataset — no live API calls needed at delivery time.
4. **Review pass** (manual, optional): Spot-check a sample across books for tone
   drift and tag quality before treating the dataset as final.

Some passages (long autobiographical ones in Book I especially, thanking mentors
by name) don't map well to a "situation." It's fine to tag these loosely (e.g.
`gratitude`, `mentorship`) or exclude them from the situational index — flag rather
than force a fit.

## Locked voice / style instruction

This exact instruction block should be prepended to every passage sent through the
rewrite step:

> Rewrite in warm, reflective modern English, as a thoughtful friend speaking
> gently to someone they respect. Keep it to 2–4 sentences. Favor invitations and
> quiet observations over commands. Preserve the original insight exactly — soften
> the delivery, never the truth. Light period detail is fine if it adds texture;
> otherwise keep imagery contemporary.

Tone reference points (validated against sample passages already run manually):

- **Directness**: low–medium — suggest, don't order
- **Warmth**: high — encouraging, not clinical
- **Compression**: medium — tighter than a full paraphrase, looser than a punchy
  one-liner
- **Register**: contemporary, not slangy
- **Address**: gently steers toward "you" rather than issuing commands
- **Imagery**: modernize by default; keep Roman/period flavor only where it adds
  texture rather than distance

## Tagging taxonomy (starting set — expand as needed during processing)

Situational tags, not academic/philosophical categories. Examples:
`starting-the-day`, `difficult-people`, `overwhelmed`, `mortality`, `anger`,
`criticism`, `fear`, `grief`, `ambition`, `patience`, `gratitude`, `failure`,
`self-doubt`, `legacy`, `anxiety`, `discipline`, `letting-go`, `envy`

Each passage gets 1–3 tags. Don't force a passage into a tag it doesn't fit —
better to leave a passage under-tagged than mis-tagged.

## Output schema (per passage)

```json
{
  "id": "book2-num1",
  "source_book": 2,
  "source_number": 1,
  "original_text": "Betimes in the morning say to thyself...",
  "modern_text": "You'll probably run into someone today who's short-tempered...",
  "tags": ["difficult-people", "patience"],
  "reflection": "Who are you bracing for today — and could you expect them without resenting them?"
}
```

Store all passages in a single JSON array (or NDJSON, one object per line —
easier to process incrementally and resume if a batch run fails partway).

## Tech notes

- Primary stack for this project follows the usual pattern: Node/JS tooling,
  AWS-friendly output (this JSON dataset should be easy to drop into DynamoDB or
  S3 later, whichever delivery ends up using).
- Batch processing script: Node script that reads the raw passage list, calls the
  Claude API per passage with the locked style instruction, and writes results to
  the JSON/NDJSON output file incrementally.
- Rate limit / cost: ~487 passages, short input/output each — should be a cheap,
  fast batch run, but build in resumability in case of interruption partway.

## Delivery — intentionally open

Not deciding yet between SMS (Twilio) or a small web app (Quasar). The dataset
output above is delivery-agnostic by design — whichever direction gets picked
later just needs to query this JSON/dataset by tag or by passage id. No delivery
code should be written as part of this phase.

## Immediate tasks for this session

1. Fetch and parse the full Standard Ebooks George Long PD text into ~487 raw
   passage objects (book, number, original_text).
2. Write the batch processing script (Node) that applies the locked style
   instruction via the Claude API to produce modern_text + tags + reflection
   per passage.
3. Run the batch (or a subset first, e.g. Book I, to validate before running
   the full 487).
4. Output final dataset as JSON/NDJSON to a `data/` directory.
5. Spot-check ~10 passages across different books for tone consistency before
   calling the dataset done.

## Open questions to flag back if they come up

- Should low-fit passages (long mentor-gratitude entries in Book I) be included
  with loose tags, or excluded from the situational index entirely?
- Any interest in a lightweight tag-browsing script/CLI to preview the dataset
  before delivery is built, just to sanity-check coverage across topics?
