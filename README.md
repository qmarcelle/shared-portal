# BCBST Chat Widget Implementation

## Introduction

This project implements a modern chat widget for the BCBST Member Portal. It provides a seamless chat experience for members while maintaining integration with Genesys APIs and supporting plan-specific customization.

## Features

- **Real-time Chat**: Enables members to chat with BCBST customer service representatives
- **Plan-Specific Customization**: Displays different options and content based on member's plan type
- **Co-browsing**: Allows representatives to view and assist with the member's screen
- **Time-Based Availability**: Checks if chat is available based on business hours
- **Audio Notifications**: Alerts when new messages are received
- **Responsive Design**: Works on desktop and mobile devices
- **Plan Switching**: Seamless integration with plan switcher
- **Business Hours**: Centralized business hours management
- **Eligibility Checks**: Comprehensive eligibility verification

## Architecture

The chat widget follows a modern, modular architecture:

```
src/app/chat/
├── components/
│   ├── core/
│   │   ├── ChatWidget.tsx
│   │   ├── ChatButton.tsx
│   │   └── ChatHeader.tsx
│   ├── business-hours/
│   ├── eligibility/
│   └── plan-switcher/
├── services/
│   ├── ChatService.ts
│   └── GenesysChatService.ts
├── stores/
│   └── chatStore.ts
└── hooks/
    ├── useChatEligibility.ts
    └── useAudioAlert.ts
```

### State Management

The chat widget uses Zustand for state management, providing:

- Chat session state
- UI state (open/closed, minimized)
- Plan eligibility
- Business hours
- Message history
- Co-browse state

### Service Layer

The service layer handles all external integrations:

- **GenesysChatService**: Manages chat session lifecycle and Genesys API integration
- **BusinessHoursService**: Centralizes business hours logic
- **CobrowseService**: Handles screen sharing functionality

## Plan Switching Capabilities

The widget supports dynamic customization based on the member's health plan:

### 1. Client Types

```typescript
export enum ClientType {
  BlueCare = 'BC',
  BlueCarePlus = 'DS',
  CoverTN = 'CT',
  CoverKids = 'CK',
  SeniorCare = 'BA',
  Individual = 'INDV',
  BlueElite = 'INDVMX',
  Default = 'Default',
}
```

### 2. Chat Queue Routing

Each client type is routed to a specific chat queue:

- BlueCare → BlueCare_Chat
- SeniorCare → SCD_Chat
- Blue Elite → SeniorCare_Chat
- Individual & Others → MBAChat (default)

### 3. Plan-Specific Features

- Customized help topics per plan type
- Plan-specific disclaimers
- Eligibility-based feature availability
- Dynamic UI adaptation

## Testing

The project maintains a comprehensive testing strategy:

1. **Unit Tests**: Testing individual components and utility functions
2. **Component Tests**: Testing component rendering and interactions
3. **Integration Tests**: Testing communication between components
4. **End-to-End Tests**: Testing the complete chat flow

Test coverage is maintained at 90%+.

## Usage

The chat widget can be added to any page:

```jsx
import { ChatWidget } from '@/app/chat/components/core/ChatWidget';

// In your component
return (
  <ChatWidget
    userEligibility={userEligibility}
    config={chatConfig}
    currentPlan={currentPlan}
    availablePlans={availablePlans}
  />
);
```

## Configuration

Configuration options include:

```typescript
// Chat Configuration
{
  endPoint: process.env.NEXT_PUBLIC_PING_REST_URL,
  baseUrl: process.env.PING_ONE_BASE_URL,
  envId: process.env.NEXT_PUBLIC_ENV_ID,
  policyId: process.env.DROP_OFF_POLICY_ID,
  credentials: process.env.ES_API_PING_CREDENTIALS
}

// User Eligibility
{
  isChatEligibleMember: boolean,
  isDemoMember: boolean,
  isAmplifyMem: boolean,
  groupId: string,
  // Additional eligibility properties...
}
```

## Maintenance Guidelines

1. **Code Organization**

   - Keep chat-related code in the `src/app/chat` directory
   - Maintain separation between UI and service layers
   - Use established patterns for new features

2. **Testing**

   - Maintain high test coverage
   - Follow established testing patterns
   - Update tests when adding new features

3. **Documentation**
   - Keep documentation up to date with changes
   - Document new features following existing patterns
   - Update type definitions when modifying interfaces

## Future Enhancements

- End-to-end test implementation
- Additional chat features as needed
- Performance optimization
- Enhanced error handling
- Improved accessibility features

## Chat Module Cleanup Plan

### API Endpoint Consolidation

The current chat implementation contains several redundant API endpoints that can be consolidated:

1. **Redundant API Routes to Remove**:

   - `/api/chat/isChatAvailable` - This functionality is now part of the consolidated `getChatInfo` endpoint
   - `/api/chat/isCloudChatEligible` - This functionality is now part of the consolidated `getChatInfo` endpoint
   - `/api/chat/cloudChatGroups` - This endpoint appears to be unused in the codebase

2. **Retained API Routes**:
   - `/api/chat/getChatInfo` - The main consolidated endpoint that provides all chat configuration data
   - `/api/chat/token` - Used for authentication

### Implementation Steps

1. Verify no direct client calls are made to the redundant endpoints
2. Update any schema or type references to point to the new consolidated data structure
3. Remove the redundant API route files
4. Update documentation to reflect the new API structure

This consolidation will simplify the codebase, reduce maintenance overhead, and ensure a single source of truth for chat configuration data.
