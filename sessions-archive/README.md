# Sessions Archive

This folder is the official record of the actual project folders and
`CLAUDE.md` files behind every Launchit Sessions demo and cycle. It lives
outside `client/` on purpose: it's not part of the website build, it's the
source-of-record for what was actually built, kept separate so it survives
independently of any future redesign of the site itself.

## What goes here

One subfolder per project, named `demo-<slug>` for worked-example demos or
`cycle-<n>-<slug>` for real submitted cycles once those start running. Each
subfolder should contain at minimum:

- `CLAUDE.md` — a complete project brief covering the *whole* project, not
  just whichever phase happened to be built first. The bar: someone should
  be able to download this one file and kick off the entire project
  themselves, start to finish. If the real project was actually built in
  phases with a brief per phase, synthesize one combined `CLAUDE.md` that
  covers all of them, and keep any original per-phase brief alongside it
  under a clearly historical filename (e.g. `CLAUDE-phase1-original.md`)
  rather than passing it off as the primary file.
- A short `SOURCE.md` **only if** the real project code lives in a separate
  repository outside this one, or if there's more than one file in the
  folder and it's not obvious which one is primary. Note where the real
  project lives, the date this copy was archived, and what each file in the
  folder is for.

## Relationship to the site

- Prep artifact write-ups live in `client/src/content/prep/*.md` and are
  what actually renders on the site.
- Any `CLAUDE.md` offered as a direct download from the site is generated
  from this folder, not hand-copied. Running `npm run sync:downloads`
  inside `client/` (via `client/scripts/sync-claude-downloads.js`) copies
  every `sessions-archive/*/CLAUDE.md` into `client/public/downloads/`,
  stripping a leading `demo-` from the output filename. It also runs
  automatically before `dev` and `build`. This folder is the only place to
  hand-edit a project brief; the copy in `client/public/downloads/` is a
  build artifact and shouldn't be edited directly.

## Current entries

- `demo-meditations/` — full four-phase brief (dataset, backend, frontend,
  deployment) behind the *Meditations* demo series
  (`client/src/content/prep/demo-1-text-to-dataset.md` through
  `demo-4-deployment.md`). The full running project lives outside this
  repo; see that folder's `SOURCE.md` for details, including the original
  phase-one-only brief kept alongside it for history.
- `demo-email-response-drafter/` — the kickoff brief for the email response
  drafter demo (`client/src/content/prep/demo-email-response-drafter.md`),
  written to be replicated by attendees themselves.
