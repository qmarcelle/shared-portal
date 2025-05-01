'use client';

import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';

export default function GroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Column className="w-full h-screen items-center justify-center">
      <Header type="title-1" text="Something went wrong!" />
      <Spacer size={16} />
      <p className="text-lg text-gray-600">{error.message}</p>
      <Spacer size={32} />
      <Button label="Try again" onClick={reset} />
    </Column>
  );
}