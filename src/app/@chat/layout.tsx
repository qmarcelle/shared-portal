'use client';
import { logger } from '@/utils/logger';

// Log when layout is rendered to debug parallel route loading
logger.info('[@@chat/layout.tsx] Layout rendering', {
  timestamp: new Date().toISOString(),
});

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  logger.info('[@@chat/layout.tsx] Rendering children', {
    timestamp: new Date().toISOString(),
    hasChildren: !!children,
  });

  return <>{children}</>;
}
