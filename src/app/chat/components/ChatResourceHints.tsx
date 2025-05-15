'use client';

/**
 * ChatResourceHints Component
 *
 * Adds resource hints to the document head to improve connection setup for external resources.
 * This can be included in a layout component to optimize connections before scripts are loaded.
 */

import Head from 'next/head';

export default function ChatResourceHints() {
  return (
    <Head>
      {/* jQuery CDN */}
      <link
        rel="preconnect"
        href="https://code.jquery.com"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://code.jquery.com" />

      {/* Genesys cloud resources */}
      <link
        rel="preconnect"
        href="https://apps.mypurecloud.com"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://apps.mypurecloud.com" />

      {/* CoBrowse if used */}
      <link
        rel="preconnect"
        href="https://js.cobrowse.io"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://js.cobrowse.io" />
    </Head>
  );
}
