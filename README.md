# prachii

Scroll-driven archive landing page. React 19 · TypeScript · Vite 6 · Tailwind v4 · GSAP ScrollTrigger · Motion 12.

```bash
npm install
npm run dev   # downloads media into public/media on first run
```

## How it works

- `#scroll-spacer` is the only element with scroll height. Everything else is `position: fixed`.
- **Phase 1 (0 → 100vh):** GSAP ScrollTrigger (`scrub: true`, `ease: none`) slides `#black-panel` up over the video.
- **Phase 2 + outro:** a `requestAnimationFrame` loop in `BlackPanel.tsx` reads `window.scrollY` (no scroll listener) to scroll the gallery, scale each card in/out, and drive the white overlay, the lifting product info, the "view" pill and the footer.
- **Video (desktop ≥1024px):** never played. Cursor X scrubs `currentTime` through a dead zone of `max(30px, 5vw)`. `currentTime` is only written when `!video.seeking`.
- **Video (<1024px):** autoplays left → right → left; respects `prefers-reduced-motion`.

## Media (local)

Everything is served locally: fonts come from `@fontsource/inter-tight`, and the videos and images live in
`public/media/`. `npm run dev` and `npm run build` first run `scripts/download-assets.mjs`, which fetches
anything missing from the URLs in `src/assets.manifest.json` (existing files are skipped). Run
`npm run assets` yourself to see errors if a download fails.

To use different media, edit `src/assets.manifest.json` (the written spec and the reference HTML pointed at
different files: `ms-3d.mp4` / `ms-nature.mp4` and images 289–298 are the other set) and run `npm run assets`.
Or drop your own files into `public/media/videos` and `public/media/images` using the same file names.
