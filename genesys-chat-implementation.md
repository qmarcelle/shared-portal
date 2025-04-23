# Genesys Chat Implementation

## Overview

This document outlines the implementation of the Genesys chat widget in our React/Next.js application, combining both legacy and cloud-based approaches.

## Architecture

### Directory Structure

```
src/
├── components/
│   └── chat/
│       ├── ChatWidget.tsx          # Main integration component
│       └── PlanInfoExtension.tsx   # Custom header extension for plan info
├── hooks/
│   ├── useChat.ts                  # Primary chat hook for state and widget control
│   └── useChatEligibility.ts       # Eligibility API hook
├── services/
│   └── chatService.ts              # API service for all chat-related endpoints
├── config/
│   └── genesysConfig.ts            # Centralized Genesys configuration
└── types/
    └── chat.ts                     # Type definitions
```

## Legacy Implementation

### Process Overview

The legacy process involves:

1. Connecting to the Genesys configuration service hourly
2. Storing configuration data in static objects
3. Determining chat eligibility based on database checks
4. Configuring the chat widget through the Member Object

### Databases

- **Chat_Global_DB**: Map of strings
- **Chat_Bot_DB**: List of strings
- **Routing_Chat_Bot_DB**: List of strings
- **Working_Hours_DB**: Map of strings

### Chat Eligibility Rules

1. User must be present in Chat_Global_DB
2. Special case for user 127600 (requires plan after specific date)

## Modern Implementation

### Key Components

#### 1. ChatWidget.tsx

- Main React component for chat integration
- Handles widget initialization and lifecycle
- Manages plan switching and UI state

#### 2. useChat.ts

- Primary hook for chat functionality
- Manages widget state and configuration
- Handles events and callbacks
- Implements business logic for:
  - Plan switching restrictions
  - Terms & conditions
  - Business hours
  - Header extensions

#### 3. useChatEligibility.ts

- Handles eligibility API calls
- Manages eligibility state
- Provides eligibility data to chat widget

#### 4. chatService.ts

- API service for chat-related endpoints
- Handles script loading
- Manages API calls for:
  - Eligibility checks
  - Email sending
  - Phone attributes
  - Member preferences

### Configuration

#### genesysConfig.ts

Centralizes all Genesys settings:

- Base configuration for all types
- Cloud-specific settings
- On-prem specific settings
- Custom UI styling
- Header extensions

## Testing Setup

### Mock Data Structure

```typescript
const MOCK_TEST_DATA = {
  memberId: 'test-member',
  planId: 'test-plan',
  planName: 'Test Plan',
  chatGroup: 'TEST_GROUP',
  chatIDChatBotName: 'TestBot',
  formData: {
    SERV_Type: 'TEST',
    firstname: 'Test',
    lastname: 'User',
    GROUP_ID: 'TEST_GROUP',
    IDCardBotName: 'TestBot',
    IsVisionEligible: false,
    MEMBER_ID: 'test-member',
    coverage_eligibility: true,
    INQ_TYPE: 'MemberPortal',
    IsDentalEligible: false,
    MEMBER_DOB: '1990-01-01',
    LOB: 'TEST',
    lob_group: 'TEST_GROUP',
    IsMedicalEligibile: false,
    Origin: 'MemberPortal',
    Source: 'Web',
  },
};
```

### Test Mode Implementation

- Special configuration for local testing
- Mock data injection
- Console logging for debugging
- Simplified eligibility checks

## User Stories Implementation

1. ✅ **Chat Data Payload (ID: 31146)**
2. ✅ **Chat Eligibility (ID: 31154)**
3. ✅ **Business Hours (ID: 31156)**
4. ✅ **Terms & Conditions (ID: 31157)**
5. ✅ **Plan Switching Restrictions (ID: 31158)**
6. ✅ **Plan Switching Messaging (ID: 31159)**
7. ✅ **Plan Information Display (ID: 31161)**
8. ✅ **Plan Switching Option (ID: 31164)**
9. ✅ **Single Plan Handling (ID: 31166)**
10. ✅ **Multiple Plans Display (ID: 31295)**
11. ✅ **Single Plan Display (ID: 32072)**
12. ✅ **API Integration (ID: 21842)**

## Next Steps

1. Implement basic test setup on login page
2. Verify script loading and initialization
3. Test chat lifecycle through console logs
4. Implement full feature set from user stories
5. Add proper error handling and retry logic
6. Implement proper authentication flow
7. Add comprehensive testing suite
