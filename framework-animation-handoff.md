# Handoff: Launchit Sessions — framework page animation

## Goal
Build the animated framework diagram for the Framework page at
launchit.studio/sessions. Seven stages (Source, Vet & select, Scope, Build,
Prep artifact, Event, Recap), each with a small persistent nav marker and a
larger detail animation that plays when that step is active/expanded. The
detail animations should each *perform* the real mechanic of that stage
rather than illustrate it generically — see the per-node spec doc for exactly
what each one should do and how.

## Required reading before starting
Read these two docs fully before writing any animation code — they define
the visual/motion language this has to stay consistent with:
1. `brand-identity.md` — palette, typography (Space Grotesk / Fraunces),
   grid/blueprint motif, dimension-line annotation style, Houston collage
   torn-edge motif
2. `framework-animation-nodes.md` — the actual per-node animation spec,
   including which GSAP technique fits each one

## Effort/scope for this task
This is the animation module only — not the full site build. Deliverable is
a self-contained Vue component (or set of components) rendering the seven
nodes with working small/large states, wired to whatever step-selection state
the Framework page uses (a step is "active" → its detail animation plays).

Build order, easiest/most foundational first:
1. Two-tier marker/detail system and step-switching state (no animation
   content yet — just the structural mechanism)
2. Scope (#3) — good first real animation since MorphSVG is self-contained
   and doesn't depend on any other node
3. Source (#1), Vet & select (#2), Build (#4), Prep artifact (#5) — same
   general pattern (DrawSVG/MotionPath within a single node)
4. Event (#6) — introduces real blur/glow, no sandbox constraint on this
   build, use it
5. Recap → Source (#7) — cross-node animation, build last since it depends
   on both nodes' final positions being stable

## Tech requirements
- GSAP core + MotionPathPlugin + MorphSVGPlugin + DrawSVGPlugin (all free as
  of April 2025 — register normally, no license workaround needed)
- Respect `prefers-reduced-motion` — every animation needs a static end-state
  fallback
- Loop/animation durations 3-5s, nothing frantic
- Mobile: verify performance on lower-end devices; simplify (fewer staggered
  elements, shorter durations) if needed rather than disabling entirely

## Non-goals for this task
- Do not build the rest of the Framework page copy/layout — assume it exists
  or is a placeholder; this task is the animation component only
- Do not build the submission form, archive, or resource library (out of
  scope for the whole site per the main project kickoff doc — not just this
  task)
- Do not source or generate the actual Houston collage photography — that's
  a separate task (real photos need to be taken); use placeholder blocks
  where the collage motif would eventually go, if it's used on this page at all

## Definition of done
- All seven nodes have working nav markers and detail animations matching
  their spec
- Reduced-motion fallback verified for each
- Recap → Source cross-node animation plays once on first full view, is
  replayable on click, and the "feeds next cycle" meaning is also stated in
  plain text elsewhere on the page (not animation-dependent)
- Visually consistent with brand-identity.md (colors, type, motif language)
