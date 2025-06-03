# Next.js 14 Project Structure

/app
  /(public)/                   # Public routes not requiring authentication
    login/
      page.tsx
    error/
      404/page.tsx
      500/page.tsx
      403/page.tsx

  /(protected)/                # Protected routes requiring authentication
    (common)/                  # Shared routes across tenants
      member/
        dashboard/
          page.tsx
          components/
            DashboardMetrics.tsx
        findcare/
          page.tsx
        myplan/
          page.tsx

    bluecare/                  # Tenant-specific routes
      member/
        dashboard/
          page.tsx

    amplify/                   # Tenant-specific routes
      member/
        dashboard/
          page.tsx

    quantum/                   # Tenant-specific routes
      member/
        dashboard/
          page.tsx

  /api                         # API routes for Auth.js and any other APIs
    /auth/
      [...nextauth]/
        route.ts              # Auth.js API route handler

  /actions                     # Server Actions - API interface for components
    /member
      getProfile.ts
      updateProfile.ts
    /benefits
      getPlans.ts
      enrollPlan.ts
    /claims
      getClaims.ts
      submitClaim.ts
    /providers
      findProviders.ts
      getProviderDetails.ts

/components                    # Shared UI components
  /ui                          # Base UI components
    Button.tsx
    Card.tsx
    Input.tsx
  /layout
    Header.tsx
    Footer.tsx
    Sidebar.tsx
  /member
    ProfileCard.tsx
  /benefits
    PlanCard.tsx
  /forms
    ProfileForm.tsx

/lib
  /auth                        # Auth.js configuration and helpers
    auth.ts                    # Main Auth.js configuration
    session.ts                 # Session utilities
    middleware.ts              # Protected route middleware

  /clients                     # API clients to external services
    /http                      # Base HTTP client utilities
      httpClient.ts            # Fetch wrapper with auth, error handling
      apiError.ts              # API error handling

    /member                    # Member service clients
      memberClient.ts          # Client for member-related API calls
      
    /benefits                  # Benefits service clients
      benefitsClient.ts        # Client for benefits-related API calls
      
    /claims                    # Claims service clients
      claimsClient.ts          # Client for claims-related API calls

  /config                      # Application configuration
    endpoints.ts               # Service endpoint configuration by environment
    tenantConfig.ts            # Tenant-specific configuration

  /types                       # TypeScript type definitions
    member.ts                  # Member-related types 
    benefits.ts                # Benefit-related types
    claims.ts                  # Claims-related types
    api.ts                     # API response types

  /utils                       # Utility functions
    formatters.ts              # Data formatting utilities
    validation.ts              # Form validation utilities
    errorHandling.ts           # Error handling utilities

/middleware.ts                 # Root middleware (auth, tenant resolution)

/public                        # Static assets
  /images
  /fonts

/next.config.js                # Next.js configuration
/auth.config.js                # Auth.js configuration
/tsconfig.json                 # TypeScript configuration
/.env.local                    # Environment variables (local)
/.env.development              # Development environment variables
/.env.production               # Production environment variables