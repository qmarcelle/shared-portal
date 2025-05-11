# Chat Module Documentation

## Overview

The chat module (`@chat`) provides chat functionality using Genesys Chat for both legacy and cloud implementations. This module has been refactored to improve maintainability, reduce code duplication, and follow React best practices.

## Architecture

The chat module follows a clean architecture with:

1. **Store** - Zustand store for state management
2. **Components** - UI components for chat display
3. **Hooks** - Custom hooks for shared logic
4. **Utils** - Utility functions
5. **API** - Server-side API routes for data fetching

## Key Improvements

Recent improvements to the chat module include:

1. **API Consolidation**

   - Consolidated multiple API endpoints into a single `/api/chat/getChatInfo` endpoint
   - Removed redundant endpoints: `/api/chat/isChatAvailable`, `/api/chat/isCloudChatEligible`, `/api/chat/cloudChatGroups`

2. **State Management**

   - Simplified Zustand store with proper selectors
   - Added deprecation warnings for deprecated selector access patterns
   - Improved TypeScript typing

3. **Component Structure**

   - Extracted shared logic into custom hooks
   - Created shared UI components to avoid duplication
   - Improved effect management for better performance

4. **Utilities**
   - Centralized helper functions for better maintainability
   - Added proper TypeScript declarations for global objects

## Best Practices

When working with the chat module, follow these best practices:

### State Management

```typescript
// ✅ CORRECT: Use chatSelectors for derived state
import { chatSelectors, useChatStore } from '@/app/@chat/stores/chatStore';

function MyComponent() {
  // For state that should trigger re-renders:
  const { isOpen, isMinimized } = useChatStore();

  // For derived/computed state:
  const chatMode = chatSelectors.chatMode(useChatStore());
  const isEligible = chatSelectors.isEligible(useChatStore());

  // ...
}

// ❌ DEPRECATED: Don't use static properties on useChatStore
// This will log deprecation warnings
const isEligible = useChatStore.isEligible; // Deprecated access pattern
```

### Chat Initialization

```typescript
// Use the useChatSetup hook for consistent initialization
import { useChatSetup } from '@/app/@chat/hooks/useChatSetup';

function MyChatComponent() {
  const {
    userData,
    error,
    scriptsLoaded,
    setScriptsLoaded,
    componentId,
    chatData,
    isLoading,
  } = useChatSetup('legacy'); // or 'cloud'

  // ...
}
```

### UI Components

```typescript
// Use shared ChatUI component for consistent UI
import { ChatUI } from '@/app/@chat/components/ChatUI';

function MyChatComponent({ chatSession }) {
  return <ChatUI chatSession={chatSession} mode="legacy" />;
}
```
