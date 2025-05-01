'use client';

import { ErrorCard } from '@/components/composite/ErrorCard';
import { Button } from '@/components/foundation/Button';
import { useEffect } from 'react';

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
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <ErrorCard errorText="There was a problem loading the FAQ topics." />
        <Button label="Try Again" callback={reset} className="mt-4" />
      </div>
    </div>
  );
}
