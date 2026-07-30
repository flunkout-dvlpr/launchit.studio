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

## Building a demo live in its archive folder

For demos (not real submitted cycles, see below), it's fine, encouraged
even, to build the actual project directly inside its
`sessions-archive/demo-<slug>/` folder rather than building it elsewhere
and copying the `CLAUDE.md` over afterward. That way the archived brief is
never a reconstruction, it's the literal file the project was built from,
and there's nothing to keep in sync by hand beyond running the download
sync script.

If you do this, **before writing any code**, the folder needs:

- Its own `.gitignore`, scoped to whatever that specific project actually
  generates or needs kept secret (`node_modules/`, `.env`, credential
  files, output/data directories, whatever applies). Don't rely on the
  repo-root `.gitignore` alone, it only catches a couple of common
  filenames (`credentials.json`, `token.json`, `.env`) as a last-resort
  safety net, not a substitute for a real per-project ignore list.
- An `.example` counterpart for anything credential-shaped that a person
  would need to see the shape of to get started (e.g. `credentials.json` →
  `credentials.json.example` with placeholder values), checked into git so
  the real file's structure is documented even though the real values
  never are.

Real submitted cycles are different: they involve a third party's actual
business data, and the project's own spec (`CLAUDE.md` at the repo root)
already flags a public source-code archive as out of scope until a
data-sanitization pattern is worked out with submitters. So cycles stay
brief-only in here for now, this live-build pattern is for demos only.

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
  written to be replicated by attendees themselves. Has its own
  `.gitignore` and `credentials.json.example` already in place, ready to
  build the actual project in this folder directly.
