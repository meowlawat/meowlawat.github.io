# hardikahlawat.me

Personal portfolio for Hardik Ahlawat — cybersecurity researcher, ML engineer,
systems builder. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS
v4, and Motion.

Deployed via GitHub Pages (see `.github/workflows/deploy-pages.yml`), served
at [hardikahlawat.me](https://hardikahlawat.me) through the `public/CNAME`
file.

## Development

```bash
npm install
npm run dev
```

## Content

All portfolio content lives in typed data files under `data/` — nothing is
hardcoded into components. `data/generated/github.ts` is the one exception:
it's produced by `scripts/fetch-github.ts` (`npm run fetch:github`) from the
curated allowlist in `data/github-curation.ts`, and regenerates automatically
on every build.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds a static
export (`next build` with `output: "export"`) and publishes it to GitHub
Pages. No server runtime is required — every route is statically generated
at build time.
