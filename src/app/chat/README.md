# Chat System Refactoring

## Overview

This directory contains a completely refactored chat system that consolidates duplicate code, removes unnecessary dependencies, and streamlines the architecture.

## Changes Made

### 1. Type Consolidation

- All types have been consolidated into a single `types.ts` file at the root level.
- Removed redundant type files (`models/session.ts`, `models/message.ts`, `models/cobrowse.ts`).
- Updated all import references to use the consolidated types.

### 2. Service Consolidation

- Merged `ChatService.ts`, `GenesysChatService.ts`, and `chatAPI.ts` into a single `ChatService.ts` class.
- Updated `CobrowseService.ts` to use the consolidated types.
- Moved utility functions from `chatUtils.ts` to a dedicated utils directory.

### 3. MSW Dependency Removal

- Removed MSW handler dependencies from the chat module.
- Updated the mocks to not rely on MSW for testing.

### 4. Architecture Improvements

- Simplified the service interfaces to be more consistent and maintainable.
- Fixed circular dependencies by consolidating types.
- Updated server actions to use the new service architecture.

### 5. Test and Provider Consolidation

- Removed duplicate test files (`.spec.tsx` and `.test.tsx` duplicates).
- Consolidated the Chat Provider implementation into a single file.
- Deleted redundant mock data and handler files.
- Fixed imports for all test files to use the consolidated types.

## Removed Duplicates

- Duplicate Providers: `providers.tsx` (kept `ChatProvider.tsx` as the canonical implementation)
- Duplicate Tests:
  - `chatStore.test.ts.new` (duplicate of `chatStore.test.ts`)
  - `US31146_ChatDataPayload.spec.tsx` (duplicate of `.test.tsx` version)
  - `ChatWidget.spec.tsx` (duplicate of `ChatWidget.test.tsx`)
  - `BCBSTChatIntegration.spec.tsx` (redundant with `ChatFunctionality.test.tsx`)
  - `US31156_BusinessHoursHandling.spec.tsx` (duplicate of `.test.tsx` version)
- Duplicate Mocks:
  - `__tests__/mocks/chatData.ts` (duplicate of `__mocks__/chatData.ts`)

## Directory Structure

```
src/app/chat/
├── types.ts                 # Consolidated types
├── actions.ts               # Server actions
├── components/              # UI components
├── hooks/                   # Custom React hooks
├── services/                # Service classes
│   ├── ChatService.ts       # Main chat service (consolidated)
│   ├── CobrowseService.ts   # Co-browse functionality
│   ├── BusinessHoursService.ts # Business hours management
│   └── PlanService.ts       # Plan management
├── stores/                  # State management
├── utils/                   # Utility functions
│   └── chatUtils.ts         # Chat-specific utilities
└── __tests__/               # Test files
```

## Remaining Issues

The following linter errors still need to be addressed:

1. In `utils/chatUtils.ts`:

   - Type issues with `any` parameters in `mapUserInfoToChatPayload`
   - Null return value not matching `ChatPayload` type

2. In `services/PlanService.ts`:
   - Duplicate function implementation for `getBusinessHours`
   - Missing `termsAndConditions` property on `PlanInfo` type
   - Invalid source type `'eligibility'`

## Usage Example

```typescript
import { ChatService } from '@/app/chat/services/ChatService';
import { ChatConfig } from '@/app/chat/types';

// Create a chat service instance
const config: ChatConfig = {
  token: 'your-token',
  endPoint: 'https://api.example.com/chat',
  // ...other required properties
};

const chatService = new ChatService(config);

// Initialize a chat session
const session = await chatService.initialize({
  firstName: 'John',
  lastName: 'Doe',
  // ...other user data
});

// Send a message
await chatService.sendMessage('Hello, I need help with my account');

// End the session
await chatService.disconnect();
```
