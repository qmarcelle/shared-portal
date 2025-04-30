# Chat System Implementation Guide

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Implementation Paths](#implementation-paths)
   - [Cloud Chat Implementation](#cloud-chat-implementation)
   - [Legacy Chat Implementation](#legacy-chat-implementation)
4. [Integration Flow](#integration-flow)
5. [State Management](#state-management)
6. [Error Handling](#error-handling)
7. [Plan Switching](#plan-switching)
8. [Testing](#testing)
9. [Common Issues & Solutions](#common-issues--solutions)
10. [Deployment Considerations](#deployment-considerations)
11. [Maintenance & Updates](#maintenance--updates)
12. [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview

The chat system is designed to support two different implementations:

1. **Cloud Chat** (Genesys Web Messaging API) - Modern implementation using React components
2. **Legacy Chat** (chat.js widget) - Legacy implementation using the older Genesys chat widget

The system determines which implementation to use based on an eligibility check that returns a `cloudChatEligible` flag. This architecture allows for backward compatibility while supporting newer features in the cloud implementation.

```
┌────────────────┐     ┌─────────────────┐
│                │     │                 │
│  Components    │◄────┤  Chat Service   │
│                │     │                 │
└────────────────┘     └─────────────────┘
         ▲                     ▲
         │                     │
         │                     │
┌────────┴────────┐     ┌─────┴─────────┐
│                 │     │               │
│    Chat Store   │◄────┤   Eligibility │
│                 │     │               │
└─────────────────┘     └───────────────┘
```

## Directory Structure

```
src/app/chat/
├── components/        # UI components for chat
│   ├── Chat.tsx      # Main chat component
│   ├── ChatWindow.tsx # Chat window UI
│   ├── ChatTrigger.tsx # Button to open chat
│   └── PlanInfoHeader.tsx # Header showing plan info
├── config/           # Configuration for chat implementations
├── hooks/            # Custom hooks for chat functionality
│   ├── useChat.ts    # Core hook for chat functionality
│   └── useChatEligibility.ts # Hook for eligibility checks
├── services/         # Services for API interactions
│   └── ChatService.ts # Service for chat API calls
├── stores/           # State management
│   └── chatStore.ts  # Zustand store for chat state
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── schemas/          # Validation schemas
    └── genesys.schema.ts # Schema for chat configuration
```

## Implementation Paths

### Cloud Chat Implementation

The Cloud Chat implementation uses the Genesys Web Messaging API and React components:

1. **Initialization**:

   ```typescript
   // In ChatService.ts
   async initializeCloudChat() {
     // Load Genesys Web Messaging script
     await loadGenesysScript(config.cloudChatUrl);

     // Initialize Genesys Web Messaging
     window.Genesys('registerWidgetConfig', {
       // Configuration specific to cloud implementation
     });

     // Setup event listeners
     window.Genesys('subscribe', 'ready', this.handleReady);
     window.Genesys('subscribe', 'conversationStarted', this.handleConversationStarted);
     // Additional event subscriptions...
   }
   ```

2. **Commands**:

   ```typescript
   // Commands for cloud implementation
   openChat() {
     window.Genesys('command', 'Messenger.open');
   }

   closeChat() {
     window.Genesys('command', 'Messenger.close');
   }

   // Additional commands...
   ```

3. **Event Handling**:
   ```typescript
   // In useChat.ts
   const handleCloudChatEvents = () => {
     // Handle events specific to cloud implementation
   };
   ```

### Legacy Chat Implementation

The Legacy Chat implementation uses the older Genesys chat.js widget:

1. **Initialization**:

   ```typescript
   // In ChatService.ts
   async initializeLegacyChat() {
     // Load legacy chat.js script
     await loadGenesysScript('/assets/genesys/click_to_chat.js');

     // Initialize legacy chat
     window._genesys.widgets.chat.main.initChatBox();

     // Setup event listeners
     window._genesys.widgets.chat.main.setChatCallback(this.handleLegacyChatEvents);
   }
   ```

2. **Commands**:

   ```typescript
   // Commands for legacy implementation
   openChat() {
     window._genesys.widgets.chat.main.openChat();
   }

   closeChat() {
     window._genesys.widgets.chat.main.closeChat();
   }

   // Additional commands...
   ```

3. **Event Handling**:
   ```typescript
   // In useChat.ts
   const handleLegacyChatEvents = (event) => {
     // Handle events specific to legacy implementation
   };
   ```

## Integration Flow

The integration flow follows these steps:

1. **Eligibility Check**: Determine if the user is eligible for Cloud Chat or Legacy Chat

   ```typescript
   // In useChatEligibility.ts
   const { cloudChatEligible } = useChatEligibility(memberId, planId);
   ```

2. **Service Initialization**: Initialize the appropriate chat service based on eligibility

   ```typescript
   // In Chat.tsx
   useEffect(() => {
     if (isEligibilityLoaded) {
       chatService.initialize(cloudChatEligible);
     }
   }, [isEligibilityLoaded, cloudChatEligible]);
   ```

3. **Component Rendering**: Render the appropriate UI components

   ```tsx
   // In Chat.tsx
   return (
     <>
       <ChatTrigger onClick={handleOpenChat} />
       {isOpen && <ChatWindow onClose={handleCloseChat} />}
     </>
   );
   ```

4. **Event Handling**: Set up event handlers for the chat implementation

   ```typescript
   // In useChat.ts
   useEffect(() => {
     if (cloudChatEligible) {
       setupCloudChatEventHandlers();
     } else {
       setupLegacyChatEventHandlers();
     }

     return () => {
       cleanupEventHandlers();
     };
   }, [cloudChatEligible]);
   ```

## State Management

The chat system uses Zustand for state management. The chatStore manages:

- UI state (open/closed, minimized/maximized)
- Chat state (messages, thread ID)
- Eligibility state
- Plan switching

```typescript
// In chatStore.ts
const useChatStore = create<ChatStore>((set) => ({
  // UI State
  isOpen: false,
  isMinimized: false,

  // Chat State
  messages: [],
  threadId: null,
  isReady: false,

  // Eligibility State
  eligibility: {
    isChatAvailable: false,
    cloudChatEligible: false,
    isLoading: true,
    error: null,
  },

  // Plan Switching
  isPlanSwitchLocked: false,

  // Actions
  setOpen: (isOpen) => set({ isOpen }),
  setMinimized: (isMinimized) => set({ isMinimized }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  // Additional actions...
}));
```

## Error Handling

The chat system implements comprehensive error handling:

1. **API Errors**: Handled in ChatService.ts with specific error types

   ```typescript
   try {
     const response = await fetch('/api/chat/info');
     if (!response.ok) {
       throw new ChatError('Failed to fetch chat info', 'API_ERROR');
     }
     return await response.json();
   } catch (error) {
     throw new ChatError('Failed to fetch chat info', 'API_ERROR');
   }
   ```

2. **Script Loading Errors**: Handled during script initialization

   ```typescript
   try {
     await loadGenesysScript(scriptUrl);
   } catch (error) {
     handleScriptLoadError(error);
   }
   ```

3. **Runtime Errors**: Captured with error boundaries
   ```tsx
   // In ChatErrorBoundary.tsx
   class ChatErrorBoundary extends React.Component {
     // Error boundary implementation
   }
   ```

## Plan Switching

The chat system supports plan switching during an active chat:

1. **Lock Plan Switching**: When a chat is active, the plan switcher is locked

   ```typescript
   // In ChatService.ts
   startChat() {
     // Start chat logic...
     this.onLockPlanSwitcher(true);
   }

   endChat() {
     // End chat logic...
     this.onLockPlanSwitcher(false);
   }
   ```

2. **Update Chat Context**: When plans are switched, the chat context is updated
   ```typescript
   // In useChat.ts
   useEffect(() => {
     if (currentPlanId !== previousPlanId) {
       chatService.updateChatContext({
         planId: currentPlanId,
         planName: currentPlanName,
       });
     }
   }, [currentPlanId, currentPlanName]);
   ```

## Testing

The chat system includes tests for:

1. **Unit Tests**: For individual components and hooks

   ```typescript
   // In __tests__/useChat.test.ts
   test('useChat should initialize cloud chat when eligible', () => {
     // Test implementation
   });
   ```

2. **Integration Tests**: For testing the interaction between components

   ```typescript
   // In __tests__/Chat.test.tsx
   test('Chat should render ChatWindow when open', () => {
     // Test implementation
   });
   ```

3. **Mock Data**: For simulating API responses
   ```typescript
   // In mocks/chatData.ts
   export const mockChatInfo = {
     isChatAvailable: true,
     cloudChatEligible: true,
     // Additional mock data...
   };
   ```

## Common Issues & Solutions

### Visibility Issues with Legacy Chat

**Problem**: Legacy chat widget buttons (minimize, close) not visible after initialization.

**Solution**: Use a MutationObserver to detect when the widget is added to the DOM:

```typescript
// In useChat.ts
const observeWidgetVisibility = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const widgetHeader = document.querySelector('.cx-widget-header');
        if (widgetHeader) {
          // Apply visibility fixes
          const buttonGroup = widgetHeader.querySelector('.cx-button-group');
          if (buttonGroup) {
            buttonGroup.setAttribute('style', 'visibility: visible;');
          }
          observer.disconnect();
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
};
```

### Script Loading Failures

**Problem**: Genesys script fails to load or initialize.

**Solution**: Implement retry logic with exponential backoff:

```typescript
// In ChatService.ts
const loadScriptWithRetry = async (url: string, retries = 3): Promise<void> => {
  try {
    await loadGenesysScript(url);
  } catch (error) {
    if (retries > 0) {
      const delay = Math.pow(2, 3 - retries) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return loadScriptWithRetry(url, retries - 1);
    }
    throw error;
  }
};
```

## Deployment Considerations

1. **Content Security Policy (CSP)**: Ensure the CSP allows loading of Genesys scripts and connections

   ```javascript
   // In next.config.mjs
   {
     headers: [
       {
         source: '/:path*',
         headers: [
           {
             key: 'Content-Security-Policy',
             value: `
               connect-src 'self' *.incontact.com *.genesys.com;
               script-src 'self' 'unsafe-inline' *.incontact.com *.genesys.com;
               frame-src 'self' *.incontact.com *.genesys.com;
             `,
           },
         ],
       },
     ];
   }
   ```

2. **External Scripts**: Configure webpack to handle Genesys scripts as externals
   ```javascript
   // In next.config.mjs
   {
     webpack: (config) => {
       config.externals = {
         ...config.externals,
         'genesys-web-messaging': 'Genesys',
       };
       return config;
     };
   }
   ```

## Maintenance & Updates

### Updating Genesys Scripts

When updating Genesys scripts:

1. Update the script URL in the configuration
2. Test both cloud and legacy implementations thoroughly
3. Update event handlers if the API has changed

### Adding New Features

When adding new features:

1. Implement the feature in both cloud and legacy paths
2. Update the appropriate types and schemas
3. Add tests for the new feature

## Contributing Guidelines

When contributing to the chat system:

1. **Separation of Concerns**: Keep cloud and legacy implementations separate
2. **Type Safety**: Ensure all types are properly defined
3. **Testing**: Add tests for new features or changes
4. **Documentation**: Update this implementation guide with any changes
5. **Error Handling**: Implement proper error handling for new code

---

This implementation guide is a living document. Please keep it updated as the chat system evolves.
