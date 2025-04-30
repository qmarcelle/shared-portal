# Chat System Documentation

## Overview

The chat system provides a unified chat experience supporting both Genesys Cloud Web Messaging and legacy chat.js implementations. It automatically selects the appropriate implementation based on member eligibility while providing a consistent API for developers.

## Architecture

### Key Components

1. **ChatWidget** (`components/ChatWidget.tsx`)

   - Main entry point for chat functionality
   - Handles chat window state and plan switching
   - Manages eligibility checks and implementation selection

2. **ChatService** (`services/ChatService.ts`)

   - Core service handling chat initialization and messaging
   - Manages authentication and session state
   - Implements reconnection logic and error handling

3. **GenesysScripts** (`components/GenesysScripts.tsx`)

   - Handles script loading for both implementations
   - Manages script lifecycle and cleanup
   - Configures chat widgets based on eligibility

4. **Chat Store** (`stores/chatStore.ts`)
   - Centralized state management using Zustand
   - Handles UI state, messages, and eligibility
   - Manages plan switching lock state

### Directory Structure

```
src/app/chat/
├── components/              # React components
│   ├── ChatWidget.tsx      # Main chat widget component
│   ├── ChatWindow.tsx      # Chat window implementation
│   ├── ChatTrigger.tsx     # Minimized chat button
│   ├── PlanInfoHeader.tsx  # Plan information display
│   ├── GenesysScripts.tsx  # Script loading
│   └── shared/             # Shared component utilities
├── config/                 # Configuration
│   └── genesys.config.ts   # Genesys configuration
├── hooks/                  # React hooks
│   └── useChat.ts         # Main chat hook
├── services/              # Core services
│   └── ChatService.ts     # Chat service implementation
├── stores/                # State management
│   └── chatStore.ts       # Zustand store
├── types/                 # TypeScript types
│   ├── index.ts          # Type exports
│   └── errors.ts         # Error types
└── utils/                # Utilities
    └── chatDomUtils.ts   # DOM manipulation
```

## Implementation Details

### 1. Chat Service

The `ChatService` class is the core of the chat system:

```typescript
class ChatService {
  constructor(
    public readonly memberId: string,
    public readonly planId: string,
    public readonly planName: string,
    public readonly hasMultiplePlans: boolean,
    public readonly onLockPlanSwitcher: (locked: boolean) => void,
  ) {}
}
```

Key responsibilities:

- Chat initialization and script loading
- Session management and authentication
- Message handling and state management
- Error handling and recovery
- Plan switching support

### 2. Error Handling

The system uses a comprehensive error handling system:

```typescript
class ChatError extends Error {
  constructor(
    message: string,
    type: ChatErrorType,
    severity: ChatErrorSeverity = 'ERROR',
    metadata: Partial<ChatErrorMetadata> = {},
  ) {}
}
```

Error types include:

- Initialization errors
- Configuration errors
- API errors
- Script loading errors
- Business hours errors
- Plan switching errors

### 3. Configuration

Configuration is managed through `genesys.config.ts`:

```typescript
export const GENESYS_CONFIG = {
  deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID,
  region: process.env.NEXT_PUBLIC_GENESYS_REGION,
  orgId: process.env.NEXT_PUBLIC_GENESYS_ORG_ID,
  queueName: process.env.NEXT_PUBLIC_CHAT_QUEUE_NAME,
};
```

Configuration is validated using Zod schemas to ensure type safety.

## Usage Guide

### Basic Usage

```typescript
import { ChatWidget } from '@/app/chat/components';

function App() {
  return (
    <ChatWidget
      memberId="123"
      planId="456"
      planName="Basic Plan"
      hasMultiplePlans={true}
      onLockPlanSwitcher={(locked) => console.log('Plan switcher locked:', locked)}
    />
  );
}
```

### Using the Chat Hook

```typescript
import { useChat } from '@/app/chat/hooks';

function ChatComponent() {
  const {
    isOpen,
    isChatActive,
    error,
    openChat,
    closeChat,
    startChat,
    endChat,
  } = useChat();

  // Use chat functionality
}
```

## Error Handling

### Handling Chat Errors

```typescript
try {
  await startChat();
} catch (error) {
  if (error instanceof ChatError) {
    // Show user-friendly message
    showErrorMessage(error.getUserMessage());

    // Log error if needed
    if (error.shouldReport()) {
      logger.error('Chat error:', error.toLog());
    }

    // Attempt recovery if possible
    if (error.isRecoverable()) {
      await retryOperation();
    }
  }
}
```

## Testing

The chat system includes comprehensive tests:

1. **Unit Tests**

   - Component tests
   - Hook tests
   - Service tests

2. **Integration Tests**

   - Chat flow tests
   - Plan switching tests
   - Error handling tests

3. **Test Utilities**
   - Mock services
   - Test data generators
   - Helper functions

## Best Practices

1. **Error Handling**

   - Always use the ChatError class for errors
   - Provide user-friendly error messages
   - Log errors appropriately

2. **State Management**

   - Use the chat store for global state
   - Keep component state minimal
   - Handle side effects in hooks

3. **Testing**
   - Write tests for new features
   - Use mock data for testing
   - Test error scenarios

## Contributing

1. **Adding Features**

   - Follow the existing architecture
   - Add appropriate tests
   - Update documentation

2. **Bug Fixes**

   - Add regression tests
   - Update error handling
   - Document fixes

3. **Code Style**
   - Follow TypeScript best practices
   - Use consistent naming
   - Add JSDoc comments

## Deployment

1. **Environment Variables**

   - Set required Genesys variables
   - Configure API endpoints
   - Set appropriate debug flags

2. **Build Process**

   - Run type checks
   - Run tests
   - Build production bundle

3. **Monitoring**
   - Monitor error rates
   - Track chat metrics
   - Monitor performance

## Troubleshooting

Common issues and solutions:

1. **Script Loading Issues**

   - Check network connectivity
   - Verify Genesys configuration
   - Check browser console for errors

2. **Authentication Issues**

   - Verify token validity
   - Check permissions
   - Validate member eligibility

3. **Plan Switching Issues**
   - Check chat active state
   - Verify lock mechanism
   - Check error handling
