# Chat Implementation Test Suite

## Overview

This test suite provides comprehensive coverage of the BCBST Member Portal chat implementation, ensuring all requirements are met and functionality works as expected across different scenarios.

## Test Structure

```
src/app/chat/__tests__/
├── components/           # Component tests
│   ├── ChatWidget.test.tsx
│   ├── ChatWindow.test.tsx
│   └── PlanInfoHeader.test.tsx
├── hooks/               # Hook tests
│   └── useChat.test.ts
├── services/           # Service tests
│   └── ChatService.test.ts
├── integration/        # Integration tests
│   ├── chatFlow.test.ts
│   └── planSwitching.test.ts
└── mocks/             # Test mocks
    └── services.ts
```

## Requirements Coverage Matrix

### 1. Chat Data Management Tests

#### Payload Management (ID: 31146)

- `services/ChatService.test.ts`
  - ✓ Updates payload on plan switch
  - ✓ Includes all required fields
  - ✓ Validates field formats

#### Eligibility (ID: 31154)

- `hooks/useChat.test.ts`
  - ✓ Checks eligibility on plan switch
  - ✓ Controls widget visibility
  - ✓ Handles eligibility changes

### 2. Session Management Tests

#### Business Hours (ID: 31156)

- `services/ChatService.test.ts`
  - ✓ Validates business hours by plan
  - ✓ Shows out-of-hours notification
  - ✓ Updates on plan switch

#### Plan Switching (ID: 31158, 31159)

- `integration/planSwitching.test.ts`
  - ✓ Locks switcher during chat
  - ✓ Shows hover message
  - ✓ Unlocks after chat ends

### 3. UI Component Tests

#### Start Chat Window (ID: 31161, 31164, 31166)

- `components/ChatWindow.test.tsx`
  - ✓ Shows plan info for multiple plans
  - ✓ Hides plan info for single plan
  - ✓ Handles plan switching

#### Active Chat Window (ID: 31295, 32072)

- `components/ChatWidget.test.tsx`
  - ✓ Displays current plan info
  - ✓ Adapts UI for plan count
  - ✓ Manages chat state

## Running Tests

### Setup

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test suite
npm test -- --testPathPattern=chat

# Run with coverage
npm test -- --coverage
```

### Coverage Requirements

- Components: 90% coverage
- Hooks: 95% coverage
- Services: 95% coverage
- Integration: 85% coverage

## Test Guidelines

### 1. Component Testing

```typescript
// Following the testing standards (030_testing-standards)
describe('ChatWidget', () => {
  const renderUI = (props = {}) => {
    return render(<ChatWidget {...props} />);
  };

  it('should show minimized state initially', () => {
    const { getByTestId } = renderUI();
    expect(getByTestId('chat-trigger')).toBeInTheDocument();
  });

  it('should expand on click', async () => {
    const { getByTestId, findByTestId } = renderUI();
    fireEvent.click(getByTestId('chat-trigger'));
    expect(await findByTestId('chat-window')).toBeInTheDocument();
  });
});
```

### 2. Hook Testing

```typescript
// Hook test with proper cleanup
describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle plan switching', () => {
    const { result } = renderHook(() =>
      useChat({
        memberId: '123',
        planId: 'plan1',
      }),
    );

    act(() => {
      result.current.switchPlan('plan2');
    });

    expect(result.current.currentPlan).toBe('plan2');
  });
});
```

### 3. Integration Testing

```typescript
// Integration test with auth mocking per 030_testing-standards
describe('Chat Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Auth mocking pattern
  jest.mock('next-auth/react', () => ({
    useSession: () => ({
      data: {
        user: { id: 'test-user', roles: ['user'] },
        expires: new Date(Date.now() + 86400000).toISOString()
      },
      status: 'authenticated'
    })
  }));

  it('should complete end-to-end chat session', async () => {
    const { user, getByTestId } = render(<MemberPortal />);

    // Start chat
    await user.click(getByTestId('chat-trigger'));

    // Verify chat window
    expect(getByTestId('chat-window')).toBeInTheDocument();

    // Send message
    await user.type(getByTestId('chat-input'), 'Hello');
    await user.click(getByTestId('send-button'));

    // Verify message sent
    expect(getByTestId('message-list')).toHaveTextContent('Hello');
  });
});
```

## Mocking Strategy

### Service Mocks

```typescript
// mocks/services.ts
export const mockChatService = {
  initialize: jest.fn(),
  startChat: jest.fn(),
  endChat: jest.fn(),
  sendMessage: jest.fn(),
  getBusinessHours: jest.fn(),
  checkEligibility: jest.fn(),
};
```

### API Mocking

```typescript
// Following 030_testing-standards pattern
global.fetch = jest.fn().mockImplementation((url, options) => {
  if (url.includes('/api/memberservice/api/v1/contactusemail')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  }
  if (url.includes('/api/OperationHours')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ inBusinessHours: true }),
    });
  }
  if (url.includes('/api/memberContactPreference')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ email: 'test@example.com' }),
    });
  }
  return Promise.reject(new Error('Not mocked'));
});
```

## Test Scenarios

### 1. Plan Switching

- Switch during inactive chat
- Attempt switch during active chat
- Switch with eligibility changes
- Switch outside business hours

### 2. Chat States

- Minimized to expanded
- Active to inactive
- Error states
- Loading states

### 3. Edge Cases

- Network failures
- API timeouts
- Invalid responses
- Concurrent operations

## Accessibility Testing

```typescript
// Following 030_testing-standards for accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('chat components are accessible', async () => {
  const { container } = render(<ChatWidget />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Contributing

1. Add tests for new features
2. Maintain coverage thresholds
3. Follow naming conventions
4. Document test scenarios
5. Update mocks as needed
