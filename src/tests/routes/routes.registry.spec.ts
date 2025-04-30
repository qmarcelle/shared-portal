import { describe, expect, it } from '@jest/globals';
import {
  RouteConfig,
  isPublicRoute,
  routes,
  shouldHideHeaderFooter,
} from '../../lib/routes';

describe('Route Registry', () => {
  it('should contain all required routes', () => {
    const requiredPaths = [
      '/',
      '/myplan',
      '/myplan/benefits',
      '/dashboard',
      '/claims',
      '/findcare',
      '/chat',
      '/security',
      '/profileSettings',
      '/personalRepresentativeAccess',
      '/inbox',
      '/inbox/documents',
      '/inbox/notifications',
      '/sharing',
      '/sharing/permissions',
      '/sharing/myinformation',
      '/sharing/accessothers',
      '/sharing/personalrepresentative',
      '/sharing/healthinfotransfer',
      '/sharing/thirdparty',
    ];

    requiredPaths.forEach((path) => {
      const route = routes.find((r) => r.path === path);
      expect(route).toBeDefined();
      expect(route?.pattern).toBeDefined();
    });
  });

  it('should correctly identify public routes', () => {
    expect(isPublicRoute('/')).toBe(true);
    expect(isPublicRoute('/login')).toBe(true);
    expect(isPublicRoute('/myplan')).toBe(false);
    expect(isPublicRoute('/dashboard')).toBe(false);
  });

  it('should correctly identify routes without header/footer', () => {
    expect(shouldHideHeaderFooter('/login')).toBe(true);
    expect(shouldHideHeaderFooter('/embed/security')).toBe(true);
    expect(shouldHideHeaderFooter('/dashboard')).toBe(false);
  });

  it('should have valid route configurations', () => {
    routes.forEach((route) => {
      expect(route).toMatchObject<RouteConfig>({
        path: expect.any(String),
        name: expect.any(String),
        isPublic: expect.any(Boolean),
        requiresAuth: expect.any(Boolean),
        hideHeaderFooter: expect.any(Boolean),
      });
    });
  });
});
