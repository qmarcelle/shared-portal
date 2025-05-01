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
    path: '/login',
    name: 'Login',
    isPublic: true,
    requiresAuth: false,
    hideHeaderFooter: true,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    isPublic: false,
    requiresAuth: true,
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
  {
    path: '/myplan/benefits/medical',
    name: 'Medical Benefits',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/myplan/benefits/pharmacy',
    name: 'Pharmacy Benefits',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/myplan/benefits/employerProvidedBenefits',
    name: 'Employer Provided Benefits',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/claims',
    name: 'Claims',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/findcare',
    name: 'Find Care',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/chat',
    name: 'Chat',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/security',
    name: 'Security Settings',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/profileSettings',
    name: 'Profile Settings',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/personalRepresentativeAccess',
    name: 'Personal Representative Access',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/inbox',
    name: 'Inbox',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/inbox/documents',
    name: 'Documents',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/inbox/notifications',
    name: 'Notifications',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/sharing',
    name: 'Sharing',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/sharing/permissions',
    name: 'Sharing Permissions',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/sharing/myinformation',
    name: 'My Information',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/sharing/accessothers',
    name: 'Access Others',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/sharing/personalrepresentative',
    name: 'Personal Representative',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/sharing/healthinfotransfer',
    name: 'Health Info Transfer',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/sharing/thirdparty',
    name: 'Third Party Sharing',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/myhealth/healthprograms/wellness-center',
    name: 'Member Wellness Center',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/myhealth/healthprograms/health-library',
    name: 'Health Library',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
  {
    path: '/myhealth/healthprograms/rewards',
    name: 'Wellness Rewards',
    isPublic: false,
    requiresAuth: true,
    hideHeaderFooter: false,
  },
];

// Compile regex patterns
routes.forEach((r) => {
  const result = pathToRegexp(r.path);
  r.pattern = result.regexp;
});

// Helper functions
export const isPublicRoute = (url: string): boolean =>
  routes.some((r) => r.isPublic && r.pattern!.test(url));

export const shouldHideHeaderFooter = (url: string): boolean =>
  routes.some((r) => r.hideHeaderFooter && r.pattern!.test(url));

export const getInboundRedirect = (url: string): string | undefined =>
  routes.find((r) => r.inboundRedirect && r.pattern!.test(url))
    ?.inboundRedirect;
