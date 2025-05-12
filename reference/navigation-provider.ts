// src/components/navigation/NavigationProvider.tsx
'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { routeConfig, hasRouteAccess, RouteConfig } from '@/lib/routing/route-config';

// Interface for route navigation item 
interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  isActive?: boolean;
  isVisible: boolean;
}

// Navigation context
interface NavigationContextType {
  mainNavigation: NavigationItem[];
  secondaryNavigation: NavigationItem[];
  userHasAccessTo: (path: string) => boolean;
  getNavigationForSection: (section: string) => NavigationItem[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Main navigation configuration
const navigationConfig: Record<string, {
  label: string;
  path: string;
  icon?: string;
  children?: Array<{
    label: string;
    path: string;
    externalUrl?: boolean;
    requiresPermission?: string[];
  }>;
}> = {
  dashboard: {
    label: 'Dashboard',
    path: '/member/home',
    icon: 'dashboard'
  },
  myPlan: {
    label: 'My Plan',
    path: '/member/myplan',
    icon: 'plan',
    children: [
      { label: 'ID Card', path: '/member/idcard' },
      { label: 'Benefits', path: '/member/myplan/benefits' },
      { label: 'Claims', path: '/member/myplan/claims' },
      { label: 'Balances', path: '/member/myplan/benefits/balances' },
      { label: 'Prior Authorizations', path: '/member/myplan/priorauthorizations' },
      { label: 'Spending Accounts', path: '/member/myplan/spendingaccounts' }
    ]
  },
  pharmacy: {
    label: 'Pharmacy',
    path: '/member/pharmacy',
    icon: 'pill'
  },
  findCare: {
    label: 'Find Care',
    path: '/member/findcare',
    icon: 'search',
    children: [
      { label: 'Virtual Care Options', path: '/member/findcare/virtualcare' },
      { label: 'Mental Health', path: '/member/findcare/mentalhealth' },
      { label: 'Primary Care', path: '/member/findcare/primarycare' },
      { label: 'Price Dental Care', path: '/member/findcare/dentalcosts' }
    ]
  },
  myHealth: {
    label: 'My Health',
    path: '/member/myhealth',
    icon: 'heart',
    children: [
      { label: 'Health Programs', path: '/member/myhealth/healthprograms' },
      { label: 'Rewards FAQ', path: '/member/myhealth/rewardsFAQ' }
    ]
  },
  support: {
    label: 'Support',
    path: '/member/support',
    icon: 'help',
    children: [
      { label: 'FAQ', path: '/member/support/FAQ' },
      { label: 'Send Email', path: '/member/support/email' }
    ]
  }
};

// Secondary navigation configuration
const secondaryNavigationConfig: Record<string, {
  label: string;
  path: string;
  icon?: string;
}> = {
  profile: {
    label: 'Profile Settings',
    path: '/member/profile',
    icon: 'user'
  },
  communication: {
    label: 'Communication Settings',
    path: '/member/profile/communication',
    icon: 'mail'
  },
  security: {
    label: 'Security',
    path: '/member/security',
    icon: 'lock'
  },
  accountSharing: {
    label: 'Account Sharing',
    path: '/member/profile/accountsharing/myinfo',
    icon: 'share'
  }
};

/**
 * Provider component for navigation with permission-based visibility
 */
export function NavigationProvider({ children, userData }: { 
  children: ReactNode;
  userData?: any; // Additional user data that might not be in the session
}) {
  const { data: session } = useSession();
  
  // Combine main navigation with access control
  const mainNavigation = useMemo(() => {
    return Object.values(navigationConfig).map(nav => {
      // Get route config for this navigation item
      const config = routeConfig[nav.path];
      
      // Check if item should be visible
      const isVisible = config ? hasRouteAccess(config, session as any, userData) : true;
      
      // Determine visibility of children
      const children = nav.children?.map(child => {
        const childConfig = routeConfig[child.path];
        const childVisible = childConfig 
          ? hasRouteAccess(childConfig, session as any, userData)
          : true;
          
        // Check if the child route is hidden based on user data
        const isHidden = typeof childConfig?.hidden === 'function'
          ? childConfig.hidden(session, userData)
          : childConfig?.hidden || false;
          
        return {
          label: child.label,
          path: child.path,
          isVisible: childVisible && !isHidden
        };
      }).filter(child => child.isVisible) || [];
      
      return {
        label: nav.label,
        path: nav.path,
        icon: nav.icon,
        children,
        isVisible: isVisible && (children.length > 0 || !nav.children?.length)
      };
    }).filter(item => item.isVisible);
  }, [session, userData]);
  
  // Combine secondary navigation with access control
  const secondaryNavigation = useMemo(() => {
    return Object.values(secondaryNavigationConfig).map(nav => {
      const config = routeConfig[nav.path];
      const isVisible = config ? hasRouteAccess(config, session as any, userData) : true;
      
      return {
        label: nav.label,
        path: nav.path,
        icon: nav.icon,
        isVisible
      };
    }).filter(item => item.isVisible);
  }, [session, userData]);
  
  // Function to check if user has access to a specific path
  const userHasAccessTo = (path: string) => {
    const config = routeConfig[path];
    if (!config) return true; // If no config, assume accessible
    return hasRouteAccess(config, session as any, userData);
  };
  
  // Function to get navigation items for a specific section
  const getNavigationForSection = (section: string) => {
    if (section === 'main') return mainNavigation;
    if (section === 'secondary') return secondaryNavigation;
    
    // Handle specific subsections
    if (section === 'myPlan') {
      const myPlanNav = mainNavigation.find(nav => nav.path === '/member/myplan');
      return myPlanNav?.children || [];
    }
    
    if (section === 'findCare') {
      const findCareNav = mainNavigation.find(nav => nav.path === '/member/findcare');
      return findCareNav?.children || [];
    }
    
    return [];
  };
  
  // Context value
  const value = {
    mainNavigation,
    secondaryNavigation,
    userHasAccessTo,
    getNavigationForSection
  };
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to use navigation context
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
