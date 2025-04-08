/**
 * Chat State Management
 *
 * This file exports all chat-related state management using a unified store approach
 * with feature-based slices for better organization and type safety.
 */

// Unified chat store with all slices
export {
  useChatSession,
  useChatState,
  useChatStore,
  useChatUI,
  type ChatSlice,
  type ExtendedChatState,
  type SessionSlice,
  type UISlice,
} from './chatStore';
