import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SSOLaunchPage from '../../../app/sso/launch/page';
import SSORedirectPage from '../../../app/sso/redirect/page';

// Mock Next.js hooks and utilities
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    entries: vi.fn(),
  }),
}));

// Mock SSO actions
vi.mock('../../../app/sso/actions/postToPing', () => ({
  default: vi.fn(() => Promise.resolve('test-ref')),
}));

vi.mock('../../../app/sso/actions/buildSSOPing', () => ({
  default: vi.fn(() => 'test-sso-url'),
  buildDropOffSSOLink: vi.fn(() => 'test-dropoff-url'),
}));

describe('SSO Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'open', {
      value: vi.fn(),
      writable: true,
    });
  });

  describe('SSO Launch Flow', () => {
    it('should handle valid launch parameters', async () => {
      const searchParams = {
        PartnerSpId: 'test-partner',
        target: 'test-target',
      };

      const page = await SSOLaunchPage({ searchParams });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/Taking you to/)).toBeInTheDocument();
      });
    });

    it('should handle missing parameters', async () => {
      const searchParams = {};

      await expect(SSOLaunchPage({ searchParams })).rejects.toThrow(
        'Missing PartnerSpId parameter',
      );
    });

    it('should handle SSO window launch', async () => {
      const searchParams = {
        PartnerSpId: 'test-partner',
        target: 'test-target',
      };

      const page = await SSOLaunchPage({ searchParams });
      render(page);

      await waitFor(() => {
        expect(window.open).toHaveBeenCalledWith('test-sso-url', '_blank');
      });
    });
  });

  describe('SSO Redirect Flow', () => {
    it('should handle valid redirect parameters', async () => {
      const searchParams = {
        connectionId: encodeURIComponent('test-connection'),
        resumePath: '/test-path',
      };

      const page = await SSORedirectPage({ searchParams });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/Processing SSO Request/)).toBeInTheDocument();
      });
    });

    it('should handle missing parameters', async () => {
      const searchParams = {};

      await expect(SSORedirectPage({ searchParams })).rejects.toThrow(
        'Missing connectionId parameter',
      );
    });

    it('should process SSO redirect correctly', async () => {
      const searchParams = {
        connectionId: encodeURIComponent('test-connection'),
        resumePath: '/test-path',
      };

      const page = await SSORedirectPage({ searchParams });
      render(page);

      await waitFor(() => {
        expect(
          screen.getByText(/Please wait while we redirect you/),
        ).toBeInTheDocument();
      });
    });
  });

  describe('SSO Error Handling', () => {
    it('should handle SSO launch errors gracefully', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const searchParams = {
        PartnerSpId: 'invalid-partner',
        target: 'test-target',
      };

      const page = await SSOLaunchPage({ searchParams });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it('should handle SSO redirect errors gracefully', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const searchParams = {
        connectionId: encodeURIComponent('invalid-connection'),
        resumePath: '/test-path',
      };

      const page = await SSORedirectPage({ searchParams });
      render(page);

      await waitFor(() => {
        expect(screen.getByText(/SSO Error/)).toBeInTheDocument();
      });
    });
  });
});
