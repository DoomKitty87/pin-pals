# assets/

This folder contains static assets for the Pin Pals Next.js app.

Conventions:
- images/: raster or SVG images used in the UI (JPEG, PNG, SVG, WebP)
- icons/: small icon SVGs or icon sets

Usage in Next.js:
- Public assets are served from `/` (e.g. `/assets/placeholder.svg`).
- Prefer importing SVGs as components when using `next/image` is not required.

Add images here and commit them. Use descriptive filenames and organize into subfolders when needed (e.g. `images/avatars/`, `images/backgrounds/`).
