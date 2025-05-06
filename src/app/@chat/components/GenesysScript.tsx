'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Add this at the top or after imports:
declare global {
  interface Window {
    Genesys?: any;
  }
}

/**
 * Props for the GenesysScript component
 */
interface GenesysScriptProps {
  environment?: string;
  deploymentId: string;
  orgId?: string;
  userData?: Record<string, string | number>;
}

/**
 * GenesysScript component loads the Genesys Cloud Messenger widget
 * and configures it with the provided parameters.
 */
export function GenesysScript({
  environment = process.env.NEXT_PUBLIC_GENESYS_REGION!,
  deploymentId = process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!,
  orgId = process.env.NEXT_PUBLIC_GENESYS_ORG_ID!,
  userData = {},
}: GenesysScriptProps) {
  // Handle Genesys initialization and cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const setupCustomData = () => {
      if (window.Genesys && Object.keys(userData).length > 0) {
        try {
          window.Genesys('command', 'Messenger.updateCustomAttributes', {
            customAttributes: userData,
          });
          console.log('Genesys custom attributes pushed:', userData);
        } catch (e) {
          console.error('Error updating Genesys custom attributes:', e);
        }
      }
    };
    if (window.Genesys) {
      setupCustomData();
    }
    const handleMessengerReady = () => {
      setupCustomData();
    };
    window.addEventListener('Genesys::Ready', handleMessengerReady);
    return () => {
      window.removeEventListener('Genesys::Ready', handleMessengerReady);
      if (window.Genesys) {
        try {
          window.Genesys('command', 'Messenger.close');
        } catch (e) {
          console.error('Error closing Genesys messenger:', e);
        }
      }
    };
  }, [userData]);

  return (
    <Script
      id="genesys-bootstrap"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(g,e,n,es,ys){g['_genesysJs']=e;g[e]=g[e]||function(){(g[e].q=g[e].q||[]).push(arguments)};g[e].t=1*new Date();g[e].c=es;ys=document.createElement('script');ys.async=1;ys.src=n;ys.charset='utf-8';document.head.appendChild(ys);
          })(window,'Genesys','https://apps.${environment}.pure.cloud/genesys-bootstrap/genesys.min.js',{
            environment:'${environment}',
            deploymentId:'${deploymentId}',
            orgId:'${orgId}'
          });
        `,
      }}
    />
  );
}
