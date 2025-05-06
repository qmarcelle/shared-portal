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
    
    // Common protected routes need basic checks
    if (request.nextUrl.pathname.includes('/(protected)/(common)/')) {
      // Check for minimum required rules (active user)
      if (!visibilityRules.active) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
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
    
    // Feature-specific checks - based on route patterns
    
    // Pharmacy
    if (request.nextUrl.pathname.includes('/pharmacy')) {
      if (!visibilityRules.pharmacy || !visibilityRules.showPharmacyTab) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
    
    // Mental Health
    if (request.nextUrl.pathname.includes('/mentalhealth')) {
      if (!visibilityRules.mentalHealthSupport) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
    
    // Teladoc
    if (request.nextUrl.pathname.includes('/teladoc')) {
      if (!visibilityRules.teladocEligible) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
    
    // Hinge Health
    if (request.nextUrl.pathname.includes('/hingehealth')) {
      if (!visibilityRules.hingeHealthEligible) {
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