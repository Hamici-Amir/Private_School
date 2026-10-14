# Architecture — Private School Management System (Frontend)

This document explains the internal architecture of the V1 (BASIC) foundation. It is the
reference for naming, layering and extensibility.

---

## 1. Layering & dependency rules

Code is split into two groups with strict dependency direction:

```
UI layer        components, layouts, pages, features, hooks
   │
   ▼
Data layer      services, api, mocks, store
   │
   ▼
Core layer      types, schemas, utils, constants, lib, i18n, config
```

Rules:

1. **No hardcoded domain data in UI components.** Components call hooks; hooks call
   services; a service either calls the mock layer or the HTTP client. Swapping mocks for
   a real backend never touches a component.
2. **Core layer has no dependencies on UI or data layers.** `types`, `schemas`, `utils`,
   `constants`, `lib` are pure. This keeps them testable and safe to share.
3. **Top-level folders hold only shared/reusable code.** Anything specific to one module
   lives inside `src/features/<module>`.
4. **Cross-feature imports are forbidden.** Features communicate only through top-level
   shared folders.

## 2. Feature-module system

Every module lives in `src/features/<module>` and registers itself in
`src/features/index.ts` through a typed registry (`FeatureModule`), used to generate:

- the route subtree (`src/app/router/routes.tsx`),
- the sidebar navigation, and the module list pages.

Canonical module shape:

```
src/features/<module>/
├── components/     local UI pieces
├── hooks/          local data hooks (use<Thing>s, use<Thing>)
├── services/       module-specific services (data access)
├── schemas/        module Zod schemas (validation)
├── types/          module domain types
├── constants/      module constants
├── mocks/          module mock data (only when meaningful)
├── utils/          module helpers
├── pages/          index-page.tsx, <name>-section.tsx …
└── index.ts        FeatureModule registration entry
```

(Empty subfolders may exist per convention even before a module is implemented.)

## 3. Data flow

### Selected cheat sheet

The flow is **mock-first** today, backend-ready tomorrow:

```
Component ──> Hook ──> Service ──> Mock registry (VITE_USE_MOCK_API=true)
                                │
                Service ──> Axios client (once backend exists, VITE_USE_MOCK_API=false)
```

- `src/api/http/client.ts` — single axios instance. Base URL and timeout come from the
  validated env config. Response/error normalization code lives here.
- `src/services/` — free functions, each returning `Promise<T>` regardless of source, so
  call sites cannot tell (and do not care) whether data came from mocks or the network.
- `src/mocks/` — central, typed mock data registry and `createMockService` helper
  (latency simulation + payload shape fidelity).

## 4. State management

Zustand is used for **UI-only, environment-like state**: language, direction, theme
(preferences class logic). Those stores are persisted, and the app boots before paint
from the persisted JSON baked into `index.html`.

Server/data state is intentionally **not** put into Zustand. It belongs to TanStack Query
(caches, loading, invalidation). See `src/app/config/query-client.ts` for shared defaults.

## 5. Routing & code splitting

- `src/app/router/index.tsx` builds a `createBrowserRouter` router.
- `src/app/router/routes.tsx` defines the route tree: public routes, authenticated layout,
  dashboard, and the feature subtree generated from the feature registry.
- Every leaf route is wrapped in `React.lazy` + `Suspense`: each feature page is its own
  chunk, loaded on demand.
- `/design-system` (lazy `src/pages/design-system-page.tsx`) is the interactive reference
  page for every UI primitive, token, state and table demo. It exists to exercise the
  foundation and is safe to remove once module pages cover the same ground.
- Layout responsibilities are split: `src/layouts/RootLayout`, `DashboardLayout`,
  `AuthLayout`.
- `<App/>` composes providers (query, theme, direction) + the error boundary.

## 6. Providers

- **`QueryProvider`** — TanStack Query with default options and devtools gated by
  `VITE_ENABLE_DEV_TOOLS`.
- **`ThemeProvider`** — theme store + internal `matchMedia` handling; applies `data-theme`
  class on `<html>`, keeps `system` in sync.
- **`DirectionProvider`** — applies `dir` and `lang` on `<html>`, making RTL a layout-level
  concern (see section 9).
- **`TooltipProvider`** / **`ToastProvider`** — mount the Radix tooltip provider and the
  sonner-backed toast system (`src/lib/toast.ts` facade + `src/app/providers/toast-provider.tsx`).

## 7. Error handling

- A global **App Error Boundary** (class component) wraps the router output and renders
  `ErrorFallback` with an optional retry that remounts the tree.
- A router-level **errorElement** catches route-loader/render errors and offers
  _go home_ / _try again_.
- Error boundaries never leak stack traces to users; technical details render only in dev.

## 8. Validation & env

- Single source of truth for environment variables: `src/app/config/env.ts`
  (Zod schema + parse). Exactly one typed-error path, surfacing symbols rather than raw
  strings.
- Shared validation lives in `src/schemas`; module schemas in each feature.
- `vite-env.d.ts` declares the `ImportMetaEnv` interface, keeping `env.ts` types honest.

## 9. i18n & RTL/LTR

- i18next + react-i18next. Bundled resources: `fr` (default) and `ar`. Key parity between
  the two catalogs is enforced by TS-aware key types and `dir` handling.
- Language is global state (`lang` set on `<html>`). Direction is derived from the
  language (Arabic → `rtl`) but is conceptually separate (`DirectionProvider`).
- **RTL rule:** Tailwind classes must use logical properties first
  (`ps-`, `pe`, `start-`, `end-`, `ms-`, `me-`, `inline-`, `block-`, …) instead of
  physical (`pl-`, `pr-`, `ml-`, `mr-`, `left-`, `right-`). Prettier's tailwind plugin
  sorts them safely.

## 10. Styling & theming

- Tailwind CSS **v4** through `@tailwindcss/vite`; no config file — tokens live in
  `src/styles/globals.css` (OKLCH/LCH grounded palettes, `@custom-*` CSS for styles,
  `data-theme` dark variant).
- Token catalog includes semantic colors (primary/secondary/accent/success/warning/
  destructive/info + soft variants), radius, shadows, a typographic scale and explicit
  z-index layers. `src/lib/tokens.ts` mirrors the CSS custom properties for TS consumers.
- Default palette configured in `components.json` (baseColor neutral) so the shadcn/ui
  generator regenerates consistent primitives.
- Themes: `light` / `dark` / `system`, previewed flash-free by the inline script in
  `index.html` before React hydrates.

## 10b. UI foundation & DataTable

- **Primitives** (`src/components/ui`) — Radix-based shadcn/ui components (dialog,
  alert-dialog, select, popover, command, tabs, accordion, tooltip, switch, slider,
  calendar, …) plus semantic Button/Badge variants and a composite `DataTable`.
- **Domain patterns** build on the primitives without business logic: `forms` (RHF +
  Zod-wired `FormField`/`FormItem`), `feedback` (`EmptyState`, `ErrorState`,
  `LoadingSkeletons`), `data-display` (`StatusBadge` + tone vocabulary, `AvatarGroup`,
  `StatCard`, `InfoCard`, `Timeline`, `List`), `navigation`, `dialogs`
  (`ConfirmDialog`, `FormDialog`) and `motion` (framer-motion wrappers honoring
  `prefers-reduced-motion`).
- **DataTable** wraps `@tanstack/react-table`. The installed v9 package keeps the v8 API
  behind `@tanstack/react-table/legacy` (`useLegacyTable`, `legacyCreateColumnHelper`,
  `LegacyColumnDef`/`LegacyTable`/`LegacyColumn`); the DataTable and helpers consume the
  legacy surface while exposing a simplified v8-style prop API (sorting, search, row
  selection, bulk actions, column visibility, pagination, loading/empty/error states).
  Column lists are typed with the exported `DataTableColumn<TData>` alias.

## 11. Project quality gates

```bash
npm run typecheck   # tsc -b → must pass
npm run lint        # eslint . → must pass (flat config)
npm run build       # tsc -b + vite build → must pass
npm run format:check
npm run test        # vitest run (jsdom) → must pass
```

Component tests live next to the sources (`*.test.tsx`) and assert behavior, not class
names: Button loading/disabled, Input validation wiring, Badge/StatusBadge mapping,
Empty/Error states, Avatar initials (incl. Arabic), DataTable sort/search/pagination,
and dialog accessibility.

Changes that introduce new rules or relax existing ones must be justified in the PR.

## 12. Out of scope (V1)

Authentication, role-based access, real business workflows (enrollment, grading,
payments, attendance…), backend/API, database, PDF & export pipelines, notifications,
deployment configuration. All are intended next milestones on this foundation.
