'use client';
import { logger } from '@/utils/logger';

// Log when default is rendered to debug fallback cases
logger.info('[@@chat/default.tsx] Default component loaded', {
  timestamp: new Date().toISOString(),
});

// This file prevents NEXT_NOT_FOUND errors for unmatched @chat slot routes.
export default function ChatDefault() {
  logger.info('[@@chat/default.tsx] Rendering default component', {
    timestamp: new Date().toISOString(),
  });

  // You can return null, a placeholder, or a minimal chat UI if desired.
  return null;
}
