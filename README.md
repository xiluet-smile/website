# Xiluet Smiles website

Next.js (App Router, static export) + Tailwind CSS, deployed on Cloudflare Pages.

- `npm run dev` – local dev server
- `npm run build` – builds responsive images, then static HTML into `out/`
- `npm run preview` – serve `out/` with Pages Functions via Wrangler

Source images live in `src/assets/`; `scripts/build-images.mjs` emits AVIF/WebP variants to `public/images/`.

- `npm run check` – after a build, verifies every route's head tags, single H1, JSON-LD and no-JS content

Content lives in `src/content/*.json` (one source of truth for copy, prices and schema). Form handlers are Cloudflare Pages Functions in `functions/api/`; copy `.dev.vars.example` to `.dev.vars` to run them locally. See `DEPLOY.md` for deployment and `OPEN_ITEMS.md` for what still needs the clinic's input.
