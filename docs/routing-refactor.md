## 7️⃣ Folder Structure & Layout Conventions

```
src/app/
├─ layout.tsx              # Root layout with GroupProvider
├─ (common)/               # Shared pages
├─ [group]/                # Tenant dynamic routes
├─ planselect/             # UI-only pages ✅
│  ├─ active/page.tsx     # Active plan selection ✅
│  └─ termed/page.tsx     # Termed plan selection ✅
├─ error/page.tsx         # Error page ✅
└─ maintenance/page.tsx   # Maintenance page ✅
```

- Use `loading.tsx` and `error.tsx` in each folder for UX.
- Place shared UI in `src/app/layout.tsx` and tenant overrides in `app/[group]/layout.tsx`.

## 🔟 Phased Work Plan

| Phase   | Items (points)                                                                                                                         |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **P0**  | 1. ✅ App Router API standardization (3)<br>2. ✅ Central `routes.ts` (5)<br>3. ✅ Not-found pages (2)<br>4. ✅ Middleware rewrite (5) |
| **P1**  | 5. Dynamic `[group]` scaffolding (5)<br>6. Breadcrumbs (3)<br>7. Header/Footer refactor (3)<br>8. JWT guard (4)                        |
| **P2+** | Coverage gap pages (5)<br>Cache & ISR (3)<br>CI validation (3)<br>Docs & onboarding (2)                                                |
