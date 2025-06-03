'use client';

import { Breadcrumb } from '@/models/app/breadcrumb';
import '@/styles/breadcrumb.css';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { rightWhiteIcon } from '../foundation/Icons';

export interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  breadcrumbs,
}: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="breadcrumb items-center body-2 ">
        <>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex items-center ml-0">
              {index === breadcrumbs.length - 1 ? (
                <span aria-current="page" className="breadcrumb-current">
                  {breadcrumb.title}
                </span>
              ) : (
                <>
                  <Link
                    className="text-primary font-bold"
                    href={breadcrumb.path}
                  >
                    {breadcrumb.title}
                  </Link>
                  <div className="px-2">
                    <Image
                      src={rightWhiteIcon}
                      alt=""
                      className="mx-1 h-4 w-4"
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
