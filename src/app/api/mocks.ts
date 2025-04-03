/**
 * Mock Service Worker initialization for Next.js
 */
export async function initMocks() {
  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    if (typeof window === 'undefined') {
      // Server environment
      const { server } = await import('../../mocks/server');
      server.listen({ onUnhandledRequest: 'bypass' });
      console.info('🔶 MSW initialized on server');
    } else {
      // Browser environment
      const { worker } = await import('../../mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
          options: { scope: '/' },
        },
      });
      console.info('🔶 MSW initialized in browser');
    }
  }
}
