'use client';
import { logger } from '@/utils/logger';

// Log when layout is rendered to debug parallel route loading
logger.info('[ChatLayout] Chat layout component loaded', {
  timestamp: new Date().toISOString(),
});

/**
 * Layout for the @chat parallel route
 * This is needed for Next.js to properly handle the parallel route structure
 */
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  logger.info('[ChatLayout] Rendering chat children', {
    timestamp: new Date().toISOString(),
    hasChildren: !!children,
  });

  return <>{children}</>;
}
