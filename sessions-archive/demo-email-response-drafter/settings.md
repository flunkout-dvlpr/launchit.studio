# Settings

Edit these values to change how the tool behaves. No code required, just
save the file and run it again.

- emails_to_check: 25
- skip_bulk_mail: true

## What these do

**emails_to_check** — how many of your most recent emails to look at each
run. Higher catches more but takes longer and uses more of your Gmail API
quota. 25 is a reasonable everyday default; try something like 100 if
you're running this for the first time after not checking for a while.

**skip_bulk_mail** — when `true`, newsletters and marketing emails are
filtered out before keyword matching even happens (anything with a
`List-Unsubscribe` header, which is required by law on bulk mail and never
present on a real person's email to you). This is what stops something
like a product newsletter mentioning "tracking" from being treated the
same as a customer asking where their order is. Set to `false` only if
you want to see every match with no filtering, expect more noise in
`data/matches.json` if you do.
