# zeist-clone

Landing page for Zeist, built with React, TypeScript, Vite, Tailwind CSS v4 and Motion.

## Getting started

```bash
npm install
npm run dev
```

Add `?motion=full` to the URL to preview every animation even when the OS "Reduce motion" setting is on.

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – type-check and build for production
- `npm run lint` – lint with oxlint
- `npm run preview` – preview the production build

## Structure

- `src/sections` – one file per page section
- `src/components/ui` – shared primitives (buttons, tabs, status pills, copy box)
- `src/components/visuals` – animated diagrams
- `src/components/layout` – navbar and footer
- `src/hooks` – animation timing and scroll helpers
- `src/lib` – copy, links and motion settings
