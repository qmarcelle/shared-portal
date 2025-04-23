'use client';

import LegacyChatLoader from '@/components/LegacyChatLoader';

/**
 * Chat Test Page
 *
 * This page serves as a testing ground for the legacy Genesys chat widget integration.
 * It provides a clean environment to verify:
 * 1. Global _genesys object initialization
 * 2. Legacy chat.js script loading
 * 3. On-prem chat widget functionality
 */
export default function ChatTestPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Legacy Chat Widget Test Page</h1>
      <div className="max-w-2xl mb-8">
        <p className="mb-4">
          Testing legacy Genesys on-prem chat widget loading in Next.js App
          Router. Check the browser console for loading status and any potential
          errors.
        </p>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Expected Console Output:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>[LEGACY] Injecting chat.js script</li>
            <li>[LEGACY] chat.js loaded ✓</li>
            <li>[LEGACY] Current _genesys config: &#123;...&#125;</li>
          </ol>
        </div>
        <div className="mt-4 bg-blue-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">
            Required Environment Variables:
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>NEXT_PUBLIC_CHAT_TOKEN - Bearer token for authentication</li>
            <li>NEXT_PUBLIC_CHAT_REST - On-prem chat server REST URL</li>
          </ul>
        </div>
        <div className="mt-4 bg-red-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Common Issues:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Missing or invalid chat.js in /public directory</li>
            <li>Incorrect REST endpoint URL</li>
            <li>Invalid or missing bearer token</li>
            <li>Wrong plugin configuration</li>
          </ul>
        </div>
      </div>

      {/* Initialize the legacy chat loader */}
      <LegacyChatLoader />
    </main>
  );
}
