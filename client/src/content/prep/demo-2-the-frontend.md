---
type: demo
series: "Meditations: a demo series"
part: 2
totalParts: 4
slug: demo-2-the-frontend
title: "Building a frontend that feels like reading, not an app"
order: 2
date: "Built as a personal project"
readTime: "~6 minutes"
---

## What this part covers

Part 1 was about turning *Meditations* into 506 clean, tagged passages. This part is about the page someone actually lands on when their daily text arrives: a single passage, presented like it's worth slowing down for, not another notification to swipe away.

The whole frontend is a small Quasar (Vue 3) app with exactly three real pages: a signup form, the daily passage page, and an about page. No login, no dashboard, no navigation chrome at all. That smallness was a deliberate choice, and it shaped almost every decision below.

## No accounts, just a link

Every subscriber's daily text links to `/d/` followed by a long, unguessable token, not a username or a login screen. Signing up writes a row to a database keyed by phone number; each day's passage gets its own token, tied to that phone number, and the text message is just a link to it.

That means the entire "auth system" is: does this token exist, and does it point to a real passage. No passwords to forget, no account settings, nothing to manage. For a project that only ever sends one message a day, a login system would have been pure overhead. The lesson generalizes past this project: before building an account system, it's worth asking whether a single, private link would actually do the job.

## The design system: a Roman manuscript, not an app

This was the part I spent the most deliberate effort on, because the whole point of *Daily Meditations* is that it doesn't feel like a notification. It should feel like opening a page in an old book that happens to have exactly the right thought on it today.

A few concrete choices that add up to that feeling:

- **Two fonts, nothing else.** Cinzel (a classical, engraved-looking serif) for headings and labels, EB Garamond for body text. Both self-hosted, no web-font service.
- **A parchment-and-bronze palette**, defined as a small set of named colors rather than one-off hex codes scattered through the CSS: a parchment background, an ink-colored text, a bronze accent for links and emphasis, a muted "verdigris" green and "terracotta" red standing in for success/error states instead of the usual bright green and red.
- **A drop cap** on the first letter of every passage, sized up and styled like an illuminated manuscript's opening letter.
- **A fleuron divider**: a small ❧ character (an actual Unicode "hedera" glyph, not an image) flanked by two thin horizontal rules, reused as a section break across every page.
- **"Carved" headings**: a two-layer text-shadow (a light highlight above, a dark groove below) that makes headings read like they're etched into stone rather than sitting flat on the page.
- **Paper and marble texture, with zero image files.** The background isn't a photo of parchment, it's a pair of SVG noise filters (`feTurbulence`), one tuned for a tight paper-grain texture, one for a slow marble vein pattern, layered as CSS backgrounds. That sidesteps any question of where a texture photo came from or what license it's under, and it scales to any screen size without pixelation.

None of this required a design tool. It came from picking a small, consistent vocabulary (two fonts, one palette, one recurring motif) and applying it everywhere, the same "locked instruction" idea from Part 1's tone-tuning, just applied to pixels instead of prose.

## The word-by-word reveal

The signature moment on the daily page is the passage arriving one word at a time instead of appearing all at once. It's built with GSAP, but more simply than it might look: the text isn't sliced up by some clever animation plugin, it's just split on spaces in a plain JavaScript computed property, and each resulting word becomes its own `<span>` in the page.

```js
words () {
  const rest = this.displayText.slice(1)
  return rest ? rest.split(' ') : []
}
```

GSAP then animates all of those word-spans together, fading and lifting each one in with a small delay between them:

```js
tl.from(this.$refs.passage.querySelectorAll('.dm-dropcap, .dm-word'), {
  opacity: 0, y: 10, duration: 0.4, stagger: this.wordStagger()
}, '-=0.2')
```

The detail worth calling out is `wordStagger()`. A fixed delay per word sounds fine until a passage is 150 words long instead of 40, and suddenly the reveal takes four times as long to finish. Instead, the delay is time-budgeted: it's capped so the whole reveal never takes more than about 1.4 seconds no matter how long the passage is, only shrinking the per-word gap as the word count goes up. A short passage and a long one both finish revealing in roughly the same amount of time.

The same reveal replays when someone taps "View original translation," so switching between the modern rewrite and the 1862 source feels like the same kind of arrival, not a jarring content swap.

## Keeping state boring on purpose

There's no Pinia, no Vuex, no global state library anywhere in this app. Each page just tracks its own `loading`, `error`, and data in local component state, and a small `fetch` wrapper (`src/services/api.js`) handles talking to the backend:

```js
async function request (path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}
```

Three pages, no shared state between them, nothing that needs to survive a page reload. Reaching for a state management library here would have been solving a problem this app doesn't have. It's a small example of a bigger habit worth building: match the tooling to the actual size of the problem, not the size of problem that tooling is usually used for.

## Try it yourself

Pick something you're building, even something small, and write down a "locked visual instruction" the same way this project locked its tone in Part 1: two fonts and nothing else, one small named color palette, one recurring motif you'll reuse instead of inventing something new for every screen. Then hold yourself to it for a week. Consistency usually reads as more "designed" than any individual clever effect does.

## What's next

Part 3 covers the backend: how a single hourly scheduled job figures out which subscribers should get a text right now, no matter what timezone they're in, and how the actual text message gets sent.
