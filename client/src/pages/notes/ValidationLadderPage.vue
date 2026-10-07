<template>
  <q-page class="vl-page grid-texture">
    <div ref="root" class="vl-page__inner">
      <header class="vl-header reveal">
        <span class="pill-tag pill-tag--gold tilt-right">NOTES</span>
        <h1 class="font-display vl-header__title">Building got cheap. Validation didn't.</h1>
        <p class="font-label vl-header__lede">
          A working prototype used to take months and real money. Now it takes a
          weekend. That doesn't make an idea safer — it just moves the real risk
          somewhere less visible: whether the problem is real enough, for enough
          people, that they come back without being asked.
        </p>
      </header>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label vl-label">Where this comes from</h2>
        <p class="font-label vl-body">
          I was introduced to the Lean Canvas, Ash Maurya's version of the business
          model canvas, during Impact Hub Houston's accelerator program. It's a
          good tool. It's also, in my experience, the single most common tool to
          fill out with confident guesses and then treat like proof. I've since
          worked across a handful of early-stage teams and startups, alongside my
          day-to-day work as a software developer at Left Field Labs, and the same
          pattern keeps showing up regardless of the industry: building is not the
          obstacle anymore. Market validation — returning users, active users,
          engaged users — is the actual obstacle. This is my attempt to write that
          down properly instead of just repeating it in conversation.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label vl-label">Three answers that aren't evidence</h2>
        <p class="font-label vl-body">
          These come up in almost every one of these conversations, and all three
          feel like validation while costing the person saying them nothing:
        </p>
        <div class="vl-quotes">
          <span class="vl-quote">"Oh yeah, this is a real need."</span>
          <span class="vl-quote">"I know the industry, this is much needed."</span>
          <span class="vl-quote">"My friends, family and peers agree this is a real need."</span>
        </div>
        <p class="font-label vl-body">
          Each one is an opinion, about a hypothetical, from someone who pays no
          cost either way for being wrong. Industry conviction is supply-side, not
          demand-side — believing the problem is real isn't the same as knowing
          whether people will adopt <em>this</em> solution, at <em>this</em> price,
          instead of the workaround they already live with. And the people closest
          to you have a social cost to telling you your idea is bad, so agreeing is
          usually just the easier thing to say.
        </p>
      </section>

      <section class="vl-figure reveal">
        <svg viewBox="0 0 1000 480" role="img" aria-label="A staircase diagram with four tiers of evidence. Tier zero, opinion, is a flat dashed line that never rises. Tiers one through three, problem interview, costly commitment, and recurring behavior, rise as solid steps, each stronger than the last. Dropbox sits at the interview tier, Airbnb and DoorDash at the costly commitment tier, and Uber crossing from costly commitment into recurring behavior.">
          <defs>
            <marker id="vl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path class="vl-arrowhead" d="M0,0 L10,5 L0,10 z" />
            </marker>
          </defs>

          <text class="vl-axis-label" x="20" y="260" transform="rotate(-90 20 260)" text-anchor="middle">evidence strength</text>

          <polyline class="vl-ladder-flat" points="40,430 250,430" />
          <circle class="vl-dot-flat" cx="40" cy="430" r="5" />
          <text class="vl-tier-num vl-tier-num--flat" x="40" y="382">0</text>
          <text class="vl-tier-name" x="40" y="400">Opinion</text>
          <text class="vl-quote-svg" x="120" y="258">"it's needed"</text>
          <text class="vl-quote-svg" x="120" y="280">"I know the industry"</text>
          <text class="vl-quote-svg" x="120" y="302">"friends agree"</text>

          <polyline class="vl-ladder-climb" points="250,430 250,350 440,350 440,270 630,270 630,190 900,190" />
          <circle class="vl-dot-climb" cx="250" cy="350" r="6" />
          <circle class="vl-dot-climb" cx="440" cy="270" r="6" />
          <circle class="vl-dot-climb" cx="630" cy="190" r="6" />

          <text class="vl-tier-num" x="250" y="298">1</text>
          <text class="vl-tier-name" x="250" y="316">Problem interview</text>
          <text class="vl-chip" x="345" y="332">Dropbox</text>

          <text class="vl-tier-num" x="440" y="218">2</text>
          <text class="vl-tier-name" x="440" y="236">Costly commitment</text>
          <text class="vl-chip" x="535" y="252">Airbnb · DoorDash</text>

          <text class="vl-tier-num" x="630" y="138">3</text>
          <text class="vl-tier-name" x="630" y="156">Recurring behavior</text>
          <text class="vl-chip" x="720" y="172">Uber</text>

          <polyline class="vl-ladder-beyond" points="900,190 958,142" marker-end="url(#vl-arrow)" />
          <text class="vl-tip-label" x="950" y="128">a business</text>
        </svg>
        <p class="font-label vl-figcaption">
          Opinion sits flat — it never rises on its own. Real evidence climbs: a
          problem interview, then a costly commitment, then behavior that repeats
          without a push.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal vl-tiers">
        <h2 class="font-label vl-label">The ladder, tier by tier</h2>

        <div class="vl-tier-row">
          <span class="vl-tier-row__n">0</span>
          <span class="vl-tier-row__name">Opinion</span>
          <span class="vl-tier-row__detail">
            <span class="vl-tier-row__def">Anyone's view that the problem is real, including the founder's own. Costs nothing to say, costs nothing to agree with.</span>
            <span class="vl-tier-row__ex"><b>Dropbox</b> is usually cited here too: a demo video and an overnight waitlist spike. It measured attention, not a decision to pay or change behavior, so it's weaker evidence than it's given credit for.</span>
          </span>
        </div>
        <div class="vl-tier-row vl-tier-row--real">
          <span class="vl-tier-row__n">1</span>
          <span class="vl-tier-row__name">Problem interview</span>
          <span class="vl-tier-row__detail">
            <span class="vl-tier-row__def">A structured conversation with a real target customer about what already happened to them, not about the idea.</span>
            <span class="vl-tier-row__ex">Confirms the problem exists, how often, how painful, and what they already do about it today.</span>
          </span>
        </div>
        <div class="vl-tier-row vl-tier-row--real">
          <span class="vl-tier-row__n">2</span>
          <span class="vl-tier-row__name">Costly commitment</span>
          <span class="vl-tier-row__detail">
            <span class="vl-tier-row__def">The person gives up something real — money, time, or reputation — before the product fully exists.</span>
            <span class="vl-tier-row__ex"><b>Airbnb</b> rented air mattresses in their own apartment during a sold-out conference and took real payment, before any platform existed. <b>DoorDash</b> ran a one-page site listing a few restaurant menus and drove the food themselves, before any delivery software existed. Neither waited for permission to find out.</span>
          </span>
        </div>
        <div class="vl-tier-row vl-tier-row--real">
          <span class="vl-tier-row__n">3</span>
          <span class="vl-tier-row__name">Recurring behavior</span>
          <span class="vl-tier-row__detail">
            <span class="vl-tier-row__def">People come back, pay again, or refer someone else, without anyone asking them to.</span>
            <span class="vl-tier-row__ex"><b>Uber</b> started in one city with one vehicle class, aimed at people already paying for black cars, and watched for repeat use before expanding to new cities or cheaper tiers.</span>
          </span>
        </div>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <span class="pill-tag pill-tag--coral tilt-left vl-case__status">A lesson from my own experience</span>
        <h2 class="font-display vl-case__title">Moneta Tech</h2>
        <p class="font-label vl-body">
          Moneta Tech was a Miami fintech startup I joined, aiming to digitize spare
          change. By most outside measures, it looked validated: we got into Bank
          of America's Breakthrough Lab, received a $100k Google Latino Founders
          Fund scholarship, and had real mentors from the VMT Group pushing on the
          product with us. We built to a real MVP.
        </p>
        <p class="font-label vl-body">
          None of that was the same thing as tier 2 or 3 evidence from the actual
          customer. Accelerator attention and grant money are a real vote of
          confidence from smart people, but they're still closer to tier 0 — an
          informed opinion, not a stranger giving up money or coming back
          unprompted. When we got to real market fit, the honest answer was that we
          were caught in between: too big a build for the customer who'd actually
          commit, too small a wedge for the customer we'd been picturing. That gap
          is exactly where a lot of accelerator-stage ideas quietly stall, and it's
          survivable, but only if it's named early instead of after the build is
          already done.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal vl-closing">
        <p class="font-display vl-closing__statement">Before building more, climb one more rung.</p>
        <p class="font-label vl-closing__note">
          The ladder stays the same from one idea to the next — only the box near
          the bottom changes. If you're trying to run your own idea through it,
          the next page has the actual worksheets: a fill-in canvas, a segment
          table, and the interview questions that actually produce evidence versus
          the ones that just feel like they do.
        </p>
        <div class="vl-closing__ctas">
          <router-link
            to="/notes/validation-ladder/toolkit"
            class="pill-tag pill-tag--coral tilt-right"
            @click="trackEvent('notes_toolkit_click', { from: 'validation-ladder' })"
          >The toolkit →</router-link>
          <a
            href="mailto:hello@launchit.studio?subject=Validation%20sanity%20check"
            class="vl-closing__email font-label"
            @click="trackEvent('contact_click', { location: 'notes-validation-ladder' })"
          >Or just email me — hello@launchit.studio</a>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'
import { trackEvent } from 'boot/analytics'

const root = ref(null)

onMounted(() => {
  window.scrollTo(0, 0)
  root.value.querySelectorAll('.reveal').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      delay: i === 0 ? 0.1 : 0,
      ease: 'power2.out'
    })
  })
})
</script>

<style lang="scss" scoped>
.vl-page {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.vl-page__inner {
  max-width: 680px;
  margin: 0 auto;
}

.vl-header {
  margin-bottom: 1rem;
}

.vl-header__title {
  font-size: clamp(1.9rem, 4.5vw, 2.75rem);
  font-weight: 600;
  line-height: 1.15;
  margin: 1rem 0 1rem;
}

.vl-header__lede {
  font-size: 1.05rem;
  line-height: 1.65;
  opacity: 0.85;
  margin: 0;
}

.vl-label {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0 0 0.75rem;
}

.vl-body {
  line-height: 1.7;
  margin: 0 0 0.9rem;

  &:last-child {
    margin-bottom: 0;
  }

  em {
    font-style: italic;
  }
}

.vl-quotes {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 2px dashed rgba(62, 124, 166, 0.5);
}

.vl-quote {
  font-size: 0.95rem;
  font-style: italic;
  opacity: 0.75;
}

// --- Diagram -----------------------------------------------------------
.vl-figure {
  padding: 1.5rem 0;
}

.vl-figure svg {
  display: block;
  width: 100%;
  height: auto;
  min-width: 0;
}

.vl-figcaption {
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.55;
  opacity: 0.65;
  max-width: 48ch;
  margin: 1rem auto 0;
}

.vl-ladder-flat {
  fill: none;
  stroke: var(--gridline);
  stroke-width: 3;
  stroke-dasharray: 2 7;
  stroke-linecap: round;
  opacity: 0.7;
}
.vl-ladder-climb {
  fill: none;
  stroke: var(--coral);
  stroke-width: 4;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.vl-ladder-beyond {
  fill: none;
  stroke: var(--coral);
  stroke-width: 3;
  stroke-dasharray: 1 7;
  stroke-linecap: round;
}
.vl-dot-flat {
  fill: var(--paper);
  stroke: var(--gridline);
  stroke-width: 2.5;
}
.vl-dot-climb {
  fill: var(--coral);
}
.vl-tier-num {
  font-family: var(--font-label);
  font-weight: 700;
  font-size: 25px;
  fill: var(--navy);
  text-anchor: middle;
}
.vl-tier-num--flat {
  fill: var(--navy);
  opacity: 0.45;
}
.vl-tier-name {
  font-family: var(--font-label);
  font-weight: 600;
  font-size: 12.5px;
  fill: var(--navy);
  opacity: 0.7;
  text-anchor: middle;
}
.vl-chip {
  font-family: var(--font-label);
  font-size: 12.5px;
  fill: var(--navy);
  text-anchor: middle;
}
.vl-quote-svg {
  font-family: var(--font-label);
  font-style: italic;
  font-size: 11.5px;
  fill: var(--navy);
  opacity: 0.55;
  text-anchor: middle;
}
.vl-axis-label {
  font-family: var(--font-label);
  font-size: 11px;
  letter-spacing: 0.08em;
  fill: var(--navy);
  opacity: 0.55;
  text-transform: uppercase;
}
.vl-tip-label {
  font-family: var(--font-label);
  font-weight: 600;
  font-size: 12px;
  fill: var(--coral);
  text-anchor: end;
}
.vl-arrowhead {
  fill: var(--coral);
}

// --- Tier rows -----------------------------------------------------------
.vl-tiers {
  padding-top: 0.5rem;
}

.vl-tier-row {
  display: grid;
  grid-template-columns: 44px 150px 1fr;
  gap: 1rem;
  padding: 1.1rem 0;
  border-top: 1px solid rgba(62, 124, 166, 0.3);

  &:last-child {
    border-bottom: 1px solid rgba(62, 124, 166, 0.3);
  }
}

.vl-tier-row__n {
  font-size: 1.5rem;
  font-weight: 700;
  opacity: 0.4;
}

.vl-tier-row--real .vl-tier-row__n {
  color: var(--coral);
  opacity: 1;
}

.vl-tier-row__name {
  font-weight: 700;
  font-size: 0.95rem;
  align-self: start;
  padding-top: 0.2rem;
}

.vl-tier-row__detail {
  display: grid;
  gap: 0.4rem;
  min-width: 0;
}

.vl-tier-row__def {
  font-size: 0.9rem;
}

.vl-tier-row__ex {
  font-size: 0.85rem;
  opacity: 0.7;
  line-height: 1.55;

  b {
    opacity: 1;
    font-weight: 600;
  }
}

@media (max-width: 560px) {
  .vl-tier-row {
    grid-template-columns: 32px 1fr;
    grid-template-areas: "n name" "detail detail";
  }
  .vl-tier-row__n {
    grid-area: n;
  }
  .vl-tier-row__name {
    grid-area: name;
  }
  .vl-tier-row__detail {
    grid-area: detail;
  }
}

// --- Case callout -----------------------------------------------------------
.vl-case__status {
  margin-bottom: 1rem;
}

.vl-case__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

// --- Closing -----------------------------------------------------------
.vl-closing {
  text-align: center;
}

.vl-closing__statement {
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 500;
  max-width: 22ch;
  margin: 0 auto;
}

.vl-closing__note {
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.7;
  max-width: 50ch;
  margin: 1rem auto 0;
}

.vl-closing__ctas {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.75rem;
}

.vl-closing__email {
  font-size: 0.85rem;
  color: var(--navy);
  opacity: 0.75;
  text-decoration: underline;
  text-decoration-color: rgba(30, 43, 60, 0.3);

  &:hover {
    opacity: 1;
    color: var(--coral);
  }
}
</style>
