---
type: demo
series: "A build-it-yourself Sessions demo"
slug: demo-email-response-drafter
title: "An email response drafter you can build in one sitting"
order: 5
date: "A Sessions-format demo"
readTime: "~8 minutes"
---

## What we're building

A small local tool that connects to your own Gmail inbox, pulls your most recent emails, filters for the ones matching keywords you care about (things like "refund," "cancel," "when will my order," whatever shows up in your inbox again and again), and drafts a reply for each one in your own voice. Nothing sends automatically. Every draft is something you read and approve yourself.

This demo exists to answer a different question than the Meditations series does. That series shows what's possible in real depth. This one is built specifically to be replicated: something you could realistically finish in a single 60-90 minute sitting, starting from an empty folder.

## Business case

Every small business with a public email address deals with the same handful of questions on repeat: where's my order, can I get a refund, do you have this in stock, what are your hours. Answering each one individually eats real time, and it's exactly the kind of task that's simple in substance but expensive in volume, which is precisely what Claude is good at helping with once it's actually connected to an inbox someone uses every day.

## Before you arrive

There's one piece of setup that genuinely can't happen live in the room: getting Gmail API access approved for your own account. It's not hard, but it's Google's console, not code, and walking a room through it live would burn most of the session watching one screen. Do this ahead of time, it takes about 10 minutes:

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and create a new project.
2. Open "APIs & Services" → "Library" and enable the **Gmail API**.
3. Open "APIs & Services" → "OAuth consent screen," set it to **Testing** mode, and add your own Gmail address as a test user.
4. Open "APIs & Services" → "Credentials," create an **OAuth client ID** (application type: Desktop app), and download it.
5. Rename the downloaded file to `credentials.json` and keep it somewhere you can find it on the day.

Official reference, straight from the source: [Gmail API Node.js quickstart](https://developers.google.com/gmail/api/quickstart/nodejs).

If any of these screens are unfamiliar, that's fine, describe what's on screen to Claude Code and it can walk you through exactly what to click next.

## Download the CLAUDE.md

This is the actual file the session works from. Download it, drop it into an empty folder, open that folder in Claude Code, and it has everything needed to start building: the project goal, the file structure, the Gmail scopes to request, and the order to build things in.

[Download email-response-drafter-CLAUDE.md](/downloads/email-response-drafter-CLAUDE.md)

The full contents, if you'd rather read it here first:

```markdown
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
- Gmail API via the official `googleapis` npm package
- OAuth2 for authentication
- No database, no server, no deployment. Everything runs on your own machine.
- No separate AI API key needed. Claude Code itself reads the matched
  emails and writes the drafts during the session.

## Before you start building (do this first, it's setup, not code)
You need Gmail API credentials before Claude Code can do anything useful
here. This takes about 10 minutes:

1. Go to https://console.cloud.google.com/ and create a new project.
2. Open "APIs & Services" > "Library" and enable the **Gmail API**.
3. Open "APIs & Services" > "OAuth consent screen". Configure it in
   **Testing** mode and add your own Gmail address as a test user.
4. Open "APIs & Services" > "Credentials" and create an **OAuth client ID**
   (application type: **Desktop app**). Download it, you'll get a JSON file.
5. Rename that downloaded file to `credentials.json` and place it in this
   project's root folder.

Official walkthrough, if you want the source: https://developers.google.com/gmail/api/quickstart/nodejs

If any of these screens look unfamiliar, ask Claude Code to walk you through
what you're looking at, describe what's on screen and it can tell you
exactly what to click next.

## Project structure to build
- `credentials.json` — your downloaded OAuth client secret (never commit this)
- `token.json` — generated automatically after your first approval (never commit this)
- `keywords.md` — a plain list of words or phrases to filter emails by, one
  per line (e.g. "refund", "cancel", "when will my order")
- `voice.md` — 3 to 5 examples of replies you've actually written before, so
  drafts sound like you instead of a generic bot
- `scripts/auth.js` — a one-time script that opens your browser, asks you to
  approve access, and saves `token.json`
- `scripts/fetch-emails.js` — pulls your last N emails (N configurable,
  default 25) and saves the ones matching `keywords.md` to `data/matches.json`
- `output/drafts.md` — one draft reply per matched email, written here for
  you to review. Nothing is sent, and nothing touches Gmail automatically.

## Gmail API scopes to request
Start with `gmail.readonly` and, only if you want the stretch goal below,
`gmail.compose`. Do not request `gmail.send` — this project drafts, it
never sends on its own.

## Conventions
- Never commit `credentials.json`, `token.json`, `data/`, or `output/`. Add
  all four to `.gitignore` before writing any other code.
- Treat every email's content as sensitive. Don't log full email bodies to
  the console, subject lines and match reasons are enough.
- Draft replies should sound like the examples in `voice.md`, not like a
  generic customer-service bot. Write one locked style instruction (short,
  direct, matches the owner's actual tone) and reuse it for every draft,
  rather than improvising a new tone each time.
- Keyword matching should be case-insensitive and check both the subject
  line and the email body.

## What to build, in order
1. Build and run `scripts/auth.js` once. Approve access in the browser that
   opens. Confirm `token.json` gets created.
2. Build `scripts/fetch-emails.js`. Confirm it pulls real recent emails and
   saves the keyword matches to `data/matches.json`.
3. For each matched email, draft a reply using `voice.md` as the style
   guide. Write all drafts to `output/drafts.md`, one per matched email,
   each labeled with the sender and subject line it's replying to.
4. Review `output/drafts.md` together. If a draft doesn't sound right,
   tighten the style instruction rather than fixing that one draft by hand.
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
- `scripts/fetch-emails.js` pulls real emails and filters them correctly
  against `keywords.md`
- `output/drafts.md` contains one on-voice draft per matched email
- Nothing was sent, and no credentials were committed to version control
```

## What we'll walk through

1. Running the one-time authorization script and confirming Gmail access actually works.
2. Building the script that pulls your last batch of emails and filters them against a keyword list you write yourself.
3. Writing one locked style instruction, the same idea as the tone-tuning step in the Meditations demo, so every draft sounds like you, not a generic support bot.
4. Generating drafts for a real batch of your own matched emails and reading them back together.
5. If there's time left, wiring the approved drafts into your actual Gmail account as real drafts instead of just a local file.

## Try it yourself

Before the session, write your own `keywords.md`, just a plain list of the phrases that show up again and again in your inbox, and a `voice.md` with three or four replies you've genuinely sent before. Having both ready means session time goes toward the interesting part (getting the drafts to actually sound right) instead of figuring out what to feed it.

## After the session

You leave with a working local script pointed at your own inbox, a `CLAUDE.md` you can keep extending on your own (more keywords, a second inbox, sorting instead of just replying), and a clear, hands-on example of what "connect Claude to an account you already use every day" actually looks like, start to finish.
