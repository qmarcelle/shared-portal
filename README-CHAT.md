# BCBST Chat Widget Implementation

## Introduction

This project implements a modern chat widget for the BCBST Member Portal. It migrates the existing JSP-based implementation to a React/TypeScript approach while maintaining the same business logic and integrating with Genesys APIs.

## Features

- **Real-time Chat**: Enables members to chat with BCBST customer service representatives
- **Plan-Specific Customization**: Displays different options and content based on member's plan type
- **Co-browsing**: Allows representatives to view and assist with the member's screen
- **Time-Based Availability**: Checks if chat is available based on business hours
- **Audio Notifications**: Alerts when new messages are received
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

The chat widget is built as a set of composable React components:

```
ChatWidget (Container)
├── ChatButton
├── ChatHeader
├── ChatBody
│   └── ChatMessage
├── ChatInput
├── ChatScreens
│   ├── ChatForm
│   ├── ChatSession
│   └── ChatUnavailable
└── CobrowseFeature
    ├── CobrowseConsent
    └── CobrowseSession
```

State management is handled through a Zustand store, providing a centralized approach to manage:

- Chat open/closed state
- Message history
- Working hours
- Session status
- Co-browse state

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

### 3. Plan-Specific Form Options

Each plan type has a customized set of help topics:

**BlueCare/BlueCarePlus/CoverTN/CoverKids:**

- Eligibility
- Benefits
- Claims Financial
- ID Card Request (if eligible)
- Member Update Information
- Pharmacy
- Additional topics vary by specific plan

**SeniorCare:**

- Uses a custom implementation

**Individual:**

- Benefits and Coverage
- New or Existing Claims
- Premium Billing
- Deductibles
- Pharmacy and Prescriptions
- Find Care
- Dental (if eligible)
- ID Card Request (if eligible)
- Other

**BlueElite:**

- Address Update
- Bank Draft
- Premium Billing
- Report Date of Death
- Dental (if eligible)
- ID Card Request (if eligible)
- All Other

**Default (Commercial):**

- Benefits and Coverage
- New or Existing Claims
- Deductibles
- Pharmacy and Prescriptions
- Find Care
- Dental (if eligible)
- COBRA (if eligible)
- ID Card Request (if eligible)
- Other

### 4. Plan-Specific Disclaimers

Each plan type has specific legal text:

**BlueCare/BlueCarePlus:**
"For quality assurance your chat may be monitored and/or recorded. Benefits are based on the member's eligibility when services are rendered. Benefits are determined by the Division of TennCare and are subject to change."

**CoverTN:**
"This information provided today is based on current eligibility and contract limitations. Final determination will be made upon the completion of the processing of your claim."

**Other Plans:**
"This information provided today is based on current eligibility and contract limitations. Final determination will be made upon the completion of the processing of your claim. For quality assurance your chat may be monitored and/or recorded. [Additional disclaimer text...]"

## Implementation Status

See [CHAT_IMPLEMENTATION.md](./CHAT_IMPLEMENTATION.md) for detailed progress tracking.

## Testing

We implement a comprehensive testing strategy:

1. **Unit Tests**: Testing individual components and utility functions
2. **Component Tests**: Testing component rendering and interactions
3. **Integration Tests**: Testing communication between components
4. **End-to-End Tests**: Testing the complete chat flow

## Usage

Once implemented, the chat widget can be added to any page:

```jsx
import { ChatWidget } from '@/components/chat';

// In your component
return (
  <ChatWidget
    userEligibility={userEligibility}
    config={chatConfig}
    currentPlan={currentPlan}
    availablePlans={availablePlans}
    isPlanSwitcherOpen={isPlanSwitcherOpen}
    openPlanSwitcher={openPlanSwitcher}
    closePlanSwitcher={closePlanSwitcher}
  />
);
```

## Configuration

Configuration options include:

```typescript
// Chat Configuration
{
  endPoint: process.env.NEXT_PUBLIC_CHAT_API_ENDPOINT,
  demoEndPoint: process.env.NEXT_PUBLIC_CHAT_DEMO_ENDPOINT,
  token: generatedToken,
  coBrowseLicence: process.env.NEXT_PUBLIC_COBROWSE_LICENSE,
  // Additional configuration...
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
