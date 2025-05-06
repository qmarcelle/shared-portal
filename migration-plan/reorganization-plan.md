# Reorganization Plan Using MCP Approach

## 1. Overview

We'll use our MCP (Multi-Channel Processing) approach to reorganize the project into the requested structure. This ensures systematic migration with proper categorization based on visibility rules.

## 2. Directory Structure Analysis

### Current Structure:
- `/src/app/(common)/` - Common routes
- `/src/app/(public)/` - Public routes 
- `/src/app/(protected)/` - Protected routes
- `/src/app/(system)/` - System routes
- Various standalone routes in `/src/app/`

### Target Structure:
```
src/
└─ app/
   ├─ (public)/              # No visibility checks required
   │  └─ ...                 
   │
   ├─ (protected)/
   │  ├─ (common)/           # Default member experience
   │  │  └─ member/          # All member routes
   │  │     └─ ...           # Organized by domain
   │  │
   │  ├─ bluecare/           # LOB-specific overrides
   │  ├─ amplify/  
   │  └─ quantum/  
   │
   ├─ (system)/              # System routes
   │  └─ ...
   │
   └─ middleware.ts          # Visibility rule checks
```

## 3. Migration Categories Based on Visibility Analysis

1. **Routes with Visibility Logic** (9 routes):
   - Routes using visibility rules/helpers
   - Move to `/src/app/(protected)/(common)/member/`
   - Examples: `/dashboard`, `/findcare`, `/myplan/benefits`

2. **Routes without Visibility Logic** (67 routes):
   - Public routes or routes that don't need visibility checks
   - Move to `/src/app/(public)/` or evaluate if they need protection
   - Examples: `/login`, `/error`, `/maintenance`

3. **LOB-Specific Routes**:
   - Routes that have LOB-specific implementations
   - Move to appropriate `/src/app/(protected)/[lob]/member/` folder
   - Examples: BlueCard, Amplify, Quantum variants

4. **System Routes**:
   - Authentication, error handling, plan selection
   - Move to `/src/app/(system)/`
   - Examples: `/planselect`, `/error`, `/maintenance`

## 4. Step-by-Step Migration Process

### Phase 1: Preparation
1. Create complete directory structure for new organization
2. Identify patterns for determining route relocation
3. Create file mapping table (source → destination)

### Phase 2: Route Migration
1. Move public routes first (routes without visibility logic)
2. Move protected routes with proper categorization
3. Move LOB-specific routes with careful validation
4. Move system routes

### Phase 3: Component Updates
1. Update import paths in components
2. Fix any references to moved components
3. Adjust layouts as needed

### Phase 4: Visibility Rule Implementation
1. Create middleware.ts with visibility rule checks
2. Implement proper redirects based on rule evaluation
3. Set up appropriate error handling

### Phase 5: Testing
1. Test each route category (public, protected, LOB-specific, system)
2. Verify visibility rules work correctly
3. Confirm LOB-specific overrides function properly

## 5. Migration Tables

### System Routes:
| Current Path | New Path |
|-------------|----------|
| `/app/planselect/active` | `/app/(system)/planselect/active` |
| `/app/planselect/termed` | `/app/(system)/planselect/termed` |
| `/app/maintenance` | `/app/(system)/maintenance` |
| `/app/error` | `/app/(system)/error` |

### Public Routes (Sample):
| Current Path | New Path |
|-------------|----------|
| `/app/login` | `/app/(public)/login` |
| `/app/error` | `/app/(public)/error` |
| `/app/1095BFormRequest` | `/app/(public)/1095BFormRequest` |

### Protected Common Routes (Sample):
| Current Path | New Path |
|-------------|----------|
| `/app/(common)/dashboard` | `/app/(protected)/(common)/member/dashboard` |
| `/app/(common)/myplan` | `/app/(protected)/(common)/member/myplan` |
| `/app/(common)/myhealth` | `/app/(protected)/(common)/member/myhealth` |

### LOB-Specific Routes:
| Current Path | New Path |
|-------------|----------|
| `/app/[group]/dashboard` | `/app/(protected)/bluecare/member/dashboard` |
| `/app/[group]/support` | `/app/(protected)/amplify/member/support` |

## 6. Middleware Implementation

```typescript
// src/app/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getVisibilityRules } from '@/actions/getVisibilityRules'

export async function middleware(request: NextRequest) {
  // Get visibility rules from session
  const visibilityRules = await getVisibilityRules()
  
  // Route patterns that need protection
  const protectedRoutes = /^\/\(protected\)\/.*/
  
  // Check if route is protected
  if (protectedRoutes.test(request.nextUrl.pathname)) {
    // No visibility rules found - redirect to login
    if (!visibilityRules) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // LOB-specific checks
    if (request.nextUrl.pathname.includes('/(protected)/bluecare/')) {
      if (!visibilityRules.blueCare) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
    
    // Amplify-specific checks
    if (request.nextUrl.pathname.includes('/(protected)/amplify/')) {
      if (!visibilityRules.amplifyMember) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
    
    // Quantum-specific checks
    if (request.nextUrl.pathname.includes('/(protected)/quantum/')) {
      if (!visibilityRules.isCondensedExperience) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|api|favicon.ico).*)',
  ],
}
```

## 7. Execution Plan

1. Create directories with MCP filesystem tools
2. Move files systematically using MCP approach
3. Update imports and references
4. Implement middleware
5. Test and validate