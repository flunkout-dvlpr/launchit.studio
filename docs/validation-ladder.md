# The Validation Ladder

A framework for telling real market validation apart from conviction. Written as source content for a dedicated page on the site, not as internal notes. Companion diagram: `validation-ladder-diagram.html`.

## Why "everyone agrees this is needed" isn't validation

Three answers come up in almost every conversation about a new idea, and all three feel like evidence while being close to zero:

- **"Oh yeah, this is a real need."**
- **"I know the industry, this is much needed."**
- **"My friends, family and peers agree this is a real need."**

These aren't call-outs aimed at anyone in particular. They're things most people, founders included, end up saying about their own idea at some point. What they have in common: an opinion, about a hypothetical, from someone who pays no cost either way for being wrong. No money changed hands, no time was given up, nothing was given up to find out. Specifically:

- **Industry conviction is supply-side, not demand-side.** Someone close to a problem sees the worst cases most often, which can make it feel more urgent and universal than it is. Believing the problem is real isn't the same as knowing whether people will adopt *this* solution, at *this* price, through *this* channel, instead of just living with the workaround they already have.
- **A real problem doesn't guarantee demand for a specific solution.** "People struggle with this" can be true while "people will use this specific product to fix it" is false. The gap between the two is exactly where most ideas die.
- **People you know are a biased sample who are nice to you.** Friends, family and peers have a social cost to telling you your idea is bad, and none of them are a random sample of the actual target customer. Agreeing costs them nothing and makes the conversation easier, so that's often what you get.

The working definition to use instead: **real validation is evidence from the actual target customer, about real past behavior or a real costly commitment, that doesn't depend on them being nice to you.**

## The ladder of evidence

Borrowed loosely from *Testing Business Ideas* (Bland & Osterwalder) and *The Mom Test* (Fitzpatrick). Each rung is a different kind of test, and most ideas should be able to climb this before anyone writes production code.

| Tier | What it is | What it actually proves |
|---|---|---|
| 0: Opinion | "This is needed" from anyone, including the founder | Almost nothing. A reason to keep looking, not a reason to build. |
| 1: Problem interview | A structured conversation with a real target customer about their past behavior, not your idea | Confirms the problem exists, how often, how painful, what they already do about it |
| 2: Costly commitment | The person gives up something real before the product fully exists | Confirms they'll act, not just talk |
| 3: Recurring behavior | People come back without being asked | Confirms it's a business, not a one-time favor |

Most "we validated this" claims stop at tier 0 or 1 and get treated like tier 3.

## Real companies, real tests

- **Airbnb (2007).** Before any platform existed, the founders rented air mattresses in their own apartment during a sold-out conference and charged real guests real money. One test, one weekend, real cash. That's tier 2: a costly commitment from real strangers, not a survey about whether people would theoretically stay in someone's home.
- **DoorDash (2013, as "Palo Alto Delivery").** Before any delivery software existed, the founders put up a simple static page listing a handful of restaurant menus with a phone number on it, and personally drove the food themselves when orders came in. They were manually testing whether people would order and pay before building any logistics. Also tier 2, and cheap: no app, no drivers, no restaurant integrations, just a page and a phone.
- **Uber (2010, as UberCab).** Started in one city, with one vehicle class, aimed narrowly at people already paying for black-car service who wanted it to be easier to request. They watched whether people actually reordered before expanding to new cities or cheaper tiers. Tier 2 moving into tier 3: a narrow real test, expanded only once repeat usage showed up.
- **Dropbox (2008).** Before the product fully worked at scale, they posted a demo video showing what it would do, and watched the waitlist signups spike overnight. That's a weaker signal than the other three, tier 1 to 2, because an email signup costs almost nothing. It validated interest and attention, not willingness to pay or to actually change behavior. Worth knowing the difference: this is the one of the four that gets cited the most and proves the least.

The common thread in the three strongest ones: a cheap, fast, mostly manual test, in front of real strangers, with something real at stake for them, before any serious engineering happened.

## Run your own idea through it

A canvas or a segment list doesn't prove anything by itself. It just makes it obvious which boxes are filled with real evidence and which are filled with a good guess. For most ideas at the start, almost every block below starts in the second category, which is fine, as long as it's labeled honestly instead of treated like proof.

### A canvas to fill in

For each block, write the current answer, then mark it **Validated** (from a real tier 1-3 test), **Assumed** (a good guess, not yet tested), or **Unknown** (not addressed yet).

| Block | Prompt | Status |
|---|---|---|
| Problem | What's the top 1-3 problems worth solving? | |
| Customer segments | Who has this problem badly enough to act? | |
| Unique value proposition | Why would they choose this over doing nothing, or over the workaround they already use? | |
| Solution | What's the smallest version that addresses the problem? | |
| Channels | How would the right people actually find out this exists? | |
| Revenue streams | Who pays, how much, and why would they keep paying? | |
| Cost structure | What does it cost to deliver this, including the ongoing human labor, not just the build? | |
| Key metrics | What number would actually prove this is working, and is anything measuring it yet? | |
| Unfair advantage | What's genuinely hard for someone else to copy? | |

A canvas with everything marked Assumed isn't a failure, it's an honest starting point. The point of filling it in is seeing exactly which block to go test first.

### A segment table to fill in

| Segment | Assumed need | Status | How to validate |
|---|---|---|---|
| *(example)* Busy working parents | Wants more time back in the week | Assumed, from the founder's own experience | Interview 8-10 people matching this profile who aren't already in the founder's network |
| | | | |
| | | | |

Add a row per segment the idea is aimed at. The "status" column is the one people skip, and it's the one that matters.

## Interview questions: good versus bad

The whole discipline is The Mom Test in one sentence: ask about specific things that already happened in the past, never about hypothetical future behavior, and never mention the idea until the second half of the conversation.

**Questions that actually produce evidence:**
- "Tell me about the last time you ran into this. Walk me through what happened, starting from the first moment you noticed it."
- "What was the very first thing you did about it?"
- "How did you find the people or tools you ended up using?"
- "What did you end up paying, roughly, across everything?"
- "What was the hardest or most frustrating part of the whole thing?"
- "Did you look for any kind of solution anywhere? What did you find, if anything?"
- Closing, the strongest question of all: "Do you know anyone else dealing with this right now? Could you introduce me?" A real referral costs them something, so it's a real signal, where a compliment costs nothing.

**Questions that feel like validation but aren't:**
- "Do you think something like this would be helpful?" — hypothetical, invites politeness.
- "Would you use a product that did X?" — leading, pitches the solution before you've heard the problem.
- "Is this a problem you have?" — yes or no, easy to agree to just to be agreeable.
- "How much would you pay for this?" — people are bad at pricing a hypothetical. Ask what they actually paid last time instead.

## A survey, if you want to go wider than interviews can reach

Surveys are weaker than interviews for this kind of question, because self-reported future intent is unreliable. They're still useful for checking how common and how severe a problem is across more people than you can sit down with, as long as every question asks about something that already happened, not something hypothetical.

A rough structure:
1. **Screener:** confirm the respondent actually matches the target segment, and exclude anyone who doesn't.
2. **Behavior, as a checklist, not a hypothetical:** "Which of these have you personally done or paid for?" with real options, not "would you."
3. **Channel, open text:** "How did you find the people or tools you used?"
4. **Pain ranking:** which part was most frustrating, as a ranked list of real sub-problems.
5. **Real spend, as a range:** "Roughly how much did you spend in total?"
6. **A real ask, not a hypothetical one:** "Would you be willing to do a 15-minute call about your experience?" with a contact field. The percentage who say yes and actually show up is itself a validation signal, stronger than anything else in the survey.

## Further reading

- *The Mom Test* — Rob Fitzpatrick. Short, and built entirely around this exact problem.
- *Testing Business Ideas* — David Bland and Alexander Osterwalder. A catalog of experiments ranked by cost and evidence strength, basically the ladder above expanded into a full book.
- *Running Lean* — Ash Maurya. The Lean Canvas itself, plus the problem interview and solution interview scripts it's built around.
- *Talking to Humans* — Giff Constable. Short and practical, a good next read once the first few interviews are booked.
