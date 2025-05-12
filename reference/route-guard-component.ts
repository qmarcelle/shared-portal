// src/components/routing/RouteGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getRouteConfig, hasRouteAccess } from '@/lib/routing/route-config';
import { getUserData } from '@/services/user-service'; // You'll need to implement this service

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * RouteGuard component that provides client-side route protection
 * This is a second layer of protection in addition to middleware
 */
export function RouteGuard({ children }: RouteGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Function to check if route is authorized
    async function checkRouteAccess() {
      // Skip auth check while session is loading
      if (status === 'loading') return;
      
      // Convert Next.js 14 App Router path to external path format
      // This may need customization based on your routing structure
      const externalPath = pathname.startsWith('/') 
        ? `/member${pathname}` 
        : `/member/${pathname}`;
        
      // Check if public page (like login)
      if (pathname === '/login' || pathname.startsWith('/api/auth')) {
        setAuthorized(true);
        setLoading(false);
        return;
      }
      
      // If not authenticated and not on login page, redirect to login
      if (status === 'unauthenticated') {
        setAuthorized(false);
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      
      try {
        // Get extended user data (permissions, attributes, etc.)
        const userData = session?.user ? await getUserData(session.user) : null;
        
        // Get route config for this path
        const routeConfig = getRouteConfig(externalPath, userData);
        
        // If no route config exists, allow access (you might want to change this)
        if (!routeConfig) {
          setAuthorized(true);
          setLoading(false);
          return;
        }
        
        // Check if user has access to this route
        const hasAccess = hasRouteAccess(routeConfig, session as any, userData);
        
        if (hasAccess) {
          setAuthorized(true);
        } else {
          // Redirect to unauthorized fallback or dashboard
          setAuthorized(false);
          const fallbackPath = routeConfig.unauthorizedFallback || '/dashboard';
          router.push(fallbackPath);
        }
      } catch (error) {
        console.error('Error checking route access:', error);
        // On error, redirect to dashboard for safety
        setAuthorized(false);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    
    checkRouteAccess();
    
    // Add event listener for route changes to recheck authorization
    // This is needed for client-side navigation
    const handleRouteChange = () => {
      setLoading(true);
      checkRouteAccess();
    };
    
    // Clean up the event listener (though this might be handled differently in App Router)
    return () => {
      // Cleanup if needed
    };
  }, [pathname, router, session, status]);
  
  // Show loading component or null while checking authorization
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  // If authorized, show children components
  return authorized ? <>{children}</> : null;
}

/**
 * Service function to get extended user data including permissions
 * This is just a placeholder - you'll need to implement this based on your backend
 */
// This would normally be in a separate file - src/services/user-service.ts
export async function getUserData(user: any) {
  // Make API call to get extended user data
  // This could include permissions, line of business, etc.
  try {
    const response = await fetch('/api/user/data');
    if (!response.ok) throw new Error('Failed to fetch user data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      permissions: [],
      lineOfBusiness: null
    };
  }
}
