# Project: Email Response Drafter

## What this project does
Connects to your own Gmail inbox (read-only, plus optional draft-creation),
pulls your most recent emails, filters for the ones matching keywords you
care about, and drafts a reply for each one in your own voice, saved locally
so you can review everything before anything goes near "send."

## Why this exists
Built as a Launchit Sessions prep-artifact demo: a small, real project you
can replicate yourself with just this file and Claude Code, in one sitting.
Nothing here requires deploying anything or paying for hosting.

## Tech stack
- Node.js (any recent LTS version)
- Gmail API via the official `googleapis` npm package, plus
  `@google-cloud/local-auth` for the one-time browser authorization flow
  (this is what Google's own quickstart uses, and it saves writing a
  local HTTP server + redirect handler by hand)
- OAuth2 for authentication
- No database, no server, no deployment. Everything runs on your own machine.
- No separate AI API key needed. Claude Code itself reads the matched
  emails and writes the drafts during the session.

## Before you start building (do this first, it's setup, not code)
You need Gmail API credentials before Claude Code can do anything useful
here. This takes about 10 minutes:

1. Go to https://console.cloud.google.com/ and create a new project.
2. Open "APIs & Services" > "Library" and enable the **Gmail API**.
   (official steps: https://developers.google.com/workspace/gmail/api/quickstart/nodejs#enable_the_api)
3. Open "APIs & Services" > "OAuth consent screen". Click **Get started**
   and fill in the wizard: app name (anything), user support email (yours),
   audience (**External**, the only option on a personal Gmail account,
   this is fine and doesn't publish or verify the app), and contact
   information (your email again). Click through to **Finish**.
   (official steps: https://developers.google.com/workspace/gmail/api/quickstart/nodejs#configure_the_oauth_consent_screen)
4. On the **Audience** tab of those same settings, add your own Gmail
   address under **Test users**. This is what actually gates access, as
   long as the app stays in **Testing** status (the default), only people
   added here can sign in.
5. Open "APIs & Services" > "Credentials" and create an **OAuth client ID**
   (application type: **Desktop app**). You'll be asked for a name here too,
   it's just a label for telling clients apart in the console later, any
   name works, it has no effect on functionality. Download it, you'll get
   a JSON file.
   (official steps: https://developers.google.com/workspace/gmail/api/quickstart/nodejs#authorize_credentials_for_a_desktop_application)
6. Rename that downloaded file to `credentials.json` and place it in this
   project's root folder. `credentials.json.example` in this folder shows
   the expected shape, it's already gitignored, so this is safe to drop in
   directly.

Official walkthrough, if you want the source: https://developers.google.com/gmail/api/quickstart/nodejs

If any of these screens look unfamiliar, ask Claude Code to walk you through
what you're looking at, describe what's on screen and it can tell you
exactly what to click next.

## Project structure to build
- `package.json` — depends on `googleapis` and `@google-cloud/local-auth`
- `credentials.json` — your downloaded OAuth client secret (never commit this)
- `token.json` — generated automatically after your first approval (never
  commit this). Shape: `{ type: "authorized_user", client_id, client_secret,
  refresh_token }`, this is the exact shape `google.auth.fromJSON()` expects
  back, don't invent a different structure or reuse breaks.
- `keywords.md` — a plain list of words or phrases to filter emails by, one
  per line (e.g. "refund", "cancel", "when will my order"). Prefer specific
  multi-word phrases over single common words, see the false-positive note
  under Conventions.
- `voice.md` — 3 to 5 examples of replies you've actually written before, so
  drafts sound like you instead of a generic bot
- `settings.md` — plain `key: value` lines controlling behavior without
  touching code: `emails_to_check` (how many recent emails to scan, default
  25) and `skip_bulk_mail` (on by default, see Conventions). Missing file or
  bad lines just fall back to defaults, this is meant to be hand-edited by
  someone with no coding background, it shouldn't be able to crash anything.
- `scripts/auth.js` — a one-time script that opens your browser, asks you to
  approve access, and saves `token.json`
- `scripts/fetch-emails.js` — pulls recent **inbox** emails per
  `settings.md` (a number passed on the command line overrides it for one
  run only, e.g. `node scripts/fetch-emails.js 100`), skips bulk/newsletter
  mail unless turned off, extracts clean plain-text bodies, and saves the
  ones matching `keywords.md` to `data/matches.json`
- `output/drafts.md` — one draft reply per matched email, written here for
  you to review. Nothing is sent, and nothing touches Gmail automatically.

## Gmail API scopes to request
Start with `gmail.readonly` and, only if you want the stretch goal below,
`gmail.compose`. Do not request `gmail.send` — this project drafts, it
never sends on its own.

## The drafting instruction
There's no script for this part, and deliberately so, no second AI API key
to manage, Claude Code reads `data/matches.json` directly and writes
`output/drafts.md` itself when asked. But "ask it to draft replies" isn't
specific enough to get consistent results run to run, so use this exact
instruction every time, the same locked-instruction idea the tone-tuning in
the Meditations demo series uses:

> Read every entry in `data/matches.json`. For each one, write "No reply
> needed" and a one-line reason instead of a draft if either is true: the
> sender is clearly automated (a no-reply address, a verification code, a
> system notification, a receipt), or it's a real person but the thread
> already reads as resolved (someone already confirmed, thanked, or closed
> the loop, check other matched entries from the same thread/subject line
> too, not just this one in isolation). Otherwise, write a reply in the
> voice shown by the examples in `voice.md`: warm but not gushing, direct,
> 2-4 sentences, acknowledge specifically what they asked, and give a real
> answer or a clear next step rather than a generic acknowledgment. No
> corporate hedging, no "we value your business" filler. Write every
> result to `output/drafts.md`, one entry per matched email, each under a
> heading with the sender and subject line it's replying to.

If drafts consistently come out too stiff, too casual, too long, or
whatever else feels off, don't ask for a one-off fix on a single draft,
add or swap examples in `voice.md` instead, or tighten the instruction
above, and redraft everything. The goal is one consistent voice across all
drafts, not each draft individually adjusted by hand.

## Conventions
- Never commit `credentials.json`, `token.json`, `data/`, or `output/`.
  This folder's `.gitignore` already covers all four, so there's nothing to
  set up before writing code, just don't remove those lines.
- Treat every email's content as sensitive. Don't log full email bodies to
  the console, subject lines and match reasons are enough.
- Draft replies should sound like the examples in `voice.md`, not like a
  generic customer-service bot. Write one locked style instruction (short,
  direct, matches the owner's actual tone) and reuse it for every draft,
  rather than improvising a new tone each time.
- Keyword matching should be case-insensitive and check both the subject
  line and the email body.
- **Restrict fetching to the inbox** (`labelIds: ['INBOX']` on the Gmail
  API list call). Without it, results include mail the account owner sent
  themselves, confirmed against a real account, where a reply-all thread
  put the user's own sent message back in scope and it got treated as
  something needing a reply to itself. A drafting tool has no reason to
  ever see outgoing mail.
- **Skip bulk/newsletter mail before keyword matching, not after**, when
  `settings.md`'s `skip_bulk_mail` is on (the default). Filter out anything
  with a `List-Unsubscribe` header (required by law on bulk mail, never
  present on a real one-to-one email). Without this, a single common
  keyword like "tracking" will match marketing newsletters about unrelated
  features just as easily as a real customer question, confirmed against a
  real inbox during testing. Make this an actual on/off setting, not a
  hardcoded assumption, some people may want to see every match unfiltered.
- **Extract email bodies as real plain text, not raw HTML.** Gmail messages
  come in inconsistent shapes: some have `body.data` directly on the
  payload, some nest it under `.parts`, and both cases can be either plain
  text or HTML depending on `mimeType`, check `mimeType` in every branch,
  not just the ones under `.parts`. When stripping HTML: remove `<style>`
  and `<script>` blocks *including their contents* (a plain `<[^>]+>` tag
  regex leaves raw CSS/JS behind as "text"), decode the common entities
  (`&nbsp;`, `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`), and cap the result
  at a few thousand characters. Skipping any of these turned one real
  marketing email into over 25,000 characters of raw markup during testing,
  easily enough to blow a context budget on a single matched message.
- **Not every keyword match deserves a drafted reply.** Automated senders
  (no-reply addresses, verification codes, system notifications) can match
  keywords by coincidence without being something a human would ever
  respond to. When drafting, if a match is clearly automated, write "No
  reply needed" and a one-line reason instead of forcing an artificial
  customer-service-toned response to a robot.

## What to build, in order
1. Build and run `scripts/auth.js` once. Approve access in the browser that
   opens. Confirm `token.json` gets created.
2. Build `scripts/fetch-emails.js`, including the bulk-mail filter and
   proper plain-text extraction from the start (see Conventions above),
   these aren't edge cases to add later, real inboxes hit them on the first
   run. Confirm it pulls real recent emails and saves clean, readable
   keyword matches to `data/matches.json`, spot-check a couple of matched
   bodies for leftover HTML/CSS junk before moving on.
3. Follow the drafting instruction above to write `output/drafts.md`.
4. Review `output/drafts.md` together. If a draft doesn't sound right,
   tighten the drafting instruction or `voice.md` rather than fixing that
   one draft by hand.
5. Stretch goal, if there's time left: use the `gmail.compose` scope to save
   the approved drafts directly into the Gmail account as real drafts,
   instead of just a local markdown file.

## Explicitly out of scope
- Automatically sending anything. This project drafts, a human always
  reviews and sends.
- Multi-account or shared/team inbox support. This is a single personal
  inbox tool.
- Any hosting or deployment. This runs locally, on demand, whenever you run it.

## Definition of done
- `scripts/fetch-emails.js` pulls real inbox emails (never the user's own
  sent mail), skips bulk/newsletter mail, and filters clean plain-text
  bodies correctly against `keywords.md`
- `output/drafts.md` contains one on-voice draft per real matched email
  that's genuinely open, or a clearly marked "no reply needed" for
  automated senders and already-resolved threads
- Nothing was sent, and no credentials were committed to version control

## Running it again (after the first build)
Everything above only happens once: the Google Cloud setup, and running
`scripts/auth.js`. Using this day to day afterward is just:

1. Open this folder in Claude Code.
2. Ask it to run `scripts/fetch-emails.js`, then point it at the drafting
   instruction above and ask it to follow that. Reusing the same wording
   every time is what keeps drafts consistent, don't paraphrase it from
   memory.
3. Open `output/drafts.md`, read the drafts, copy whatever's good into a
   real reply. Nothing here sends anything on its own, ever.

### The knobs you can turn, no code required
- **`keywords.md`** — this is the actual list of what counts as "worth a
  reply." Add a line to catch something new, delete a line to stop
  catching something, edit a line to be more specific. If you're getting
  irrelevant matches, prefer specific phrases ("when will my order ship")
  over single common words ("order").
- **`voice.md`** — this is what teaches drafts your tone. If a draft feels
  off, swap in different or additional real examples of replies you've
  actually sent, rather than trying to describe your tone in the abstract,
  showing works better than telling.
- **`settings.md`** — two more dials, both plain `key: value` lines:
  - `emails_to_check` — how many recent emails to scan each run (default
    25). Change the number and save, no need to remember a command-line
    flag every time (though `node scripts/fetch-emails.js 100` still works
    too, for a one-off run without changing the file).
  - `skip_bulk_mail` — `true` (default) filters out newsletters and
    marketing email before matching even happens. Set to `false` if you
    want to see every keyword match with nothing filtered out.

### If something breaks
- Gmail access stops working: delete `token.json` and run
  `node scripts/auth.js` again, it'll walk you through browser approval
  one more time.
- You want to fully revoke access (lost laptop, etc.): go to
  https://myaccount.google.com/permissions and remove the app there. This
  works regardless of whether `credentials.json`/`token.json` still exist
  on any device.
