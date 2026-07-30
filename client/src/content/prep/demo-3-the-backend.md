---
type: demo
series: "Meditations: a demo series"
part: 3
totalParts: 4
slug: demo-3-the-backend
title: "The backend that texts you one passage a day"
order: 3
date: "Built as a personal project"
readTime: "~6 minutes"
---

## What this part covers

Part 1 produced 506 passages. Part 2 built the page that displays one of them. This part is the piece in between: how a subscriber's phone actually gets a text message at the right time, every day, no matter what timezone they're in, without ever sending them the same passage twice until every passage has had a turn.

The whole backend is five small AWS Lambda functions, two DynamoDB tables, and one scheduled job, all defined in a single AWS SAM template and deployed with `sam deploy`. No servers to patch, nothing running when nobody's using it.

## The two tables

**Subscribers** is keyed by phone number, and holds each person's timezone, their chosen notify hour (an integer, 0 to 23), and a status. **Assignments** is keyed by a random token, one row per passage ever sent to anyone, and it's what a subscriber's daily link actually points to. It also carries a secondary index on phone number plus date, which turns out to matter more than it sounds like it would, more on that below.

## Five small functions, not one big one

Rather than one backend service handling everything, the app is split into five single-purpose Lambda functions:

- **Signup** — validates a phone number and timezone, writes the subscriber row, sends a welcome text, and immediately sends a first passage too, so a new subscriber has something to read right away instead of waiting up to 24 hours for their first scheduled send.
- **Get assignment** — the one the daily page calls to fetch a passage by token.
- **Submit reflection** — saves whatever someone types into the reflection box back onto their assignment row.
- **Daily send** — the scheduler, covered in detail below.
- **Edge preview** — a different kind of function entirely (it runs at the edge, not behind the API), covered in Part 4 alongside deployment, since it's really a deployment-time concern more than a backend one.

Splitting it this way means each function does exactly one thing and can be tested, deployed, and reasoned about on its own. It also means a bug in, say, the reflection-saving code can't take down the part that actually sends texts.

## One clock, not twenty-four

The interesting problem here: subscribers can be in any timezone, each with their own preferred hour to receive a text, but there's no reason to run twenty-four separate scheduled jobs, one per hour, to cover that. Instead there's exactly one EventBridge schedule, firing once an hour, every hour:

```
cron(0 * * * ? *)
```

Every time it fires, the "daily send" function scans every active subscriber and, for each one, works out what hour it currently is where they live:

```js
function computeLocalHour(timezone, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, hour: "numeric", hour12: false,
  }).formatToParts(date)
  const hour = Number(parts.find((p) => p.type === "hour").value)
  return hour === 24 ? 0 : hour
}
```

If that local hour doesn't match the subscriber's chosen notify hour, nothing happens for them this run, it'll check again next hour. Out of the twenty-four times this job runs in a day, each subscriber only actually gets processed on the one run where the math lines up. One job, running on a fixed schedule, correctly handles subscribers in every timezone at once, because the timezone logic lives in the code that reads the clock, not in the schedule itself.

## Making sure nobody gets double-texted

A scheduled job that runs every hour and scans every subscriber needs a way to know "have I already sent this person their text today," otherwise a retry, an overlapping run, or a bug could send the same passage twice in one day, or the wrong passage.

This is where that phone-plus-date index on the Assignments table earns its keep. Before sending anything, the function queries a subscriber's full send history and checks whether today's date already shows up in it. If it does, it skips them. If it doesn't, it picks a passage the subscriber hasn't seen yet (falling back to starting the cycle over once all 506 have been sent), writes a new assignment row, and sends the text.

It's the same underlying idea as the resumable batch job from Part 1, where reprocessing already-written passages was avoided by checking what already existed before doing the work again. Here it shows up as a database query instead of a file check, but it's the same habit: before a repeating job does something, have it check whether that something has already happened.

## Actually sending the text

Texts go out through Amazon SNS, published directly to a phone number rather than through a topic or subscriber list, and explicitly marked as "Transactional" SMS, which is the message class meant for one-to-one, expected messages rather than bulk marketing sends. Phone numbers are validated against a simple E.164 format check before anything gets written or sent.

One honest note for accuracy: opt-out handling (replying STOP to unsubscribe) isn't custom code in this project, it's handled automatically by SNS itself at the AWS account level whenever messages are sent this way. That's worth knowing if you're building something similar and assuming you need to write STOP-keyword handling yourself, for a project at this scale, you likely don't.

## One shared toolbox, not five copies of the same code

All five functions pull from a single shared Lambda layer rather than each reimplementing the same database client, SMS client, and helper functions. It holds the DynamoDB and SNS client setup, the phone and timezone validation helpers, the timezone math shown above, the logic for picking an unseen passage, and a small set of consistent API response helpers. Centralizing that meant a fix or a tweak (say, to how a passage gets picked) only ever needs to happen in one file, not five.

## Try it yourself

If you're building anything that runs on a repeating schedule, whether it's a cron job, a daily email, or a scheduled sync, ask yourself the "already sent today" question before you build the sending logic: what's the one fact you can check to know whether this specific unit of work has already happened. Design that check first. It's a lot easier to bolt on send logic after the safety check exists than to retrofit a safety check after duplicate sends have already gone out.

## What's next

Part 4 covers how this actually gets deployed, a small custom script that stands up the frontend on S3 and CloudFront, and a Lambda@Edge trick that makes a text-message link preview correctly (with the right title and description) when someone shares it, instead of showing generic, empty preview text.
