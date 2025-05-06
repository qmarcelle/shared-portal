'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SSORedirectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">SSO Error</h1>
        <p className="text-gray-600 mb-8">
          There was a problem processing your SSO request. Please try again or
          contact support if the problem persists.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Return to Dashboard
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
