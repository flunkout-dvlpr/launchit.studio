---
type: demo
series: "Meditations: a demo series"
part: 1
totalParts: 4
slug: demo-1-text-to-dataset
title: "Turning a public-domain text into a dataset"
order: 1
date: "Built as a personal project"
readTime: "~5 minutes"
---

## Why Daily Meditations exists

It started with a movie. *Gladiator*, and its long-awaited sequel, did what good historical fiction does best: it made Stoic philosophy feel alive again, not academic. That sent me toward *The Daily Stoic*, Ryan Holiday's daily-devotional take on Stoicism, a short passage each morning, easy to sit with over coffee, easy to keep coming back to.

But *The Daily Stoic* pulls from across the whole Stoic canon, Seneca, Epictetus, Marcus Aurelius, all mixed together. What kept pulling me back was *Meditations* specifically: the private journal Marcus Aurelius kept for himself, never meant for an audience, a Roman emperor working through anger, fear, mortality, and purpose in real time. Reading it cold, in an old translation, can feel like hitting a wall though. The wisdom is there, the language just gets in the way.

Daily Meditations takes the format that made *The Daily Stoic* work, short, daily, situational, and applies it to a single source, in full: every passage in *Meditations*, rewritten in warm modern English, tagged to the kind of moment it actually speaks to (a hard morning, a difficult person, a spiral of overwhelm, the quiet fact of mortality), and paired with a short reflection to sit with. Not a summary of Marcus Aurelius, the same words he wrote for himself, minus the translation barrier.

## What this project is

That's the why. This series is about the how, starting with the least glamorous and most necessary step: turning a public-domain text into an actual dataset a program can work with. Marcus Aurelius wrote *Meditations* almost 1,900 years ago. I wanted to build something real with it, not just read it, so the first real question wasn't "how do I build the app," it was "how do I even get a legal, usable copy of this text into a shape a program can work with."

That question, and how I answered it, is most of what this part is about.

## Finding a source I could actually use

The well-known modern translations (Gregory Hays's especially) read beautifully, but they're copyrighted, so I couldn't legally feed one into a pipeline. Instead I used the George Long translation from 1862, which is public domain, hosted in a clean single-page HTML edition by Standard Ebooks. It's older and stiffer than a modern translation, but that stiffness turned out to be useful: it gave me a faithful, legally clean starting point I could then rework in my own voice, rather than paraphrasing someone else's already-modern phrasing.

## Chunking the text

The source HTML has no passage numbers rendered on the page. It's organized into 12 `<section>` elements (one per "book" of *Meditations*), each containing a stream of `<p>` and `<blockquote>` tags with no explicit boundaries between individual thoughts.

I used a small script (Cheerio, a jQuery-like HTML parser, running in Node) to walk each book's paragraphs and reconstruct passage boundaries: each `<p>` normally starts a new passage, unless it's short and comes right after a `<blockquote>`, in which case it's treated as a trailing line that belongs to the quote before it. That second rule exists because of one specific problem: Book 11 quotes several Greek tragedians at length, and without it, those quotes would get split apart from their surrounding context.

That pass produced 487 raw passages. After a manual review (some passages needed splitting or merging to read as one coherent thought), the final dataset landed at 506.

## Getting the tone right

This was the part that took the most iteration, and it's the part I'd actually recommend other people try for themselves, because it applies to way more than a stoic philosophy project.

I wrote one locked style instruction and reused it for every single passage:

> "Rewrite in warm, reflective modern English, as a thoughtful friend speaking gently to someone they respect. Keep it to 2-4 sentences. Favor invitations and quiet observations over commands. Preserve the original insight exactly, soften the delivery, never the truth. Light period detail is fine if it adds texture; otherwise keep imagery contemporary."

Getting to that exact wording took real trial and error. I started thinking about it as a set of knobs I could turn independently, rather than one vague "make it sound good" instruction:

- **Directness** - low to medium. Too direct read like a command, too soft lost the point.
- **Warmth** - high. This was the one that made the biggest difference.
- **Compression** - medium. Short enough to sit with, long enough to not feel clipped.
- **Register** - contemporary, but not slangy.
- **Address** - "you," never commands.
- **Imagery** - modernized by default, old imagery kept only when it still landed.

Once the instruction was locked, I had Claude call a tool (rather than just write free text) to produce each passage: the modern rewrite, a set of 1-3 situational tags (things like *starting-the-day*, *difficult-people*, *overwhelmed*, *mortality*), and a short reflection question. Forcing structured output through a tool call meant I never had to parse or guess at the shape of the response. It also made the whole batch job resumable: if it failed partway through 506 passages, I could rerun it and it would skip everything already written.

## A few examples

Here's what that pipeline actually produced. Straight from the dataset, the 1862 original next to the rewrite, plus the tags and reflection that came out of the same tool call.

**Book 2, passage 1**

> Original (1862): "Begin the morning by saying to thyself, I shall meet with the busybody, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil. But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me, not only of the same blood or seed, but that it participates in the same intelligence and the same portion of the divinity, I can neither be injured by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman, nor hate him. For we are made for cooperation, like feet, like hands, like eyelids, like the rows of the upper and lower teeth. To act against one another then is contrary to nature; and it is acting against one another to be vexed and to turn away."

> Rewritten: "Start your morning this way: expect that today you'll run into people who are meddling, ungrateful, arrogant, dishonest, envious, or simply hard to be around. They act this way because they haven't learned to see what's actually good and what's actually harmful. But you know better, you can see that goodness is beautiful and wrongdoing is ugly, and you can see that the person doing wrong is still your kin, sharing the same mind and the same spark of the divine that you carry. So none of them can truly harm you, since no one can make you ugly against your will, and there's no real reason to be angry with your own people, or to hate them. We were built to work together, like hands, like feet, like the rows of teeth in a single mouth; turning on each other is a betrayal of our own nature."

Tags: *difficult-people, starting-the-day, anger* — Reflection: "Who do you expect to find difficult today, and how might it soften things to remember you're on the same team?"

**Book 1, passage 6**

> Original (1862): "From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of daemons and such things; and not to breed quails for fighting, nor to give myself up passionately to such things; and to endure freedom of speech; and to have become intimate with philosophy; and to have been a hearer, first of Bacchius, then of Tandasis and Marcianus; and to have written dialogues in my youth; and to have desired a plank bed and skin, and whatever else of the kind belongs to the Grecian discipline."

> Rewritten: "From Diognetus, I learned not to waste myself on trivial pursuits, and not to be taken in by charlatans peddling miracles and spells. He taught me to tolerate honest, even blunt speech from others, and he opened the door to philosophy for me. I gained a taste for the simple life too, a hard bed, plain covering, the kind of discipline that clears away distraction and points toward what actually matters."

Tags: *mentorship, gratitude, discipline* — Reflection: "Which mentor in your own life steered you away from distraction and toward what truly matters?"

That second one is the clearest example of the compression knob at work: one long, comma-stitched Victorian sentence collapses into three modern ones, and the original insight (education matters, distraction doesn't) survives the trip intact.

## Try it yourself

If you want to feel this out on a much smaller scale, take any piece of text you didn't write (an old email, a policy doc, a recipe) and write a locked style instruction for it the same way: name the tone, the length, what to preserve, what's allowed to change. Then run the same instruction against five or six different passages and read them back to back. Wherever the voice feels inconsistent is usually a sign the instruction is still vague on that specific knob.

## Get the complete brief

Everything across all four parts of this series, the dataset pipeline, the backend, the frontend, and deployment, is written up as one complete project brief you can hand straight to Claude Code if you want to build the whole thing yourself.

[Download meditations-CLAUDE.md](/downloads/meditations-CLAUDE.md)

## What's next

Part 2 covers the frontend that displays these passages, including the design system and the word-by-word reveal animation. Part 3 covers the backend that texts people one passage a day, timezone handling included. Part 4 covers how the whole thing actually gets deployed, plus a small edge-computing trick that makes text-message links preview correctly when someone shares one.
