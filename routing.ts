// // src/lib/routing/route-config.ts

// import { Session } from 'next-auth';

// /**
//  * Permission types used in route configuration
//  */
// export type Permission = 
//   | 'VIEW_CLAIMS'
//   | 'VIEW_BENEFITS'
//   | 'VIEW_PHARMACY'
//   | 'VIEW_ID_CARD'
//   | 'MANAGE_ACCOUNT'
//   | 'ACCESS_HEALTH_PROGRAMS'
//   | 'VIEW_PRIOR_AUTH'
//   | 'ADMIN_ACCESS'
//   | 'SPENDING_ACCOUNTS'
//   | 'VIEW_DENTAL'
//   | 'MANAGE_PROFILES';

// /**
//  * Line of business identifiers
//  */
// export type LineOfBusiness = 
//   | 'COMMERCIAL'
//   | 'MEDICARE'
//   | 'MEDICAID'
//   | 'EXCHANGE'
//   | 'BLUECARE'
//   | 'COVER_TENNESSEE';

// /**
//  * Route configuration object interface
//  */
// export interface RouteConfig {
//   /** Internal path in Next.js App Router structure */
//   internalPath: string;
  
//   /** Permissions required to access this route (user needs all listed permissions) */
//   requiredPermissions?: Permission[];
  
//   /** Alternative permission sets (user needs all permissions from any one set) */
//   permissionSets?: Permission[][];
  
//   /** Allows access only to certain lines of business */
//   allowedLineOfBusiness?: LineOfBusiness[];
  
//   /** Path to redirect if user doesn't have required permissions */
//   unauthorizedFallback?: string;
  
//   /** Whether this route is publicly accessible without authentication */
//   public?: boolean;
  
//   /** Whether users with preview flag can see this feature */
//   preview?: boolean;
  
//   /** Variant paths based on user attributes */
//   variants?: {
//     condition: (session: Session | null, userData?: any) => boolean;
//     path: string;
//   }[];

//   /** Whether this path should be hidden from navigation for certain users */
//   hidden?: boolean | ((session: Session | null, userData?: any) => boolean);
  
//   /** If the route is deprecated and should be tracked for usage */
//   deprecated?: boolean;
// }

// /**
//  * Complete routing configuration that maps external URLs to internal paths with permissions
//  */
// export const routeConfig: Record<string, RouteConfig> = {
//   // Dashboard
//   '/member/home': {
//     internalPath: '/dashboard',
//     public: false
//   },
  
//   // My Plan section
//   '/member/myplan': {
//     internalPath: '/myPlan',
//     requiredPermissions: ['VIEW_BENEFITS']
//   },
//   '/member/idcard': {
//     internalPath: '/memberIDCard',
//     requiredPermissions: ['VIEW_ID_CARD'],
//     variants: [
//       {
//         // For BlueCare members, show a different ID card page
//         condition: (session, userData) => userData?.lineOfBusiness === 'BLUECARE',
//         path: '/memberIDCard/bluecare'
//       }
//     ]
//   },
//   '/member/myplan/benefits': {
//     internalPath: '/benefits',
//     requiredPermissions: ['VIEW_BENEFITS'],
//     variants: [
//       {
//         // For Medicare members, show a different benefits page
//         condition: (session, userData) => userData?.lineOfBusiness === 'MEDICARE',
//         path: '/benefits/medicare'
//       }
//     ]
//   },
//   '/member/myplan/benefits/documents': {
//     internalPath: '/benefits/planDocuments',
//     requiredPermissions: ['VIEW_BENEFITS']
//   },
//   '/member/myplan/otherinsurance': {
//     internalPath: '/reportOtherHealthInsurance',
//     requiredPermissions: ['VIEW_BENEFITS', 'MANAGE_ACCOUNT'],
//     unauthorizedFallback: '/dashboard'
//   },
//   '/member/myplan/benefits/identityprotection': {
//     internalPath: '/benefits/identityProtectionServices',
//     requiredPermissions: ['VIEW_BENEFITS'],
//     allowedLineOfBusiness: ['COMMERCIAL', 'EXCHANGE'],
//     unauthorizedFallback: '/benefits'
//   },
//   '/member/myplan/enroll': {
//     internalPath: '/login',
//     public: true
//   },
//   '/member/myplan/benefits/balances': {
//     internalPath: '/benefits/balances',
//     requiredPermissions: ['VIEW_BENEFITS'],
//     variants: [
//       {
//         // For spending account enabled members
//         condition: (session, userData) => userData?.hasSpendingAccounts === true,
//         path: '/benefits/balances/withAccounts'
//       }
//     ]
//   },
//   '/member/myplan/claims': {
//     internalPath: '/claims',
//     requiredPermissions: ['VIEW_CLAIMS'],
//     unauthorizedFallback: '/dashboard'
//   },
//   '/member/myplan/spendingsummary': {
//     internalPath: '/spendingSummary',
//     requiredPermissions: ['VIEW_CLAIMS'],
//     unauthorizedFallback: '/dashboard'
//   },
//   '/member/myplan/priorauthorizations': {
//     internalPath: '/priorAuthorization',
//     requiredPermissions: ['VIEW_PRIOR_AUTH'],
//     unauthorizedFallback: '/dashboard',
//     hidden: (session, userData) => !userData?.hasPriorAuth
//   },
//   '/member/myplan/spendingaccounts': {
//     internalPath: '/spendingAccounts',
//     requiredPermissions: ['SPENDING_ACCOUNTS'],
//     unauthorizedFallback: '/dashboard',
//     // Only visible for users with spending accounts
//     hidden: (session, userData) => !userData?.hasSpendingAccounts
//   },
  
//   // Pharmacy section
//   '/member/pharmacy': {
//     internalPath: '/pharmacy',
//     requiredPermissions: ['VIEW_PHARMACY'],
//     unauthorizedFallback: '/dashboard',
//     // Hide for users without pharmacy benefits
//     hidden: (session, userData) => !userData?.hasPharmacyBenefit
//   },
//   '/member/pharmacy/documents': {
//     internalPath: '/pharmacy',
//     requiredPermissions: ['VIEW_PHARMACY'],
//     unauthorizedFallback: '/dashboard'
//   },
  
//   // Support section
//   '/member/support': {
//     internalPath: '/support',
//     public: false
//   },
//   '/member/support/email': {
//     internalPath: '/support/sendAnEmail',
//     public: false
//   },
//   '/member/support/FAQ': {
//     internalPath: '/support/faq',
//     public: false
//   },
//   '/member/support/FAQ/benefits': {
//     internalPath: '/support/faqTopics',
//     public: false
//   },
  
//   // Find Care section
//   '/member/findcare': {
//     internalPath: '/findcare',
//     public: false,
//     variants: [
//       {
//         // For Medicare members
//         condition: (session, userData) => userData?.lineOfBusiness === 'MEDICARE',
//         path: '/findcare/medicare'
//       },
//       {
//         // For BlueCare members
//         condition: (session, userData) => userData?.lineOfBusiness === 'BLUECARE',
//         path: '/findcare/bluecare'
//       }
//     ]
//   },
//   '/member/findcare/mentalhealth': {
//     internalPath: '/mentalHealthOptions',
//     public: false
//   },
  
//   // Health programs
//   '/member/myhealth/healthprograms': {
//     internalPath: '/myHealth/healthProgramsResources',
//     requiredPermissions: ['ACCESS_HEALTH_PROGRAMS'],
//     unauthorizedFallback: '/myHealth',
//     // Hide for users without eligible health programs
//     hidden: (session, userData) => userData?.eligibleHealthPrograms?.length === 0
//   },
  
//   // And so on for all other routes...
// };

// /**
//  * Pattern-based route configurations for dynamic routes
//  */
// export const patternRouteConfigs: Array<{
//   pattern: RegExp;
//   getConfig: (matches: RegExpMatchArray, userData?: any) => RouteConfig;
// }> = [
//   // Claims detail pattern
//   {
//     pattern: /^\/member\/myplan\/claims\/detail(?:\/(.+))?$/,
//     getConfig: (matches) => ({
//       internalPath: `/claims/${matches[1] || ''}`,
//       requiredPermissions: ['VIEW_CLAIMS'],
//       unauthorizedFallback: '/dashboard'
//     })
//   },
  
//   // Prior authorization details pattern
//   {
//     pattern: /^\/member\/myplan\/priorauthorizations\/details(?:\/(.+))?$/,
//     getConfig: (matches) => ({
//       internalPath: `/authDetail/${matches[1] || ''}`,
//       requiredPermissions: ['VIEW_PRIOR_AUTH'],
//       unauthorizedFallback: '/dashboard'
//     })
//   },
  
//   // General benefits pages pattern
//   {
//     pattern: /^\/member\/myplan\/benefits\/(.+)$/,
//     getConfig: (matches, userData) => {
//       const benefitType = matches[1];
      
//       // Special handling for dental benefits
//       if (benefitType.startsWith('dental')) {
//         return {
//           internalPath: `/benefits/details?type=${benefitType}`,
//           requiredPermissions: ['VIEW_BENEFITS', 'VIEW_DENTAL'],
//           unauthorizedFallback: '/benefits',
//           // Only show for users with dental benefits
//           hidden: !userData?.hasDentalBenefit
//         };
//       }
      
//       return {
//         internalPath: `/benefits/details?type=${benefitType}`,
//         requiredPermissions: ['VIEW_BENEFITS'],
//         unauthorizedFallback: '/benefits'
//       };
//     }
//   },
  
//   // Health programs pattern
//   {
//     pattern: /^\/member\/myhealth\/healthprograms\/(.+)$/,
//     getConfig: (matches, userData) => {
//       const programType = matches[1];
//       return {
//         internalPath: `/myHealth/healthProgramsResources/myHealthPrograms?program=${programType}`,
//         requiredPermissions: ['ACCESS_HEALTH_PROGRAMS'],
//         unauthorizedFallback: '/myHealth',
//         // Only show if user is eligible for this specific program
//         hidden: !userData?.eligibleHealthPrograms?.includes(programType)
//       };
//     }
//   }
// ];

// /**
//  * Gets route configuration for a specific path
//  * @param path The external path to get configuration for
//  * @param userData Optional user data for conditional logic
//  * @returns The route configuration or null if not found
//  */
// export function getRouteConfig(path: string, userData?: any): RouteConfig | null {
//   // Check for exact match in route config
//   if (routeConfig[path]) {
//     return routeConfig[path];
//   }
  
//   // Check pattern-based routes
//   for (const patternConfig of patternRouteConfigs) {
//     const matches = path.match(patternConfig.pattern);
//     if (matches) {
//       return patternConfig.getConfig(matches, userData);
//     }
//   }
  
//   return null;
// }

// /**
//  * Checks if a user has access to a specific route
//  * @param routeConfig The route configuration to check
//  * @param session The user's session
//  * @param userData Additional user data
//  * @returns Whether the user has access to the route
//  */
// export function hasRouteAccess(
//   routeConfig: RouteConfig,
//   session: Session | null,
//   userData?: any
// ): boolean {
//   // Public routes are accessible to everyone
//   if (routeConfig.public) {
//     return true;
//   }
  
//   // If no session, user is not authenticated
//   if (!session) {
//     return false;
//   }
  
//   // Preview feature check
//   if (routeConfig.preview && !userData?.hasPreviewAccess) {
//     return false;
//   }
  
//   // Check line of business restriction
//   if (routeConfig.allowedLineOfBusiness && 
//       userData?.lineOfBusiness &&
//       !routeConfig.allowedLineOfBusiness.includes(userData.lineOfBusiness)) {
//     return false;
//   }
  
//   // Check required permissions
//   if (routeConfig.requiredPermissions?.length) {
//     // Check if user has all required permissions
//     const hasAllPermissions = routeConfig.requiredPermissions.every(
//       permission => userData?.permissions?.includes(permission)
//     );
    
//     if (!hasAllPermissions) {
//       // Check alternative permission sets if available
//       if (routeConfig.permissionSets?.length) {
//         const meetsAnyPermissionSet = routeConfig.permissionSets.some(
//           permissionSet => permissionSet.every(
//             permission => userData?.permissions?.includes(permission)
//           )
//         );
        
//         if (!meetsAnyPermissionSet) {
//           return false;
//         }
//       } else {
//         return false;
//       }
//     }
//   }
  
//   return true;
// }

// /**
//  * Gets the appropriate path for a user based on route config
//  * @param routeConfig The route configuration
//  * @param session The user's session
//  * @param userData Additional user data
//  * @returns The appropriate path for the user
//  */
// export function getAppropriatePathForUser(
//   routeConfig: RouteConfig,
//   session: Session | null,
//   userData?: any
// ): string {
//   // Check if user has access
//   if (!hasRouteAccess(routeConfig, session, userData)) {
//     return routeConfig.unauthorizedFallback || '/dashboard';
//   }
  
//   // Check for variants
//   if (routeConfig.variants?.length) {
//     for (const variant of routeConfig.variants) {
//       if (variant.condition(session, userData)) {
//         return variant.path;
//       }
//     }
//   }
  
//   // Default to internal path
//   return routeConfig.internalPath;
// }