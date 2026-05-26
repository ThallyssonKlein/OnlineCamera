# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

Playwright is installed but no test suite exists yet. Add tests under a `tests/` directory and run with `npx playwright test`.

## Stack and key versions

- **Next.js 16.2.6** — App Router only; no Pages Router. Check `node_modules/next/dist/docs/` before touching routing, middleware, or server/client component boundaries.
- **React 19.2.4**
- **Tailwind CSS v4** — configured via `postcss.config.mjs` and `@import "tailwindcss"` in `globals.css`. No `tailwind.config.*` file; theme tokens go in `@theme inline {}` blocks inside CSS files. The v3 `@tailwind base/components/utilities` directives do not exist in v4.
- **TypeScript**

## Architecture

Single-page app: `app/page.tsx` renders a centered layout with `CameraView` (`app/components/CameraView.tsx`).

`CameraView` is a Client Component (`"use client"`) that wraps `@shivantra/react-web-camera`'s `<WebCamera>` component. Camera switching is done via an imperative ref handle (`WebCameraHandler`) and its `.switch()` method.

`app/layout.tsx` applies Geist fonts via CSS variables and global styles from `app/globals.css`.

There is no API layer, no state management library, and no data fetching — the app is purely client-side camera access.
