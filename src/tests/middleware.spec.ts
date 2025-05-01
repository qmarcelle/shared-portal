import { jwtVerify } from 'jose';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../middleware';

// Mock Next.js and jose modules
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => 'next-response'),
    redirect: jest.fn((url) => ({ url })),
    rewrite: jest.fn((url) => ({ type: 'rewrite', url })),
  },
}));

jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
}));

describe('Middleware', () => {
  let mockRequest: jest.Mocked<NextRequest>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock NextRequest
    mockRequest = {
      nextUrl: {
        pathname: '',
        clone: jest.fn().mockReturnThis(),
        searchParams: new URLSearchParams(),
      },
      cookies: {
        get: jest.fn(),
      },
      url: 'https://example.com',
    } as unknown as jest.Mocked<NextRequest>;

    // Default implementation for jwtVerify
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: 'default-audience' },
    });
  });

  it('should not rewrite paths that start with /api', async () => {
    mockRequest.nextUrl.pathname = '/api/some-endpoint';

    await middleware(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.rewrite).not.toHaveBeenCalled();
  });

  it('should not rewrite paths that start with /_next', async () => {
    mockRequest.nextUrl.pathname = '/_next/static/chunks/main.js';

    await middleware(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.rewrite).not.toHaveBeenCalled();
  });

  it('should rewrite /member paths to /{group} for authenticated users with default group', async () => {
    mockRequest.nextUrl.pathname = '/member/dashboard';
    (mockRequest.cookies.get as jest.Mock).mockReturnValue({
      value: 'mock-token',
    } as RequestCookie);

    await middleware(mockRequest);

    expect(mockRequest.nextUrl.pathname).toBe('/member/dashboard');
    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/member/dashboard',
      }),
    );
  });

  it('should rewrite /member paths to /bluecare for users with bluecare audience', async () => {
    mockRequest.nextUrl.pathname = '/member/dashboard';
    (mockRequest.cookies.get as jest.Mock).mockReturnValue({
      value: 'mock-token',
    } as RequestCookie);

    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: 'bcbst:bluecare' },
    });

    await middleware(mockRequest);

    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/bluecare/dashboard',
      }),
    );
  });

  it('should rewrite /member paths to /amplify for users with amplify audience', async () => {
    mockRequest.nextUrl.pathname = '/member/dashboard';
    (mockRequest.cookies.get as jest.Mock).mockReturnValue({
      value: 'mock-token',
    } as RequestCookie);

    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: 'bcbst:amplify' },
    });

    await middleware(mockRequest);

    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/amplify/dashboard',
      }),
    );
  });

  it('should rewrite /member paths to /provider for users with provider audience', async () => {
    mockRequest.nextUrl.pathname = '/member/dashboard';
    (mockRequest.cookies.get as jest.Mock).mockReturnValue({
      value: 'mock-token',
    } as RequestCookie);

    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: 'bcbst:provider' },
    });

    await middleware(mockRequest);

    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/provider/dashboard',
      }),
    );
  });

  it('should handle an array of audience values', async () => {
    mockRequest.nextUrl.pathname = '/member/dashboard';
    (mockRequest.cookies.get as jest.Mock).mockReturnValue({
      value: 'mock-token',
    } as RequestCookie);

    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: ['other-aud', 'bcbst:amplify'] },
    });

    await middleware(mockRequest);

    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/amplify/dashboard',
      }),
    );
  });

  it('should default to member group when no token is present', async () => {
    mockRequest.nextUrl.pathname = '/member/dashboard';
    (mockRequest.cookies.get as jest.Mock).mockReturnValue(undefined);

    await middleware(mockRequest);

    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/member/dashboard',
      }),
    );
  });
});
