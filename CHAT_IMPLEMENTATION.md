# Chat Widget Implementation Progress

## Overview

This document tracks the implementation progress of the BCBST Chat Widget, which is being migrated from a legacy JSP implementation to a modern React/TypeScript implementation.

## Current Status

- [x] Core type definitions created
- [x] Chat hours utility implemented
- [x] Chat store implemented for state management
- [x] Audio alert hook implemented
- [x] GenesysChatService implemented for API interaction
- [x] CobrowseService implemented for screen sharing functionality
- [x] Test environment setup improved
- [x] Add missing dependencies to package.json
- [ ] Fix remaining test issues
- [x] UI components implemented:
  - [x] ChatButton
  - [x] ChatHeader
  - [x] ChatMessage
  - [x] ChatInput
  - [x] ChatBody
  - [x] ChatWidget
- [x] Screen components implemented
  - [x] ChatForm
  - [x] ChatUnavailable
- [x] Feature components implemented
  - [x] ChatDisclaimer
  - [x] CobrowseConsent
  - [x] CobrowseSession
- [x] Plan switching integration implemented
- [ ] Create integration tests
- [ ] Create end-to-end tests

## User Story Implementation Status

### Chat Data Management

- [x] **ID: 31146** - Chat Data Payload Update

  - [x] Update payload when member changes plans
  - [x] Include all required fields (SERV_Type, firstname, etc.)
  - [x] Integrate with plan switcher events

- [x] **ID: 31154** - Chat Eligibility
  - [x] Determine widget visibility based on plan eligibility
  - [x] Reassess eligibility when switching plans
  - [x] Create useChatEligibility hook with plan dependency

### Chat Session Management

- [x] **ID: 31156** - Business Hours Handling

  - [x] Implement chat hours calculation utility
  - [x] Display out-of-hours notification based on plan
  - [x] Update business hours when switching plans

- [x] **ID: 31158** - Plan Switching Restrictions

  - [x] Lock plan switcher during active chat sessions
  - [x] Unlock plan switcher when chat ends
  - [x] Maintain lock state while chat window is visible

- [x] **ID: 31159** - Plan Switching Messaging
  - [x] Implement hover message for locked plan switcher
  - [x] Display "Plan switching is disabled during an active chat session"

### User Interface Requirements

- [x] **ID: 31161** - Plan Information Display

  - [x] Show current plan info in start chat window for multi-plan members
  - [x] Update plan information on plan switch

- [x] **ID: 31164** - Plan Switching Option

  - [x] Add "Switch" button in start chat window
  - [x] Close chat window and open plan switcher when clicked

- [x] **ID: 31166** - Single Plan Handling

  - [x] Hide plan information for single-plan members
  - [x] Remove plan switching options for single-plan members

- [x] **ID: 31295** - Multiple Plans Display

  - [x] Show current plan at top of active chat window
  - [x] Keep plan information consistent during chat

- [x] **ID: 32072** - Single Plan Display

  - [x] Do not display plan info in active chat for single-plan members

- [ ] **ID: 31157** - Terms & Conditions
  - [ ] Make T&Cs specific to LOB
  - [ ] Update T&Cs when switching plans across LOBs

### Backend Integration

- [x] **ID: 21842** - API Integration
  - [x] Implement required API endpoints structure
  - [x] Handle error cases appropriately

## Custom Hooks Implemented

1. **useChatEligibility**:

   - Determines if chat is eligible based on current plan
   - Checks plan eligibility and business hours
   - Returns eligibility status and reason
   - Handles different ineligibility scenarios with appropriate messages
   - Supports dynamic updating when plan changes

2. **usePlanSwitcherIntegration**:

   - Handles integration between chat widget and plan switcher
   - Manages lock/unlock state based on chat session
   - Provides UI flags for conditional rendering
   - Handles plan switching from chat
   - Updates hasMultiplePlans flag based on available plans
   - Synchronizes current plan info between chat and plan switcher

3. **useAudioAlert**:
   - Manages audio notifications for new messages
   - Handles browser autoplay restrictions
   - Provides play function for notifications
   - Clean initialization and cleanup of event listeners

## Plan Switching Capabilities

The chat widget includes plan-specific routing and customization based on the member's healthcare plan type. The following capabilities are identified:

1. **Client Type Detection**:

   - Determines the member's health plan type (BlueCare, SeniorCare, Individual, etc.)
   - Defined in the `ClientType` enum in `models/chat.ts`

2. **Chat Routing Logic**:

   - Routes chat sessions to different queues based on the member's plan
   - Implemented in `GenesysChatService.determineRoutingQueue()`
   - Different plan types are routed to specific queues:
     - BlueCare (BC) → BlueCare_Chat
     - SeniorCare (BA) → SCD_Chat
     - OrderIDCard Service → ChatBot_IDCard
     - Others → MBAChat (default)

3. **Plan-Specific Form Options**:

   - Based on the JSPF implementation, different help topics are shown based on plan type
   - Logic needs to be implemented in the chat form component
   - Options include different benefits, services, and support topics per plan

4. **Plan-Specific Disclaimers**:
   - Different legal text shown based on plan type
   - Will be implemented in ChatDisclaimer component

## Plan Switcher Integration

The chat widget integrates with the plan switcher component to provide a seamless experience:

1. **Data Refresh**:

   - Chat configuration and eligibility update when plans are switched
   - Widget visibility depends on the currently selected plan's eligibility

2. **Session Management**:

   - Plan switcher is locked during active chat sessions
   - Displays appropriate messaging when attempting to switch plans during chat
   - Unlocks plan switcher when chat ends

3. **UI Adaptation**:
   - Shows different UI for single-plan vs multi-plan members
   - Displays current plan information in chat windows for multi-plan members
   - Provides option to switch plans before initiating chat

## Test Environment Setup

We've made the following improvements to the test environment:

1. **Type Declarations**:

   - Created `src/tests/types.d.ts` to provide type definitions for Jest and testing utilities
   - Added global declarations for test functions like `describe`, `test`, and `expect`

2. **Jest Setup**:

   - Created `src/tests/jest-setup.ts` with common test mocks
   - Added mocks for global objects like `window.crypto`, `Audio`, and `ResizeObserver`
   - Set up automatic mock clearing between tests

3. **Jest Configuration**:

   - Updated `jest.config.ts` to include our test files
   - Added path mapping for modules
   - Improved test matching patterns to find all test files

4. **Dependencies Added**:
   - Added `@testing-library/react-hooks` for testing hooks
   - Added `@jest/globals` for TypeScript type definitions
   - Added `react-hook-form` and `@hookform/resolvers` for form handling
   - Added `zod` for form validation

## Remaining Test Issues

Some issues still need to be addressed:

1. **Zustand Store Testing**:

   - Need to implement proper setup for testing Zustand stores
   - Current implementation has TypeScript errors with mocking

2. **Component Testing Setup**:
   - Need to add providers and wrappers for component testing
   - Consider creating a custom render function

## Components Implemented

1. **ChatButton**:

   - Floating action button that opens the chat widget
   - Customizable with different labels and classes
   - Uses Tailwind for styling, following the project's design system
   - Implemented with proper accessibility attributes
   - Tested with unit tests

2. **ChatHeader**:

   - Header bar for the chat widget with title and close button
   - Supports different titles based on member type (Amplify vs. standard)
   - Implements close functionality via chat store
   - Follows BCBST design system using Tailwind classes
   - Tested with unit tests

3. **ChatMessage**:

   - Displays individual chat messages with different styles based on sender
   - Shows avatars for bot and agent messages
   - Includes timestamp formatting
   - Properly aligns user vs bot/agent messages
   - Responsive design with max-width constraints
   - Different styling for user, agent, and bot messages

4. **ChatInput**:

   - Text input for typing messages
   - Send button with proper states (disabled when appropriate)
   - Enter key handling for sending messages
   - Support for disabled state with contextual messages
   - Auto-focus when component mounts
   - Responsive design that adapts to container width
   - Accessible with proper aria labels

5. **ChatBody**:

   - Displays all chat messages in a scrollable container
   - Auto-scrolls to bottom when new messages arrive
   - Shows plan information banner for multi-plan members
   - Empty state when no messages
   - Efficient rendering using message keys
   - Maintains scroll position when new messages are added

6. **ChatWidget**:
   - Main container component that integrates all other components
   - Handles chat session initialization and message sending
   - Integrates with plan switcher
   - Conditionally renders UI based on plan count
   - Manages locking/unlocking plan switcher during chat
   - Handles different states: not eligible, outside hours, active chat
   - Shows appropriate messages for each state
   - Implements plan-specific UI for multi-plan members
   - Handles API errors with user-friendly messages
   - Updates chat payload when plan changes
   - Prevents plan switching during active chat

## Next Steps

1. Implement screen components:

   - ChatForm (with plan-specific options and plan display for multi-plan members)
   - ChatUnavailable (with business hours messaging)

2. Implement feature components:

   - ChatDisclaimer (with plan-specific text based on LOB)
   - CobrowseConsent
   - CobrowseSession

3. Fix remaining test issues

4. Create component integration tests

5. Address all linter issues

6. Complete end-to-end testing

## Component Implementation Plan

We'll implement the remaining components in the following order:

1. **Screen Components**:

   - ChatForm
   - ChatUnavailable

2. **Feature Components**:
   - ChatDisclaimer
   - CobrowseConsent
   - CobrowseSession

## Component Implementation Details

### Core Components

1. **ChatButton**:

   - Floating action button to open the chat widget
   - Customizable label and styling
   - Proper accessibility attributes

2. **ChatHeader**:

   - Title bar with close button
   - Plan-specific title support
   - Accessibility attributes for close button

3. **ChatMessage**:

   - User and agent/bot message styling
   - Timestamp display
   - Avatar support

4. **ChatInput**:

   - Message input field with send button
   - Disabled state with contextual messages
   - Enter key support

5. **ChatBody**:

   - Messages container with auto-scroll
   - Current plan display for multi-plan members
   - Empty state handling

6. **ChatWidget**:
   - Main container managing all components
   - Plan switching integration
   - Chat session management
   - Screen state management

### Screen Components

1. **ChatForm**:

   - Initial form for collecting service type and inquiry
   - Plan-specific options
   - Validation and error handling

2. **ChatUnavailable**:
   - Displayed when chat is not available
   - Different messages based on reason (ineligible, outside hours, error)
   - Contact information for alternatives

### Feature Components

1. **ChatDisclaimer**:

   - Plan-specific legal text
   - Proper styling and positioning

2. **CobrowseConsent**:

   - Screen sharing consent dialog
   - Clear explanation of what will be shared
   - Accept/decline options

3. **CobrowseSession**:
   - Screen sharing session indicator
   - Status updates (pending, active)
   - End session option

## Custom Hooks

1. **useChatEligibility**:

   - Determines if chat is available based on plan
   - Checks business hours
   - Returns eligibility status and reason

2. **usePlanSwitcherIntegration**:

   - Handles integration with plan switcher
   - Manages plan-specific UI display
   - Controls plan switching functionality

3. **useAudioAlert**:
   - Manages audio notifications for new messages
   - Handles browser autoplay restrictions
   - Provides play function for notifications

## Services

1. **GenesysChatService**:

   - Manages communication with Genesys Chat API
   - Initializes chat sessions
   - Sends and receives messages
   - Manages disconnection

2. **CobrowseService**:
   - Manages screen sharing functionality
   - Handles consent flow
   - Creates and ends cobrowse sessions

## Next Steps

1. **Testing**:

   - Create comprehensive unit tests for all components
   - Implement integration tests for key user flows
   - Set up end-to-end testing for complete functionality

2. **Documentation**:

   - Add JSDoc comments to all components and functions
   - Create usage examples
   - Document integration requirements

3. **Performance Optimization**:

   - Implement memoization for expensive operations
   - Optimize render cycles
   - Add proper cleanup for resources

4. **Accessibility Improvements**:
   - Ensure WCAG compliance
   - Test with screen readers
   - Verify keyboard navigation
