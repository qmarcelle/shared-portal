'use client';

import { useEffect } from 'react';

/**
 * Error component for thirdPartySharing/components/journeys
 * Handles errors that occur during page rendering
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Something went wrong!</h1>
        <p className="mb-4 text-gray-600">{error.message}</p>
        <button
          onClick={() => reset()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}