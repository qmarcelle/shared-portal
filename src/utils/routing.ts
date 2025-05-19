import { rewriteRules } from '@/lib/rewrites';
import { Breadcrumb } from '@/models/app/breadcrumb';
import { RouteConfig } from '@/models/auth/route_auth_config';
import { SessionUser } from '@/userManagement/models/sessionUser';
import { Session } from 'next-auth';
import 'server-only';
import { logger } from './logger';
import { ROUTE_CONFIG, ROUTING_ENGINE_EXEMPT } from './routes';

export function getRouteConfigData(path: string): RouteConfig | null {
  if (path == '' || path == '/') return ROUTE_CONFIG;
  const pathComponents: string[] = pathToComponents(path);
  const config = pathComponents.reduce(
    (acc: RouteConfig | null, key: string) => {
      return acc && acc.children
        ? acc.children[key] || acc.children['*'] //Use 'wildcard' key for [slug] child pages
        : null;
    },
    ROUTE_CONFIG,
  );
  if (!config) {
    logger.warn(`Path ${path} is missing routing config data!`);
    return null;
  }
  return config;
}

/**
 * Generates the breadcrumb trail for a page based on route info.
 * @param path The relative pathname of the current page i.e. /benefits/balances.
 * @param dynamicTitle If the current page's breadcrumb has a dynamic title i.e. 'Claim #12345' pass it here.
 * @returns An array of Breadcrumb objects in hierarchial order (highest first.)
 */
export function getBreadcrumbs(
  path: string,
  dynamicText?: string,
): Breadcrumb[] {
  const routeInfo = getRouteConfigData(path);
  if (!routeInfo || !routeInfo.title) return [];
  const breadcrumbs = [
    ...getParentBreadcrumbs(path, routeInfo),
    {
      title: getBreadcrumbTitle(routeInfo, dynamicText),
      path: getBreadcrumbPath(routeInfo, path),
      current: true,
    },
  ];
  return breadcrumbs;
}

function getParentBreadcrumbs(
  path: string,
  routeInfo: RouteConfig,
): Breadcrumb[] {
  if (path == '' || path == '/') return [];
  const parentPath =
    routeInfo.breadcrumbParent || path.substring(0, path.lastIndexOf('/'));
  const parentRouteInfo = getRouteConfigData(parentPath);
  if (parentPath == '' || parentPath == '/' || !parentRouteInfo) return [];
  return [
    ...getParentBreadcrumbs(parentPath, parentRouteInfo),
    ...(parentRouteInfo.title
      ? [
          {
            title: getBreadcrumbTitle(parentRouteInfo),
            path: getBreadcrumbPath(parentRouteInfo, parentPath),
            current: false,
          },
        ]
      : []),
  ];
}

function getBreadcrumbTitle(route: RouteConfig, text?: string): string {
  if (typeof route.title == 'string') {
    return route.title;
  } else if (typeof route.title == 'function') {
    return route.title(text || '');
  } else {
    return '';
  }
}

function getBreadcrumbPath(route: RouteConfig, path: string): string {
  if (route.pathAlias) return route.pathAlias;
  const mapping = Object.entries(rewriteRules).find(
    ([url, alias]) => alias == path, //eslint-disable-line
  );
  return mapping ? mapping[0] : path;
}

/**
 * Check whether the specified URL path can be accessed by the current user/session.
 * @param path The request path
 * @param session The NextAuth session, or undefined if not logged in
 * @returns Null if the user has access and can proceed; otherwise, returns a relative redirect path.
 */
export function getRoutingRedirect(
  path: string,
  session: Session | null,
): string | null {
  if (ROUTING_ENGINE_EXEMPT.includes(path)) return null;
  const isLoggedIn = !!session?.user;
  const routeConfig = getRouteConfigData(path);
  if (!routeConfig) return '/dashboard';
  if (!isLoggedIn) {
    if (routeConfig.inboundDestination) {
      return null;
    } else if (!routeConfig.public && !routeConfig.auth) {
      logger.info('Redirecting unauthenticated user to login page');
      return '/login';
    } else {
      return null;
    }
  } else {
    if (routeConfig.inboundDestination) {
      logger.info(
        `Redirecting inbound user to ${routeConfig.inboundDestination}`,
      );
      return routeConfig.inboundDestination;
    } else if (routeConfig.auth) {
      logger.info('User is already logged in, redirecting to dashboard.');
      return process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || '/dashboard';
    } else if (!evaluateRoutingPZNRule(session.user, routeConfig)) {
      logger.info(`User ${session.user.id} does not have access to ${path}`);
      return '/dashboard';
    } else {
      logger.info(`${routeConfig.title} (${path}) authorization OK`);
      return null;
    }
  }
}

/**
 * Determines whether a logged-in user has access to the specified path based on visibility logic in routes.ts
 * @param session The NextAuth session
 * @param routeConfig The RouteConfig data for the page
 * @returns
 */
function evaluateRoutingPZNRule(
  user: SessionUser,
  routeConfig: RouteConfig,
): boolean {
  if (user.impersonated && routeConfig.noImpersonation) return false;
  if (typeof routeConfig.rule == 'boolean') {
    return routeConfig.rule;
  } else if (typeof routeConfig.rule == 'string') {
    const rules = user.vRules;
    return rules?.[routeConfig.rule] || false;
  } else if (typeof routeConfig.rule == 'function') {
    if (!user.vRules) return false;
    return routeConfig.rule(user.vRules) || false;
  } else {
    return true;
  }
}

function pathToComponents(path: string): string[] {
  const shift = path.startsWith('/');
  const components = path.split('/');
  if (shift) components.shift();
  return components;
}
