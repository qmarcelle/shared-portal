/**
 * Chat Services Index
 *
 * This file exports all chat-related services organized by their responsibility areas:
 * - Core services (ChatService, AuthService)
 * - Feature services (BusinessHours, PlanSwitching)
 * - Integration services (Cobrowse)
 * - API services
 */

import type { ChatService } from '@/app/chat/types/index';
import { createContext } from 'react';

// Export the context
export const ChatServiceContext = createContext<ChatService | null>(null);

// Export all service implementations
export { ChatService, loadGenesysScript } from './ChatService';
