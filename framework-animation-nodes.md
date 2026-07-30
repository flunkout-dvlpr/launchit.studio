# Framework page animation — node specs (GSAP)

## System-level approach
Two-tier per node: a small, simplified nav marker (persistent, ~40px, same
silhouette as the large version) and a large detail animation shown when a
step is active/expanded. The large version is where all the description below
applies. Nav marker is a simplified static/looping glyph of the same shape —
not a different metaphor — so expanding a step feels like it's unfolding, not
switching visual language.

**Stack**: GSAP core + MotionPathPlugin + MorphSVGPlugin + DrawSVGPlugin.
All GSAP plugins are free as of April 2025 (Webflow/GreenSock) — no license
constraints, use MorphSVG and DrawSVG freely rather than working around them
with manual dashoffset/opacity tricks.

**Accessibility**: respect `prefers-reduced-motion` — provide a static end-state
fallback (last frame of each animation) for anyone with that setting on. Keep
loop durations reasonable (3-5s) so nothing feels frantic on repeat.

**Note on the two chat-demo mockups already built**: those were built inside a
sandboxed visualization tool that disallows blur/gradient/shadow effects — the
real site has no such constraint. Where noted below (Event, especially), the
production version should use soft blur/glow, which will look better than the
flat-shape versions shown in the mockups.

---

### 1. Source
**Concept**: a solid "internal" node with a dashed, ghosted line extending
outward to an outlined (not-yet-solid) "public" cluster, annotated
`INTERNAL — CYCLE 1-3` / `PUBLIC — LATER`.
**Build**: DrawSVGPlugin animates the dashed connector line from `0% 0%` to
`0% 100%`. Outlined public-cluster dots stagger-fade in (`gsap.from`, opacity
0→1, slight y-offset) after the line completes. Annotation text reveals last.
**Trigger**: on step expand, or loop continuously at low opacity when idle.

### 2. Vet & select
**Concept**: three labeled circles (`BUILDABLE`, `RELATABLE`, `COMMITTED`) as
a Venn diagram. Candidate dots animate in and are tested against all three;
a dot missing one drifts sideways into a visible "not this cycle" holding
cluster (not deleted/faded to nothing — stays present, softer tone); the one
qualifying dot travels to and settles in the center, scales up, and shifts to
the accent color.
**Build**: `MotionPathPlugin` for each dot's path (either toward center or
toward the holding cluster). Stagger dot entrances (`gsap.timeline` with
`stagger: 0.15`). Center dot gets a final `gsap.to(scale: 1.4, fill: accent)`.
**Trigger**: on step expand; can replay on click.

### 3. Scope
**Concept**: a rough, wobbled scribble path morphs directly into a clean
geometric shape (straight lines, right angles) — visually performing what a
scoping call does to a vague idea. Two static tick marks below, labeled
`CALL 1` / `CALL 2`, mark progress through the transformation.
**Build**: `MorphSVGPlugin` — `gsap.to('#rough', {morphSVG: '#precise', duration: 2})`.
GSAP handles differing point counts automatically. Label crossfades
(`VAGUE IDEA` → `EXACT SPEC`) timed to the morph's midpoint.
**Trigger**: on step expand.

### 4. Build
**Concept**: a wireframe/outline diagram draws itself in (structural,
unfilled), then conditionally fills with an accent color — echoing the
brand's own blueprint-to-color tension inside a single node. A dimension-line
annotation reads `MIN — concept` / `MAX — demo`, with the fill only
completing fully toward "demo."
**Build**: `DrawSVGPlugin` for the initial stroke reveal (`drawSVG: "0% 0%"`
→ `"0% 100%"`), then `gsap.to(fill: accentColor)` for the color-fill step.
Dimension-line ticks are simple static SVG, revealed via opacity fade.
**Trigger**: on step expand.

### 5. Prep artifact
**Concept**: a page with a torn/cutout corner (matching the brand's collage
motif, not a generic fold) opens, then fans out into several small dots
radiating outward (attendees receiving it). One dot gets a checkmark,
indicating the "try it yourself" exercise being completed.
**Build**: torn-edge reveal via `clip-path` animation or SVG mask reveal.
Fan-out dots via `MotionPathPlugin`, staggered outward paths from the page's
position. Checkmark drawn via `DrawSVGPlugin` on a small path, popped in with
a scale tween on the one completed dot.
**Trigger**: on step expand.

### 6. Event
**Concept**: two separate light sources (Launchit + Impact Hub) converge into
one overlapping pool of light on a stage, then transition into the live-pulse
rings from the existing design.
**Build**: two soft radial-gradient circles animate toward each other
(`gsap.to(x/y)`) and overlap (use real blur/glow here — not restricted like
the chat mockups). Once overlapped, trigger the existing pulse-ring loop.
**Trigger**: on step expand.

### 7. Recap → Source (cross-node)
**Concept**: the recap "post" icon literally travels from the Recap node to
the Source node and becomes a new dot there — mechanically true, not a
metaphor, since recap and next-cycle sourcing are the same real event.
**Build**: `MotionPathPlugin` animates the icon along a bezier arc from
Recap's position to Source's cluster position. On arrival: icon fades, a new
dot appears with a brief pulse-ring (`opacity` + `scale` keyframes).
**Trigger**: plays once on first view of the full framework layout (both
nodes visible), replayable on click. Not load-bearing for comprehension — the
copy should state "feeds next cycle's call" plainly regardless of whether the
animation is seen.
