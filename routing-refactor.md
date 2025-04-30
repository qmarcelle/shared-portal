# Routing & Navigation Refactor – Next.js 14 App Router Living Spec

## 0️⃣ Status Snapshot

| Date       | Sprint    | % Complete | Lead   | Notes                     |
| ---------- | --------- | ---------- | ------ | ------------------------- |
| 2025-05-02 | Sprint 14 | 20%        | @Qwynn | P0-1 routes module merged |

---

## 1️⃣ Architectural Decisions (ADR Lite)

| #       | Topic                   | Decision                                                                    | Rationale                                              | Link/PR |
| ------- | ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ | ------- |
| ADR-001 | Public URL Strategy     | `/member/*` remains visible; middleware rewrites internally to `/{group}/*` | Clean URLs, multi-tenant                               | PR #312 |
| ADR-002 | Central Routes Metadata | Use `src/lib/routes.ts` as single source-of-truth for all route paths       | Avoid hard-coded strings, enable helpers & breadcrumbs |         |
| ADR-003 | Breadcrumb Generation   | Leverage Next.js 14 metadata API or central `getBreadcrumbs()` util         | Auto-generate crumbs, reduce boilerplate               |         |

---

## 2️⃣ Next.js 14 Features & Approaches

- **App Router**: File-system based routing under `src/app/`, enabling nested layouts, React Server Components, and streaming.
- **Route Groups**: `(common)` folders for shared pages; `[group]` dynamic segments for tenant-specific overrides.
- **Metadata API**: `export const metadata = { title, description, icon, breadcrumb }` in page modules.
- **Layouts & Templates**: `layout.tsx`, `loading.tsx`, `error.tsx` at any folder level for shared UI and error handling.
- **Dynamic Params & SSG/SSR**: `generateStaticParams()` for known dynamic segments and `revalidate` for ISR.

---

## 3️⃣ Route Registry & Metadata

```ts
// src/lib/routes.ts
import { pathToRegexp } from 'path-to-regexp';

export interface RouteConfig {
  path: string;
  name: string;
  isPublic: boolean;
  requiresAuth: boolean;
  hideHeaderFooter: boolean;
  inboundRedirect?: string;
  pattern?: RegExp;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    isPublic: true,
    requiresAuth: false,
    hideHeaderFooter: false,
  },
  {
    path: '/myplan',
    name: 'My Plan',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/myplan/benefits',
    name: 'Benefits & Coverage',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  // …other routes
];

// Compile regex patterns
routes.forEach((r) => (r.pattern = pathToRegexp(r.path)));

// Helpers
export const isPublicRoute = (url: string) =>
  routes.some((r) => r.isPublic && r.pattern!.test(url));
export const shouldHideHeaderFooter = (url: string) =>
  routes.some((r) => r.hideHeaderFooter && r.pattern!.test(url));
export const getInboundRedirect = (url: string) =>
  routes.find((r) => r.inboundRedirect && r.pattern!.test(url))
    ?.inboundRedirect;
```

---

## 4️⃣ Dynamic Routing & Route Groups

```
src/app/
├─ (common)/                # shared across tenants
│  ├─ myplan/page.tsx
│  └─ findcare/page.tsx
└─ [group]/                 # dynamic tenant
   ├─ layout.tsx            # reads useParams().group
   ├─ page.tsx              # group dashboard
   ├─ myplan/page.tsx       # override if needed
   └─ findcare/page.tsx     # override if needed
```

- **Middleware** rewrites `/member/*` → `/[group]/*` internally, preserving public URLs.
- **useParams().group** for runtime branching, defaulting to `"member"`.

---

## 5️⃣ Metadata-Driven Breadcrumbs

```ts
// app/myplan/benefits/page.tsx
export const metadata = {
  title: 'Benefits & Coverage',
  breadcrumb: {
    label: 'Benefits & Coverage',
    parent: '/myplan',
  },
};
```

Or use a util:

```ts
// src/lib/breadcrumbs.ts
import { routes } from './routes';

export function getBreadcrumbs(path: string) {
  const crumbs = [];
  let current = path;
  while (current) {
    const meta = routes.find((r) => r.pattern!.test(current));
    if (!meta) break;
    crumbs.unshift({ label: meta.name, path: meta.path });
    // find parent via metadata or manual map...
    current = meta.parent || '';
  }
  return crumbs;
}
```

---

## 6️⃣ Middleware & Tenant Rewrite

```ts
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next'))
    return NextResponse.next();

  const token = req.cookies.get('auth-token')?.value;
  let group = 'member';
  if (token) {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );
    const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (aud.includes('bcbst:bluecare')) group = 'bluecare';
    else if (aud.includes('bcbst:amplify')) group = 'amplify';
    else if (aud.includes('bcbst:provider')) group = 'provider';
  }
  if (url.pathname.startsWith('/member')) {
    url.pathname = `/${group}${url.pathname.slice(7)}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next|favicon.ico).*)'] };
```

---

## 7️⃣ Folder Structure & Layout Conventions

```
src/app/
├─ layout.tsx              # Root layout with GroupProvider
├─ (common)/               # Shared pages
├─ [group]/                # Tenant dynamic routes
├─ planselect/             # UI-only pages
│  ├─ active/page.tsx
│  └─ termed/page.tsx
├─ error/page.tsx
└─ maintenance/page.tsx
```

- Use `loading.tsx` and `error.tsx` in each folder for UX.
- Place shared UI in `src/app/layout.tsx` and tenant overrides in `app/[group]/layout.tsx`.

---

## 8️⃣ Not-Found & Fallback Handling

- Add `not-found.tsx` in each dynamic folder.
- Use `generateStaticParams()` for finite dynamic segments, e.g., health programs.

---

## 9️⃣ Testing Strategy & Test Matrix

| Path                               | Expectation                                 | Test File                     |
| ---------------------------------- | ------------------------------------------- | ----------------------------- |
| src/lib/routes.ts                  | Contains all routes from JSON map           | tests/routes.registry.spec.ts |
| src/middleware.ts                  | Correctly rewrites `/member/*` per audience | tests/middleware.spec.ts      |
| app/planselect/active/page.tsx     | Renders without error                       | tests/planselect.spec.ts      |
| Breadcrumb util (`getBreadcrumbs`) | Returns correct trail                       | tests/breadcrumbs.spec.ts     |
| Dynamic layout `app/[group]`       | Renders fallback 'member' group             | tests/grouplayout.spec.ts     |

---

## 🔟 Phased Work Plan

| Phase   | Items (points)                                                                                                             |
| ------- | -------------------------------------------------------------------------------------------------------------------------- |
| **P0**  | 1. App Router API standardization (3)<br>2. Central `routes.ts` (5)<br>3. Not-found pages (2)<br>4. Middleware rewrite (5) |
| **P1**  | 5. Dynamic `[group]` scaffolding (5)<br>6. Breadcrumbs (3)<br>7. Header/Footer refactor (3)<br>8. JWT guard (4)            |
| **P2+** | Coverage gap pages (5)<br>Cache & ISR (3)<br>CI validation (3)<br>Docs & onboarding (2)                                    |

---

## 📝 Open Questions / TODO

- [ ] Confirm caching strategy per tenant page (`revalidate` vs `cache-control`).
- [ ] Finish scaffolding inbox/sharing pages.
- [ ] Validate NextAuth error callbacks and session flows.
- [ ] Add E2E tests for critical user flows (login, group routing).
