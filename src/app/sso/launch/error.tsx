'use client';

import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { leftIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SSOLaunchError({
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

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className="flex flex-col items-center page">
      <Column className="app-content app-base-font-color">
        <Link tabIndex={1} onClick={handleGoBack} href="#">
          <Image src={leftIcon} alt="back" className="inline" />
          <TextBox
            text="Go Back"
            display="inline"
            className="primary-color underline pt-1 inline"
          />
        </Link>
        <Spacer size={32} />
        <Title className="title-1" text="Sorry, something went wrong." />
        <Spacer size={16} />
        <TextBox text="There was a problem with the SSO launch. Please try again or contact support if the problem persists." />
        <Spacer size={16} />
        <AppLink
          label="Try Again"
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        />
      </Column>
    </main>
  );
}
