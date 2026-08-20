---
type: demo
series: "Meditations: a demo series"
part: 4
totalParts: 4
slug: demo-4-deployment
title: "Deploying it, and getting the links to preview correctly"
liveUrl: "https://meditations.launchit.studio"
order: 4
date: "Built as a personal project"
readTime: "~5 minutes"
---

## What this part covers

The last three parts covered turning a public-domain text into a dataset, building the page that displays it, and the backend that decides who gets a text and when. This part is about the least glamorous but most necessary step of all: actually putting it somewhere real people can reach, plus one small problem that only shows up once real people start sharing the link.

## Two halves, two deploy paths

The frontend and backend deploy separately, because they're genuinely different kinds of infrastructure. The backend, being a SAM template, deploys the standard way: `sam deploy`, using settings stored in a config file. The frontend is a static site (an S3 bucket serving files behind a CloudFront distribution), and while that could also be automated through SAM, it's driven by a small custom Node script instead, mostly because a static-site deploy benefits from being idempotent and re-runnable in a way that's easier to reason about as plain code than as a stack template.

## What the deploy script actually does

Each run of the script works through the same sequence:

1. Build the app (`quasar build`).
2. Check whether an S3 bucket already exists from a previous run (its name gets saved to a small local state file after the first deploy); reuse it if so, create a new one if not.
3. Same pattern for a CloudFront "origin access control," the mechanism that lets CloudFront read from the bucket without the bucket being publicly accessible.
4. Same pattern again for the CloudFront distribution itself, configured so that a request for any path that isn't a real file (the normal case for a single-page app's client-side routing) falls back to `index.html` instead of showing a 404.
5. Set a bucket policy that only allows that specific CloudFront distribution to read from the bucket, nothing else.
6. Upload every built file, with `index.html` set to never cache (so a new deploy shows up immediately) and every other file set to cache for a full year (safe, because Quasar fingerprints filenames on every build, so a changed file gets a new name rather than overwriting a cached one).
7. Delete any leftover files in the bucket from a previous build that aren't part of the current one.
8. Tell CloudFront to invalidate its cache so the new version actually shows up right away instead of waiting for old cached responses to expire.
9. Save all the IDs it just created or reused (bucket name, distribution ID, and so on) back to that local state file, so the next deploy reuses this same infrastructure instead of creating a duplicate copy of everything.

That last point is really the whole idea: the script is safe to run over and over. The first run creates everything from scratch; every run after that recognizes what already exists and just updates it.

## A small chicken-and-egg problem between the two halves

The frontend and backend don't just deploy separately, they briefly depend on each other in a way that has to happen in order:

- The backend needs to know the frontend's domain (the CloudFront address that text-message links should point to), so that has to be filled in *after* the frontend's first deploy.
- The frontend, in turn, needs a value the backend only produces once it's deployed (covered below), so that has to be filled in *after* the backend's deploy.

In practice that means: deploy the frontend once, copy its domain into the backend's configuration, deploy the backend, copy one more value it outputs back into the frontend's configuration, then re-run the frontend deploy one more time to pick it up. It's a manual, two-way handoff rather than one push-button command, and it's a good example of a problem that shows up any time two independently deployed pieces of infrastructure need to reference each other: something has to bootstrap first, and the tooling has to make that order obvious rather than leaving it to memory.

## Getting shared links to actually preview

Here's the problem: when someone shares their `/d/{token}` link in a text thread or on social media, the app receiving that link (iMessage, Slack, whatever) doesn't render the page like a browser would. It fetches the raw HTML once, looks for a handful of `<title>` and `<meta>` tags, and builds a small preview card from whatever it finds. A single-page app's raw HTML file is the same generic shell for every single passage, so without help, every shared link would preview with the same blank, generic title no matter which passage it pointed to.

The fix is a small function that runs at the CloudFront edge, before the request even reaches the cache, and rewrites those meta tags on the fly for exactly one kind of request: a `/d/{token}` URL. When one comes in, it fetches that token's real passage data and the site's real `index.html` in parallel, then does a targeted find-and-replace on the title and description tags (including the Open Graph and Twitter Card variants social platforms actually read) before handing the page back.

A few things about how it's built that are worth knowing if you ever build something similar:

- It runs on **every** request, not just cache misses. That's deliberate: if it only ran on a cache miss, a crawler's request could get cached and then served to a real visitor (or the reverse), since the cache doesn't otherwise vary by who's asking.
- There's no user-agent sniffing to decide who gets the real preview and who doesn't. Everyone, crawler or human, gets the same corrected HTML. That's simpler and there's nothing to get wrong by guessing which requests are "real."
- If anything about the fetch fails (an expired token, a slow response, whatever), it just quietly falls back to the normal page instead of erroring out. A broken preview card is a minor cosmetic miss; a broken page is not an acceptable tradeoff for one.
- Lambda@Edge functions can't use environment variables or Lambda layers, which is a real constraint compared to normal Lambdas, so anything they need (like which API to call) has to be hardcoded directly into the function.

## Why this is cheap

All of this, the database, the five functions, the hourly scheduler, the static hosting, and the edge function, runs on pay-per-request pricing with no server sitting idle waiting for traffic. For a project at this scale (one person's subscriber list, one text a day per person), the actual monthly cost is a few dollars at most. That's the same "under $5 a month" number referenced on the Our Set Up page, and this project is a real example of what that looks like in practice, not a rounded-off estimate.

## Closing this series out

That's the whole path: a public-domain text, turned into a clean dataset, turned into a page worth reading, turned into a daily habit someone can actually receive, deployed in a way that costs almost nothing to run. None of the individual pieces were exotic, chunking text, a scheduled job, a static site behind a CDN, a small edge function. What made it work was doing each piece deliberately and writing down the reasoning at each step, which is really the same thing this whole prep-artifact series is for.

If any of this made you want to try building something yourself, the [Our Set Up page](/sessions/setup) covers exactly what's needed to get started with Claude Code, and it's the same tool used to build every part of this project, and every session in this series.
