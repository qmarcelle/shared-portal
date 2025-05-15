/**
 * Chat test window extensions
 * Import types directly from the consolidated chat-types.ts file
 */

import { GenesysWindow } from '../chat/types/chat-types';

declare global {
  interface Window extends GenesysWindow {
    // Add any chat-test specific window extensions here
  }
}