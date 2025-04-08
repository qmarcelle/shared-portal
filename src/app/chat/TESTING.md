# Chat System Testing Plan

## Overview

This document outlines the comprehensive testing strategy for the BCBST Member Portal Chat System. The tests are organized by component and functionality, following React and Next.js best practices.

## Test Categories

### 1. Store Tests (`chatStore.test.ts`)

```typescript
describe('Chat Store', () => {
  // State Management
  test('initializes with correct default state');
  test('updates isOpen state correctly');
  test('updates isMinimized state correctly');
  test('updates isChatActive state correctly');
  test('updates isLoading state correctly');
  test('updates error state correctly');

  // Plan Management
  test('sets current plan correctly');
  test('updates available plans correctly');
  test('handles plan switching correctly');
  test('locks/unlocks plan switcher correctly');

  // Chat Session Management
  test('starts chat session correctly');
  test('ends chat session correctly');
  test('adds messages correctly');
  test('clears messages correctly');

  // Business Hours
  test('updates business hours correctly');
  test('checks within business hours correctly');

  // Error Handling
  test('handles chat initialization errors');
  test('handles chat session errors');
  test('handles plan switching errors');

  // Chat Data Management
  test('updates chat data payload on plan switch');
  test('includes all required payload fields');
  test('handles coverage eligibility changes');

  // Plan Eligibility
  test('updates eligibility status on plan switch');
  test('handles multiple plan eligibility scenarios');

  // Business Hours
  test('updates business hours on plan switch');
  test('handles different business hours per plan');

  // Plan Switching
  test('locks plan switcher during active chat');
  test('unlocks plan switcher on chat end');
  test('persists lock state while chat window visible');
  test('handles agent-initiated chat end');
  test('handles member-initiated chat end');
});
```

### 2. Component Tests

#### ChatWidget (`ChatWidget.test.tsx`)

```typescript
describe('ChatWidget', () => {
  // Rendering
  test('renders ChatButton when not open');
  test('renders chat interface when open');
  test('renders loading state correctly');
  test('renders error state correctly');

  // Interaction
  test('opens chat on button click');
  test('closes chat on close button click');
  test('minimizes chat correctly');
  test('maximizes chat correctly');

  // Business Hours
  test('shows business hours notification when outside hours');
  test('hides business hours notification when within hours');

  // Plan Management
  test('shows plan switcher when multiple plans available');
  test('handles plan switching correctly');

  // Chat Session
  test('starts chat session correctly');
  test('ends chat session correctly');

  // Plan Information Display
  test('displays plan info for multiple plans');
  test('hides plan info for single plan');
  test('updates plan info on plan switch');

  // Plan Switching UI
  test('shows switch plan option for multiple plans');
  test('hides switch plan option for single plan');
  test('closes chat window on switch plan click');
  test('opens plan switcher after chat window close');

  // Business Hours UI
  test('displays out-of-hours notification');
  test('prevents chat initiation during off-hours');
  test('updates notification on plan switch');

  // Terms & Conditions
  test('updates T&Cs based on LOB');
  test('handles T&Cs changes on plan switch');
});
```

#### GenesysWidget (`GenesysWidget.test.tsx`)

```typescript
describe('GenesysWidget', () => {
  // Initialization
  test('loads Genesys script correctly');
  test('initializes chat widget with correct config');
  test('handles script loading errors');

  // Configuration
  test('passes correct user data to Genesys');
  test('updates user data when plan changes');
  test('handles missing plan data gracefully');

  // Session Management
  test('locks plan switcher on session start');
  test('unlocks plan switcher on session end');
  test('cleans up event listeners on unmount');

  // Error Handling
  test('handles Genesys API errors gracefully');
  test('handles missing window.Genesys gracefully');

  // Chat Data Payload
  test('sends correct payload fields to Genesys');
  test('updates payload on plan switch');
  test('handles missing payload fields gracefully');

  // Plan Switching
  test('locks plan switcher on session start');
  test('unlocks plan switcher on session end');
  test('handles agent-initiated session end');
  test('handles member-initiated session end');

  // Error Handling
  test('displays connection error message');
  test('handles error recovery flow');
});
```

#### BusinessHoursNotification (`BusinessHoursNotification.test.tsx`)

```typescript
describe('BusinessHoursNotification', () => {
  // Rendering
  test('renders business hours correctly');
  test('formats time correctly');
  test('handles 24/7 availability');

  // Interaction
  test('closes notification on button click');
  test('handles missing business hours data');

  // Plan-Specific Hours
  test('displays plan-specific business hours');
  test('updates hours on plan switch');
  test('handles different timezones');
});
```

### 3. Service Tests

#### ChatService (`ChatService.test.ts`)

```typescript
describe('ChatService', () => {
  // Initialization
  test('initializes with correct config');
  test('validates required config fields');

  // Session Management
  test('creates chat session correctly');
  test('ends chat session correctly');
  test('handles session errors');

  // Message Handling
  test('sends messages correctly');
  test('receives messages correctly');
  test('handles message errors');

  // API Integration
  test('sends email correctly');
  test('fetches phone attributes correctly');
  test('fetches email preferences correctly');
  test('handles API errors gracefully');

  // Data Management
  test('updates chat data on plan switch');
  test('validates required payload fields');
  test('handles missing data gracefully');
});
```

#### CobrowseService (`CobrowseService.test.ts`)

```typescript
describe('CobrowseService', () => {
  // Initialization
  test('initializes cobrowse correctly');
  test('validates required config');

  // Session Management
  test('creates cobrowse session correctly');
  test('ends cobrowse session correctly');
  test('handles session errors');

  // Consent Management
  test('handles consent dialogs correctly');
  test('tracks consent events');
});
```

### 4. Hook Tests

#### useChatEligibility (`useChatEligibility.test.ts`)

```typescript
describe('useChatEligibility', () => {
  // Eligibility Check
  test('checks eligibility correctly');
  test('handles loading state');
  test('handles error state');

  // Plan Validation
  test('validates plan eligibility');
  test('handles missing plan data');

  // Business Hours
  test('checks business hours correctly');
  test('handles timezone differences');
});
```

### 5. Integration Tests

#### Chat Flow (`chatFlow.test.ts`)

```typescript
describe('Chat Flow', () => {
  // End-to-End Flow
  test('completes full chat flow successfully');
  test('handles plan switching during chat');
  test('handles business hours restrictions');

  // Error Scenarios
  test('handles network errors gracefully');
  test('handles service unavailability');
  test('handles session timeouts');

  // Multi-Plan Scenarios
  test('handles multiple plans in same LOB');
  test('handles multiple plans in different LOBs');
  test('handles single plan scenario');

  // Plan Switching
  test('switches plans before chat start');
  test('prevents plan switch during active chat');
  test('allows plan switch after chat end');

  // Business Hours
  test('handles business hours across plans');
  test('handles mixed business hours scenarios');

  // Eligibility
  test('handles mixed eligibility scenarios');
  test('updates eligibility on plan switch');
});
```

## Test Scenarios Matrix

### Multi-Plan Testing

```typescript
describe('Multi-Plan Scenarios', () => {
  test('same LOB multiple plans');
  test('different LOB multiple plans');
  test('single plan');
  test('mixed eligibility plans');
  test('mixed business hours plans');
});
```

### Plan Switching Testing

```typescript
describe('Plan Switching Scenarios', () => {
  test('pre-chat plan switch');
  test('during-chat plan switch prevention');
  test('post-chat plan switch');
  test('plan switch with active chat');
  test('plan switch with pending chat');
});
```

### Business Hours Testing

```typescript
describe('Business Hours Scenarios', () => {
  test('all plans within hours');
  test('some plans within hours');
  test('all plans outside hours');
  test('mixed hours across plans');
  test('timezone handling');
});
```

### Eligibility Testing

```typescript
describe('Eligibility Scenarios', () => {
  test('all plans eligible');
  test('some plans eligible');
  test('no plans eligible');
  test('eligibility changes');
  test('mixed eligibility states');
});
```

## Testing Setup

### Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "msw": "^2.0.0"
  }
}
```

### Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
```

## Best Practices

1. **Component Testing**

   - Test component rendering
   - Test user interactions
   - Test state changes
   - Test prop changes
   - Test error boundaries

2. **Store Testing**

   - Test state updates
   - Test actions
   - Test selectors
   - Test middleware
   - Test persistence

3. **Service Testing**

   - Test API calls
   - Test error handling
   - Test data transformation
   - Test side effects

4. **Hook Testing**

   - Test state management
   - Test side effects
   - Test cleanup
   - Test error handling

5. **Integration Testing**
   - Test component interactions
   - Test data flow
   - Test error propagation
   - Test user flows

## Mocking Strategy

1. **API Mocks**

   - Use MSW for API mocking
   - Mock Genesys API responses
   - Mock authentication
   - Mock business hours service

2. **Component Mocks**

   - Mock external components
   - Mock window objects
   - Mock timers
   - Mock events

3. **Store Mocks**
   - Mock store state
   - Mock store actions
   - Mock store middleware

## Coverage Goals

- Components: 90%+
- Services: 95%+
- Hooks: 90%+
- Store: 95%+
- Integration: 80%+

## Continuous Integration

- Run tests on every PR
- Enforce coverage thresholds
- Run performance tests
- Run accessibility tests
