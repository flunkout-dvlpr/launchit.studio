# Project: Launchit Sessions — site

## Name & domain (confirmed)
Event name: **Launchit Sessions**
Site lives at: **launchit.studio/sessions** (existing domain, owned by the site
owner — not a new domain purchase, not a subdomain)
Presented by: Launchit Studio, in partnership with Impact Hub Houston

## Context for whoever (whatever) picks this up
Launchit Sessions is a recurring community event in Houston: local businesses
submit real problems they want built with Claude, one is selected each cycle, it
gets built out (with the business owner) into a working demo or rough concept, and
it's presented live at an Impact Hub Houston event. This site (launchit.studio/sessions)
is the public-facing home for that whole system — not a single event page, but the
ongoing framework.

Independent project. Not affiliated with the official "Claude Community Events"
series (a separate, Anthropic-adjacent calendar) — deliberately named and branded
apart from that to avoid confusion. Co-run with Impact Hub Houston, who own audience
distribution (LinkedIn, event logistics); Launchit Studio owns content, technical
execution, and this site.

## Goal for this build
A static, fast, low-maintenance site that:
1. Explains the concept clearly enough that a stranger understands it in under a minute
2. Documents the framework/process with enough transparency that a prospective
   submitter knows what selection involves before they apply
3. Hosts prep artifacts (pre-event guides) per cycle so attendees have one place
   to find "what to read before showing up"

This is v1. Do not build the items listed under "Explicitly out of scope" — they're
real, planned, and intentionally deferred until the format has run a few cycles.

## Tech stack
- Frontend: Quasar (Vue 3), consistent with other projects on this account
- Hosting: S3 + CloudFront, static site
- No backend/database needed for v1 — all content is static/markdown-driven
- No auth needed for v1

## Site structure (v1 — build these)

### 1. Home
Short landing page. One-paragraph hook, link to About and Framework, and a
"current cycle" callout area (which business/use case is being built this cycle,
or "submissions open" state). Should read as active/alive, not a static brochure.

### 2. About
Full breakdown of the concept:
- What this is (community-sourced, real business use cases, built live with Claude)
- Why it exists (reaction to the first Claude Community Houston event feeling
  scattered — this is a more structured, business-outcome-focused format)
- Who it's for (small business owners/entrepreneurs, especially non-technical ones)
- Relationship to Impact Hub Houston and to the official Claude Community series
  (complementary, not affiliated/official)
- Cadence: currently every [2-4 weeks — confirm cadence before publishing]

### 3. Framework
Transparent walkthrough of the actual pipeline, written for a prospective
submitter, not an internal audience. Should cover, in order:
1. **Source** — how use cases get surfaced (currently internal test cases;
   later, public submission)
2. **Vet & select** — the actual criteria: buildable within the cycle, relatable
   to other small business owners, submitter willing/able to commit to two
   scoping calls and present
3. **Scope** — 1-2 zoom calls (1hr each) with the selected submitter
4. **Build** — a working demo, or at minimum a rough concept, built within
   the cycle window
5. **Prep artifact** — a short guide shared before the event so attendees can
   follow along
6. **Event** — co-presented live at Impact Hub Houston / The Ion
7. **Recap** — session writeup, shared back through Impact Hub's channels,
   doubling as the call for the next cycle's submissions

Include a short disclosure that anything built may be shared publicly (demo,
writeup, eventually source), since submitters should know this going in.

### 4. Prep artifacts (archive/index page)
A simple chronological list of past + upcoming cycles, each linking to that
cycle's prep artifact page. Each artifact page should render markdown content
(see sample content structure below) — reuse one template component for all of
them rather than one-off pages per cycle.

Sample prep artifact to use as the seed content/template:
`cycle1-prep-social-content-manager.md` (attached separately) — use its structure
(what we're building / business case / before you arrive / try it yourself /
what we'll walk through / after the session) as the schema for the template.

## Content/copy notes
- Plain, direct language — audience is largely non-technical small business owners
- Avoid AI-hype phrasing; this is a practical, business-outcomes framing
- No stock photography of robots/circuit boards — see frontend-design conventions
  for this account if generating visuals

## Explicitly out of scope for this build (do not build)
- Curated submission form (with backend/DynamoDB) — future phase, once the
  format has proven out with 2-3 internally-seeded cycles
- Polling/voting mechanism — sourcing stays on LinkedIn via Impact Hub for now
- Public GitHub/source-code archive — needs a data-sanitization pattern worked
  out with submitters first (no real API keys, customer data, proprietary
  numbers in public repos)
- Resource library (Claude Code setup guides, tech stack recommendations, etc.)
  — link out to docs.claude.com / support.claude.com for now rather than
  authoring original content that will go stale

## Open decisions (confirm before/while building — do not assume)
- **Cadence**: every 2 weeks vs. monthly for the first few cycles — confirm actual
  number before publishing on the About page.

(Domain and naming are resolved — see "Name & domain" above. Do not re-litigate
these or default to a different name/URL structure.)

## Definition of done for v1
- Home, About, Framework, and Prep Artifacts pages live at launchit.studio/sessions
- One prep artifact (cycle 1, social content manager) rendered as the template
  proof-of-concept
- Deployed to S3/CloudFront, routed correctly under the existing launchit.studio domain
- Mobile responsive (this will be linked from LinkedIn/mobile-heavy traffic)
