'use client';

import Script from 'next/script';
import { useEffect } from 'react';

/**
 * Props for the GenesysScript component
 */
interface GenesysScriptProps {
  environment?: string;
  deploymentId: string;
  userData?: Record<string, string | number>;
}

/**
 * GenesysScript component loads the Genesys Cloud Messenger widget
 * and configures it with the provided parameters.
 */
export function GenesysScript({
  environment = 'prod-usw2',
  deploymentId,
  userData = {},
}: GenesysScriptProps) {
  // Handle Genesys initialization and cleanup
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Initialize any custom data once Genesys is loaded
    const setupCustomData = () => {
      if (window.Genesys && Object.keys(userData).length > 0) {
        try {
          window.Genesys('command', 'Messenger.updateCustomAttributes', {
            customAttributes: userData
          });
        } catch (e) {
          console.error('Error updating Genesys custom attributes:', e);
        }
      }
    };

    // Check if Genesys is already loaded
    if (window.Genesys) {
      setupCustomData();
    }

    // Add listener for when Genesys messenger is ready
    const handleMessengerReady = () => {
      setupCustomData();
    };

    window.addEventListener('Genesys::Ready', handleMessengerReady);
    
    return () => {
      // Clean up when component unmounts
      window.removeEventListener('Genesys::Ready', handleMessengerReady);
      
      if (window.Genesys) {
        try {
          // Close the chat window if it's open
          window.Genesys('command', 'Messenger.close');
        } catch (e) {
          console.error('Error closing Genesys messenger:', e);
        }
      }
    };
  }, [userData]);

  return (
    <Script
      id="genesys-script"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function (g, e, n, es, ys) {
            g['_genesysJs'] = e;
            g[e] = g[e] || function () {
              (g[e].q = g[e].q || []).push(arguments)
            };
            g[e].t = 1 * new Date();
            g[e].c = es;
            ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
          })(window, 'Genesys', 'https://apps.usw2.pure.cloud/genesys-bootstrap/genesys.min.js', {
            environment: '${environment}',
            deploymentId: '${deploymentId}'
          });
        `
      }}
    />
  );
}

// Add TypeScript type definitions for the window object
declare global {
  interface Window {
    _genesysJs: string;
    Genesys?: GenesysSDK;
  }
}

// Import the types from the existing types file
import { GenesysSDK } from '../types/genesys.types';
