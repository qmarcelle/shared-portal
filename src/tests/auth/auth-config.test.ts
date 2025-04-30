import { describe, expect, it } from '@jest/globals';
import authConfig from '../../auth.config';

describe('Auth Configuration', () => {
  it('should have required NextAuth configuration', () => {
    expect(authConfig.providers).toBeDefined();
    expect(authConfig.providers.length).toBeGreaterThan(0);
  });

  it('should have session configuration', () => {
    expect(authConfig.session).toBeDefined();
    expect(authConfig.session.strategy).toBe('jwt');
  });

  it('should have JWT configuration', () => {
    expect(authConfig.jwt).toBeDefined();
    expect(authConfig.jwt.secret).toBeDefined();
  });
});

describe('Middleware Auth', () => {
  it('should protect specified routes', async () => {
    const protectedRoutes = [
      '/dashboard',
      '/myPlan',
      '/benefits',
      '/claims',
      '/findcare',
      '/chat',
      '/security',
      '/profileSettings',
      '/personalRepresentativeAccess',
    ];

    for (const route of protectedRoutes) {
      const response = await fetch(`http://localhost:3000${route}`);
      expect(response.status).toBe(302); // Should redirect to login
      expect(response.headers.get('Location')).toContain('/login');
    }
  });
});
