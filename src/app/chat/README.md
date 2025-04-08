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

# Chat Widget Component

A self-contained chat widget component that integrates with Genesys Cloud and Legacy On-Prem chat systems.

## Usage

```tsx
// In your Next.js page or component:
'use client';

import { ChatWidget } from '@/app/chat';
import { ChatError } from '@/app/chat/types/errors';

export default function YourPage() {
  const handleError = (error: ChatError) => {
    console.error('Chat error:', error);
  };

  const handleChatStarted = () => {
    console.log('Chat session started');
  };

  const handleChatEnded = () => {
    console.log('Chat session ended');
  };

  return (
    <div className="chat-wrapper" style={{ width: '400px', height: '600px' }}>
      <ChatWidget
        onError={handleError}
        onChatStarted={handleChatStarted}
        onChatEnded={handleChatEnded}
      />
    </div>
  );
}
```

## Features

- Seamless integration with Genesys Cloud and Legacy On-Prem chat systems
- Automatic handling of chat eligibility and business hours
- Built-in error handling and loading states
- Plan switching support
- Responsive design
- TypeScript support

## Configuration

The chat widget uses environment variables for configuration. Add these to your `.env.local`:

```env
NEXT_PUBLIC_CHAT_PROVIDER=cloud
NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID=your-deployment-id
NEXT_PUBLIC_GENESYS_REGION=your-region
```

## Props

| Prop            | Type                         | Description                           |
| --------------- | ---------------------------- | ------------------------------------- |
| `businessHours` | `BusinessHours`              | Optional business hours configuration |
| `onError`       | `(error: ChatError) => void` | Error callback                        |
| `onChatStarted` | `() => void`                 | Called when chat session starts       |
| `onChatEnded`   | `() => void`                 | Called when chat session ends         |

## Styling

The widget comes with default styles but can be customized by overriding CSS classes:

- `.chat-widget`: Main container
- `.chat-container`: Chat interface container
- `.chat-alerts`: Alert messages container
- `.chat-loading`: Loading state
- `.chat-error`: Error state

## Architecture

The chat widget is built using:

- React for UI components
- Zustand for state management
- TypeScript for type safety
- CSS Modules for styling

Key files:

- `components/core/ChatWidget.tsx`: Main widget component
- `services/ChatService.ts`: Chat business logic
- `stores/chatStore.ts`: State management
- `config/index.ts`: Configuration
- `types/`: TypeScript definitions

## Best Practices

1. Always wrap the widget in a container with defined dimensions
2. Handle errors appropriately using the onError callback
3. Use the provided TypeScript types for type safety
4. Follow the chat session lifecycle using the provided callbacks

# BCBST Chat Integration

## Overview

This module implements a chat system that integrates with both legacy on-premises Genesys and cloud-based Genesys platforms. The implementation dynamically determines which platform to use based on member eligibility and configuration data from the BCBST Chat API.

## Architecture

The chat system follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│ Components                                              │
│ ┌─────────────┐ ┌────────────┐ ┌────────────────────┐  │
│ │ ChatWidget  │ │ ChatButton │ │ Business Hours UI  │  │
│ └─────────────┘ └────────────┘ └────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│ Providers                                               │
│ ┌─────────────────────┐ ┌───────────────────────────┐  │
│ │ ChatProvider        │ │ ChatProviderFactory       │  │
│ └─────────────────────┘ └───────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│ Hooks                                                   │
│ ┌─────────────────────┐ ┌───────────────────────────┐  │
│ │ useChatEligibility  │ │ useChat                   │  │
│ └─────────────────────┘ └───────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│ Services                                                │
│ ┌─────────────────────┐ ┌───────────────────────────┐  │
│ │ chatAPI             │ │ Business Hours Service    │  │
│ └─────────────────────┘ └───────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## API Integration

### BCBST Chat API

The system integrates with the BCBST Chat API, which provides:

- Member eligibility information
- Business hours
- Chat routing configuration
- Cloud vs. on-premises determination

#### Key Endpoints

| Endpoint                                                                     | Purpose                   |
| ---------------------------------------------------------------------------- | ------------------------- |
| `/MemberServiceWeb/api/member/v1/members/:lookup/:memberId/chat/getChatInfo` | Get chat eligibility info |
| `/MemberServiceWeb/api/member/v1/members/chat/cloudChatGroups`               | Get cloud chat groups     |
| `/memberservice/api/v1/contactusemail`                                       | Email communication       |
| `/OperationHours`                                                            | Get phone operation hours |
| `/memberContactPreference`                                                   | Get contact preferences   |

### Chat Payload

When starting a chat session, the following payload is sent:

```javascript
{
  "SERV_Type": "MemberPortal",  // Service type
  "firstname": "...",           // Member's first name
  "RoutingChatbotInteractionId": "...", // Routing identifier
  "PLAN_ID": "...",             // Current plan ID
  "lastname": "...",            // Member's last name
  "GROUP_ID": "...",            // Group identifier
  "IDCardBotName": "...",       // ID card bot name
  "IsVisionEligible": true/false, // Vision eligibility
  "MEMBER_ID": "...",           // Member identifier
  "coverage_eligibility": true/false, // Coverage eligibility
  "INQ_TYPE": "...",            // Inquiry type
  "IsDentalEligible": true/false, // Dental eligibility
  "MEMBER_DOB": "...",          // Member date of birth
  "LOB": "...",                 // Line of business
  "lob_group": "...",           // Line of business group
  "IsMedicalEligibile": true/false, // Medical eligibility
  "Origin": "MemberPortal",     // Origin of chat
  "Source": "Web"               // Source of chat
}
```

### Integration with Genesys

The system integrates with Genesys in two ways:

1. **Cloud Integration**: For cloud-eligible members, uses the Genesys Web Messenger API.
2. **On-Premises Integration**: For non-cloud members, uses the legacy on-premises widget from `/public/chat.js`.

#### Business Hours Format

The API returns business hours in a special format: `DAY_DAY_HOUR_HOUR`

- Example: `M_F_8_6` means Monday to Friday, 8AM to 6PM
- Example: `S_S_24` means 24/7 availability (Sunday to Saturday, all hours)

## Implementation Details

### 1. Eligibility Determination

The `useChatEligibility` hook:

- Fetches user information
- Checks business hours
- Determines if cloud chat is eligible
- Prepares chat payload

```typescript
const { isEligible, isCloudChatEligible, businessHours, chatPayload } =
  useChatEligibility();
```

### 2. Dynamic Widget Loading

The `ChatProviderFactory` component:

- Loads the appropriate script based on eligibility
- For cloud: `webmessenger.js`
- For on-premises: `/chat.js`
- Initializes configuration with `/genesys-config.js`

### 3. Plan Switching

During active chat sessions:

- Plan switching is locked
- Warning message is displayed when hovering over plan switcher
- Chat data payload is updated when a plan is switched
- Current plan info is displayed in chat window

### 4. Config Management

Configuration is managed in several layers:

- Environment variables in `/config/env.ts`
- Genesys configuration loaded from `/public/genesys-config.js`
- Widget configuration in `/config/index.ts`

## Usage

```tsx
import { ChatWidget } from '@/app/chat/components/core/ChatWidget';

function MyComponent() {
  return (
    <div className="dashboard">
      <ChatWidget />
    </div>
  );
}
```

## Testing

The chat system uses Jest for testing:

- Unit tests for individual components
- Integration tests for API communication
- Mock implementations for Genesys widgets

## Debugging

Common issues:

1. **Widget Not Loading**: Check if Genesys config is properly loaded
2. **Auth Errors**: Verify auth headers are properly set
3. **Chat Not Available**: Verify business hours configuration

## Reference Documents

- [BCBST Chat API Documentation](link/to/api/docs)
- [Genesys Cloud Documentation](https://developer.genesys.cloud/)
