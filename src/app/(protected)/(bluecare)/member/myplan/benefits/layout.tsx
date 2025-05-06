import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Benefits & Coverage',
    default: 'Benefits & Coverage',
  },
  description: 'View and manage your benefits and coverage information',
};

/**
 * Layout for the Benefits section
 * This wraps all pages under /myplan/benefits
 */
export default function BenefitsLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="benefits-layout">
      {/* Any benefits-specific layout elements can go here */}
      <main>{children}</main>
    </div>
  );
}