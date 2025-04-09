'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { bcbstBlueLogo, bcbstStackedlogo } from './Icons';

export default function SiteHeaderPBEError() {
  return (
    <>
      {/* Header Top Bar */}
      <div className="h-18 w-full fixed top-0 left-0 right-0 flex justify-between border-b bg-white z-50">
        <div className="flex items-center">
          <Link className="ml-5 lg:px-0" href="/member/home">
            {useMediaQuery({ query: '(max-width: 1023px)' }) ? (
              <Image
                width="64"
                height="36"
                src={bcbstStackedlogo}
                alt="BCBST Stacked Logo"
              />
            ) : (
              <Image
                width="174"
                height="35"
                src={bcbstBlueLogo}
                alt="BCBST Logo"
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
