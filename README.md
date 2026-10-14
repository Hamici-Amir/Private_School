# Private School Management System — Frontend

A professional **School Management System** frontend for **private schools**, initially targeting the **Algerian market**.

This repository contains only the **frontend foundation (Version 1 — BASIC)**. There is **no backend, no database, no real authentication and no business module logic** in this repository. The architecture is prepared so those layers can be added later, through dedicated prompts, without rewriting the UI.

---

## Purpose

| Goal                                                        | Status                                           |
| ----------------------------------------------------------- | ------------------------------------------------ |
| Provide a scalable, verifiable frontend foundation          | ![done](https://img.shields.io/badge/done-green) |
| Support French / Arabic with native RTL/LTR switching       | ![done](https://img.shields.io/badge/done-green) |
| Light / Dark / System theming                               | ![done](https://img.shields.io/badge/done-green) |
| Mock-first data architecture, swappable to a real API later | ![done](https://img.shields.io/badge/done-green) |
| Route-level code splitting and lazy loading                 | ![done](https://img.shields.io/badge/done-green) |

The business modules (Dashboard, Students, Parents, Teachers, Classes, Subjects, Enrollment, Attendance, Grades, Payments, Expenses, Documents, Reports, Settings) are **registered but not implemented**; each one renders a placeholder page and is ready to receive business logic in a later prompt.

---

## Technology stack

- [Vite](https://vite.dev/) 8 + [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) (strict)
- [Tailwind CSS](https://tailwindcss.com/) 4 (via `@tailwindcss/vite`)
- [shadcn/ui](https://ui.shadcn.com/) foundation (`components.json`)
- [React Router](https://reactrouter.com/) 8
- [TanStack Query](https://tanstack.com/query) 5
- [Zustand](https://zustand.docs.pmnd.rs/) 5 (persisted UI preferences)
- [React Hook Form](https://react-hook-form.com/) 7 + [Zod](https://zod.dev/) 4 + `@hookform/resolvers`
- [Axios](https://axios-http.com/) (centralized HTTP client, ready for the backend)
- [Framer Motion](https://www.framer.com/motion/) (available for animations)
- [Recharts](https://recharts.org/) (available for dashboards/reports)
- [i18next](https://www.i18next.com/) + `react-i18next` (French / Arabic)
- [Lucide](https://lucide.dev/) icons
- ESLint 10 (flat config) + Prettier

---

## Installation

Requirements: **Node.js ≥ 20.19** (project verified on Node 24) and npm.

```bash
npm install
```

## Development commands

```bash
npm run dev           # start the Vite dev server
npm run build         # type-check + production build
npm run preview       # preview the production build locally
npm run typecheck     # TypeScript check (tsc -b)
npm run lint          # ESLint
npm run lint:fix      # ESLint with autofix
npm run format        # Prettier (with tailwindcss plugin)
npm run format:check  # Prettier check
npm run test          # Vitest (jsdom) component tests
```

## Environment variables

Copy `.env.example` to `.env.local` and adjust values:

```bash
VITE_API_BASE_URL=        # future backend base URL (empty while on mocks)
VITE_API_TIMEOUT=15000    # axios timeout in ms
VITE_USE_MOCK_API=true    # true -> mock layer, false -> real API
VITE_ENABLE_DEV_TOOLS=false # dev conveniences (React Query DevTools, verbose logs)
```

> Values are never hardcoded in the app. They are validated with a Zod schema
> (`src/app/config/env.ts`) and exposed through `src/app/config/env.ts`.

---

## Folder structure

```
src/
├── app/                 app shell: providers, router, config
│   ├── App.tsx
│   ├── providers/       QueryProvider, ThemeProvider, DirectionProvider
│   ├── router/          createBrowserRouter setup (routes.tsx)
│   └── config/          env schema, query-client defaults
├── assets/              static assets
├── components/
│   ├── ui/              shadcn/ui primitives (button, card, dialog, …)
│   ├── common/          AppLogo, ThemeToggle, LanguageSwitcher, loaders
│   ├── feedback/        error boundaries, error fallback, page skeletons
│   ├── forms/           shared form primitives (future)
│   ├── data-display/    shared display primitives (future)
│   └── navigation/      Header, Sidebar
├── features/            one folder per module (isolated, self-contained)
│   ├── dashboard/
│   │   ├── components/ hooks/ services/ schemas/ types/
│   │   ├── mocks/ utils/ constants/ pages/ index.ts
│   └── students/ …      (14 modules total)
├── layouts/             RootLayout, DashboardLayout, AuthLayout
├── pages/               public pages (Home, Login, 404)
├── hooks/               shared hooks (useTheme, useDirection, …)
├── services/            data-access layer (mock services, system service)
├── api/                 axios client + error types
├── store/               Zustand stores (UI preferences)
├── types/               shared domain types
├── schemas/             shared Zod schemas
├── mocks/               mock data registry
├── utils/               pure helpers
├── constants/           app constants, languages, navigation metadata
├── lib/                 design-token utils, theme helpers, cn()
├── i18n/                i18next setup + fr/ar resources
└── styles/              Tailwind v4 globals (design tokens, dark mode, RTL)
```

## Architecture highlights

- **Feature-based isolation** — every module lives in `src/features/<module>`, owns its
  pages/components/hooks/services and registers itself through a typed `FeatureModule`
  registry (`src/features/index.ts`). Routes and sidebar navigation are generated from
  that registry, so adding a module is a matter of creating a folder and one entry.
- **Data flow** — UI components never import mock arrays directly. The contract is:

  ```
  Component → Hook → Service → Mock
  ```

  When the backend is ready, only the service implementation changes:

  ```
  Component → Hook → Service → Axios API → Backend
  ```

- **Central HTTP client** — `src/api/http/client.ts` configures base URL, timeout and
  interceptors (auth header slot, normalized error classes). No URL is hardcoded.
- **RTL / LTR first-class** — language is global state; `dir` / `lang` are applied on
  `<html>` (`DirectionProvider`). Styles prefer logical properties so the UI flows
  correctly in Arabic (`rtl`) and French (`ltr`).
- **Theme** — `light`, `dark`, `system` with flash-free boot (`index.html` inline script)
  and live system-preference updates.
- **Code splitting** — every route, including every feature page, is loaded via
  `React.lazy` + `Suspense`.
- **Error handling** — global app error boundary and a router-level error boundary with
  retry / home actions; technical details are shown only in dev.

## Mock API strategy

- Mock data lives centrally in `src/mocks` and is consumed only through `src/services`.
- `createMockService` exposes typed, latency-simulated data access.
- `VITE_USE_MOCK_API` selects the mode; the service layer is the single swap point.

## Future backend integration

1. Implement feature services under `src/services` (or inside each feature) using the
   axios client from `@/api`.
2. Set `VITE_API_BASE_URL` and `VITE_USE_MOCK_API=false`.
3. Keep the same hook/component contracts — no UI rewrite.

## Contribution guidelines

- Follow the naming conventions described in `ARCHITECTURE.md`.
- Feature code belongs in `src/features/<module>`; shared code belongs in the matching
  top-level folder.
- All user-facing strings go through i18n `t()` keys — Arabic and French entries are
  type-checked for parity.
- Run `npm run typecheck`, `npm run lint`, `npm run build` and `npm run test` before finishing.
- Format with `npm run format` before committing.
