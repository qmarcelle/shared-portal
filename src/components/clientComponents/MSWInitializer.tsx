'use client';

import { useEffect } from 'react';

/**
 * Client component that initializes MSW for development environments
 * This allows us to mock API requests in the browser
 */
export default function MSWInitializer() {
  useEffect(() => {
    // Only load MSW in development environment
    if (process.env.NODE_ENV === 'development') {
      import('../../mocks/browser')
        .then(({ initMSW }) => {
          initMSW();
        })
        .catch((error) => {
          console.error('Error initializing MSW:', error);
        });
    }
  }, []);

  // This component doesn't render anything
  return null;
}
