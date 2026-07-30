# launchit.studio

Source for [launchit.studio](https://launchit.studio), including
**Launchit Sessions** (`/sessions`), a recurring Houston community event
where a real local business or community problem gets built out live with
Claude. See [CLAUDE.md](./CLAUDE.md) for the full project spec.

## Structure

- **`client/`** — the Quasar (Vue 3) static site. See `client/README.md`
  (Quasar's own scaffold docs) for the standard install/dev/build commands.
- **`sessions-archive/`** — the canonical, non-website archive of the actual
  project folders and `CLAUDE.md` briefs behind every Sessions demo and
  cycle. See [`sessions-archive/README.md`](./sessions-archive/README.md).
  Any `CLAUDE.md` offered as a download from the site is generated from
  here, never hand-edited in `client/public/downloads/` directly.
- **`docs/`** — planning docs from the site's own build: brand identity
  (palette, type, Houston iconography) and the Framework page's animation
  spec/handoff notes. Reference material, not something the site reads
  from at runtime.

## Running locally

```bash
cd client
npm install
npm run dev
```

`npm run dev` and `npm run build` both run `sync:downloads` first, which
copies the current `CLAUDE.md` from each `sessions-archive/` project into
`client/public/downloads/` so the site's download links stay current.

## Deployment

Static build (`npm run build` in `client/`), hosted on S3 behind
CloudFront. No backend, no database, no auth for v1.
