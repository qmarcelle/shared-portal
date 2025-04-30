# Chat System Documentation

## Overview

The chat system provides a unified chat experience supporting both Genesys Cloud Web Messaging and legacy chat.js implementations. It automatically selects the appropriate implementation based on member eligibility while providing a consistent API for developers.

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Basic Usage

```typescript
import { ChatWidget } from '@/app/chat/components/ChatWidget';

function App() {
  return (
    <ChatWidget
      memberId="member-123"
      planId="plan-456"
      planName="Premium Health"
      hasMultiplePlans={true}
      onLockPlanSwitcher={(locked) => console.log('Plan switcher locked:', locked)}
      onOpenPlanSwitcher={() => console.log('Opening plan switcher')}
    />
  );
}
```

## Architecture

### Key Components

1. **ChatWidget** (`src/app/chat/components/ChatWidget.tsx`)

   - Main entry point
   - Handles chat window state
   - Manages plan switching
   - Example usage:

   ```typescript
   <ChatWidget
     memberId={user.memberId}
     planId={user.planId}
     planName={user.planName}
     hasMultiplePlans={user.hasMultiplePlans}
     onLockPlanSwitcher={handleLock}
     onOpenPlanSwitcher={handlePlanSwitch}
   />
   ```

2. **GenesysScripts** (`src/app/chat/components/GenesysScripts.tsx`)

   - Handles script loading
   - Manages initialization
   - Example usage:

   ```typescript
   <GenesysScripts />
   ```

3. **useChat** Hook (`src/app/chat/hooks/useChat.tsx`)
   - Provides chat functionality
   - Manages state
   - Example usage:
   ```typescript
   const { openChat, closeChat, sendMessage } = useChat({
     memberId,
     planId,
     planName,
     hasMultiplePlans,
   });
   ```

### State Management

The system uses Zustand for state management:

```typescript
import { useChatStore } from '@/app/chat/stores/chatStore';

// Access chat state
const { isOpen, messages } = useChatStore();

// Update state
useChatStore.getState().setOpen(true);
```

## Implementation Details

### Chat Eligibility

The system determines which chat implementation to use based on the `cloudChatEligible` flag:

```typescript
const { eligibility } = useChatEligibility(memberId, planId);

if (eligibility.cloudChatEligible) {
  // Use Genesys Cloud Web Messaging
} else {
  // Use legacy chat.js
}
```

### Error Handling

The system includes comprehensive error handling:

```typescript
try {
  await chatService.startChat(payload);
} catch (error) {
  if (error instanceof ChatError) {
    // Handle specific chat errors
  } else {
    // Handle generic errors
  }
}
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run chat-specific tests
npm test chat

# Run with coverage
npm test -- --coverage
```

Example test:

```typescript
import { render, screen } from '@testing-library/react';
import { ChatWidget } from './ChatWidget';

test('renders chat widget', () => {
  render(<ChatWidget memberId="123" planId="456" />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

## Type System

### Key Types

```typescript
// Chat Configuration
interface ChatConfig {
  cloudChatEligible: boolean;
  deploymentId?: string;
  region?: string;
  legacyEndpoint?: string;
}

// Chat Message
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

// Chat Error
class ChatError extends Error {
  constructor(
    message: string,
    public code: ChatErrorCode,
  ) {
    super(message);
  }
}
```

## Best Practices

1. **State Management**

   - Use the chat store for global state
   - Keep component state minimal
   - Handle side effects in hooks

2. **Error Handling**

   - Always use ChatError for errors
   - Implement retry mechanisms
   - Provide user feedback

3. **Performance**

   - Lazy load chat components
   - Minimize re-renders
   - Clean up subscriptions

4. **Accessibility**
   - Use ARIA attributes
   - Support keyboard navigation
   - Test with screen readers

## Common Issues

1. **Script Loading Failures**

   ```typescript
   // Solution: Implement retry mechanism
   const loadScript = async (retries = 3) => {
     try {
       await loadGenesysScript(scriptUrl);
     } catch (error) {
       if (retries > 0) {
         await loadScript(retries - 1);
       }
     }
   };
   ```

2. **Plan Switching During Chat**
   ```typescript
   // Solution: Lock plan switching
   useEffect(() => {
     if (isChatActive) {
       onLockPlanSwitcher(true);
     }
     return () => onLockPlanSwitcher(false);
   }, [isChatActive]);
   ```

## Contributing

1. Follow TypeScript strict mode
2. Add tests for new features
3. Update documentation
4. Follow accessibility guidelines

## Resources

- [Genesys Cloud Documentation](https://developer.genesys.cloud)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
