# Rubric

A checklist for grading a price-cut writeup before it's shown, not a style
guide (that's `brand-voice.md`) and not an eligibility filter (that's
`policy.md`). Every point below should be true. If one isn't, fix the
writeup and re-check, don't ship a draft that fails its own rubric.

## Factual accuracy

- [ ] Every address, price, and cut amount in the table traces back to an
      actual entry in `data/price-cuts.json` — nothing invented, nothing
      rounded in a way that changes the number's meaning.
- [ ] Every link is a real parsed `url`, or the row explicitly says no link
      was available. Never fabricate a plausible-looking Zillow URL.
- [ ] The cut date shown is the date from the email, not today's date.

## Signal over noise

- [ ] Cut size is shown as **both** dollar amount and percent of price. A
      $10.5K cut reads very differently on a $399K home (2.6%) than on a
      $150K home (7%) — dollar amount alone hides that.
- [ ] Rows are sorted by percent cut, largest first, not by email arrival
      order. The point of this tool is surfacing what's actually notable.
- [ ] Listings excluded by `policy.md` are not silently dropped — say how
      many were excluded and why (over the price ceiling, incomplete data),
      even if the excluded rows themselves aren't shown.

## Format

- [ ] Output is an actual table (address, price, cut, %, beds/baths/sqft,
      date, link), not a prose paragraph per listing — the whole point was
      replacing a scroll of separate emails with one scannable view.
- [ ] No duplicate rows for the same address across multiple alert emails,
      merge them and keep the most recent cut.

## Voice

- [ ] Any narrative text (a one-line take on a listing, a summary at the
      top) matches `brand-voice.md` — friendly, upbeat, digital-realtor-buddy
      energy, since this is internal and only you ever read it. Fun in the
      framing is correct here, not a rubric failure.
- [ ] The energy stays in the delivery, not in the numbers — an upbeat
      intro line is fine, but the price/cut/address themselves are never
      exaggerated or rounded to sound more exciting than the data says.

## If a listing fails to parse

- [ ] Never invent values to fill a gap. `track-price-cuts.js` already
      skips anything it can't confidently parse and logs it rather than
      guessing, the writeup step should hold the same line.
