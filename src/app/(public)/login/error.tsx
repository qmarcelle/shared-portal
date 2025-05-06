'use client';

import { Column } from '@/components/foundation/Column';
import { bcbstBlueLogo } from '@/components/foundation/Icons';
import Image from 'next/image';
import { useEffect } from 'react';

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <header>
        <Column>
          <div className="flow-root">
            <a className="float-left" href="https://www.bcbst.com">
              <Image
                src={bcbstBlueLogo}
                id="logo"
                alt="Blue Cross Blue Shield of Tennessee"
              ></Image>
            </a>
          </div>
        </Column>
      </header>
      <section>
        <div id="blueback">
          <div id="marginSection">
            <h2 className="text-xl font-semibold mb-4">
              Something went wrong!
            </h2>
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
