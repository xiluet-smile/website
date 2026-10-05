# Xiluet Smiles website

Next.js (App Router, static export) + Tailwind CSS, deployed on Cloudflare Pages.

- `npm run dev` – local dev server
- `npm run build` – builds responsive images, then static HTML into `out/`
- `npm run preview` – serve `out/` with Pages Functions via Wrangler

Source images live in `src/assets/`; `scripts/build-images.mjs` emits AVIF/WebP variants to `public/images/`.
