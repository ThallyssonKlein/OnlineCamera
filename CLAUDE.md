# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npm run typecheck # tsc --noEmit
npm test         # Jest + React Testing Library (add -- --coverage for coverage)
```

Unit tests live next to the source as `*.test.ts(x)`. Playwright is installed but has no suite yet.

## Stack and key versions

- **Next.js 16.2.6** — App Router only; no Pages Router. Check `node_modules/next/dist/docs/` before touching routing, middleware, or server/client component boundaries.
- **React 19.2.4**
- **Tailwind CSS v4** — configured via `postcss.config.mjs` and `@import "tailwindcss"` in `globals.css`. No `tailwind.config.*` file; theme tokens go in `@theme inline {}` blocks inside CSS files. The v3 `@tailwind base/components/utilities` directives do not exist in v4.
- **TypeScript**

## Architecture

Source lives under `src/` with path aliases `@components/*`, `@hooks/*`, `@services/*` (configured in `tsconfig.json` and `jest.config.mjs`; add new aliases to both).

- `src/app/` — App Router: `page.tsx` renders `CameraView`; `layout.tsx` applies Geist fonts, global styles and wraps the tree in `ErrorBoundary`. Design tokens live in `@theme inline {}` in `globals.css`.
- `src/components/` — `CameraView` (wraps `@shivantra/react-web-camera`), `CameraIcon`, `ErrorBoundary`.
- `src/hooks/useCameraCapture.ts` — owns the camera ref, capture/switch actions and user-facing error state.
- `src/services/` — `logger`, `analytics`, `crashReporter` (analytics and crash reporting only log until a provider is chosen) and `fileDownload`.

There is no API layer, no state management library, and no data fetching — the app is purely client-side camera access.
