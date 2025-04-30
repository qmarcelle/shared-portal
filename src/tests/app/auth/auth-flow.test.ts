import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { auth } from '../../../app/auth';
import { middleware } from '../../../middleware';

// Mock auth
vi.mock('../../../app/auth', () => ({
  auth: vi.fn(),
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Middleware Protection', () => {
    it('should redirect unauthenticated users to login', async () => {
      // Mock unauthenticated session
      (auth as jest.Mock).mockResolvedValue(null);

      // Create mock request to protected route
      const request = new NextRequest(
        new URL('http://localhost:3000/dashboard'),
      );

      // Execute middleware
      const response = await middleware(request);

      // Verify redirect to login
      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(307); // Temporary redirect
      expect(response?.headers.get('Location')).toContain('/login');
    });

    it('should allow authenticated users to access protected routes', async () => {
      // Mock authenticated session
      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: '1',
          currUsr: {
            role: 'member',
          },
        },
      });

      // Create mock request to protected route
      const request = new NextRequest(
        new URL('http://localhost:3000/dashboard'),
      );

      // Execute middleware
      const response = await middleware(request);

      // Verify access granted
      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(200);
    });

    it('should handle SSO routes properly', async () => {
      // Create mock request to SSO route
      const request = new NextRequest(
        new URL('http://localhost:3000/sso/launch?PartnerSpId=test'),
      );

      // Execute middleware
      const response = await middleware(request);

      // Verify SSO handling
      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(200);
    });

    it('should redirect unauthorized role access', async () => {
      // Mock authenticated session with wrong role
      (auth as jest.Mock).mockResolvedValue({
        user: {
          id: '1',
          currUsr: {
            role: 'guest',
          },
        },
      });

      // Create mock request to role-protected route
      const request = new NextRequest(
        new URL('http://localhost:3000/personalRepresentativeAccess'),
      );

      // Execute middleware
      const response = await middleware(request);

      // Verify redirect to dashboard
      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/dashboard');
    });
  });
});
