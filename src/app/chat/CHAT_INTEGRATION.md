# Genesys Chat Integration Documentation

This document provides a comprehensive explanation of the Genesys chat implementation in the Member Portal. The system supports both legacy chat.js implementation and cloud-based Web Messenger implementation, with the choice determined by a flag.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Implementation Paths](#implementation-paths)
3. [File Structure](#file-structure)
4. [Integration Flow](#integration-flow)
5. [Component Interactions](#component-interactions)
6. [Script Loading Process](#script-loading-process)
7. [Configuration](#configuration)
8. [User Interface Elements](#user-interface-elements)
9. [Event Handling](#event-handling)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

The chat system uses a dual implementation approach:

1. **Legacy Implementation**: Uses Genesys chat.js (deprecated) and click_to_chat.js
2. **Cloud Implementation**: Uses Genesys Cloud Web Messenger

The system dynamically chooses the appropriate implementation based on eligibility flags. The architecture follows these principles:

- **Initialization**: Script loading and setup managed by GenesysScript/GenesysScripts components
- **Event Handling**: Unified interface through GenesysWidgetBus utility
- **UI Components**: Custom React components with fallbacks for native widgets
- **Configuration**: Environment-based settings via .env variables and runtime config

## Implementation Paths

### Legacy Chat Implementation

Uses the older Genesys chat.js widget with click_to_chat.js:

1. **Components Used**:
   - `LegacyChatWrapper.tsx`: Main wrapper for legacy implementation
   - `GenesysScript.tsx`: Script loader for legacy implementation

2. **Scripts Loaded**:
   - `/assets/genesys/plugins/widgets.min.js`: Core Genesys widget library
   - `/assets/genesys/click_to_chat.js`: Custom implementation

3. **Initialization Flow**:
   - `LegacyChatWrapper` creates `window.chatSettings` object
   - `GenesysScript` loads Genesys scripts in correct order
   - `click_to_chat.js` configures the widget using `window.chatSettings`
   - CXBus initializes with plugins path

### Cloud Implementation

Uses the newer Genesys Cloud Web Messenger:

1. **Components Used**:
   - `GenesysScript.tsx`: Configures and initializes Web Messenger
   - `ChatWidget.tsx`: Container for Web Messenger

2. **Scripts Loaded**:
   - Web Messenger from region-specific URL (e.g., `https://apps.{region}.pure.cloud/widgets/web-messenger.js`)

3. **Initialization Flow**:
   - Scripts loaded via `GenesysScript`
   - Configuration via `Genesys('command', 'widgets.registerUI')`
   - Event subscription with `Genesys('subscribe', 'MessagingService.ready')`

## File Structure

```
src/
├── app/
│   ├── @chat/                 # Chat components (app router)
│   │   ├── components/
│   │   │   ├── ChatButton.tsx # Custom chat button component
│   │   │   ├── GenesysScript.tsx # Script loader
│   │   │   ├── ChatWidget.tsx # Chat container
│   │   │   └── LegacyChatWrapper.tsx # Legacy chat implementation
│   │   ├── services/
│   │   │   └── ChatService.ts # Chat service implementation
│   │   └── stores/
│   │       └── chatStore.ts   # Zustand store for chat state
│   └── chat/                  # Chat resources (pages router)
│       ├── components/
│       │   ├── GenesysScripts.tsx
│       │   └── ChatWidget.tsx
│       ├── hooks/
│       │   └── useChat.tsx    # Hook for chat functionality
│       └── utils/
│           ├── genesysWidgetBus.ts # Communication layer
│           └── chatDomUtils.ts # DOM manipulation helpers
└── public/
    └── assets/
        └── genesys/
            ├── click_to_chat.js # Legacy chat implementation
            └── plugins/
                └── widgets.min.js # Genesys widgets library
```

## Integration Flow

### Initialization Sequence

1. **Component Mounting**:
   - `ChatWidget` is mounted in the application
   - Contains `GenesysScript`/`GenesysScripts` for loading resources

2. **Script Loading**:
   - Scripts loaded based on implementation (legacy or cloud)
   - Order matters: widgets.min.js → click_to_chat.js for legacy

3. **Configuration Application**:
   - For legacy: window.chatSettings applied to _genesys.widgets
   - For cloud: configuration via Genesys('command')

4. **Event Registration**:
   - Listeners attached for events like 'WebChat.ready', 'MessagingService.ready'
   - Custom event handlers registered for UI interactions

5. **Activation**:
   - Chat button becomes visible and interactive
   - User can initiate chat session

### Chat Button Workflow

1. **Button Detection**:
   - System checks for native Genesys button
   - Falls back to custom `ChatButton` component if needed

2. **Opening Chat**:
   - Multiple methods tried in sequence:
     1. CXBus command: `window.CXBus.command('WebChat.open')`
     2. Direct widget: `window._genesys.widgets.webchat.open()`
     3. Legacy method: `window.startChat()`
     4. Global function: `window.openGenesysChat()`

## Component Interactions

### ChatButton Component

The `ChatButton` component attempts to open the chat using four different methods:

```tsx
export function ChatButton({ text = 'Chat Now', customClass = '' }: ChatButtonProps) {
  // ...
  const openChat = () => {
    console.log('[ChatButton] Opening chat');
    
    try {
      // Method 1: CXBus command
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        window.CXBus.command('WebChat.open');
        return;
      }
      
      // Method 2: Direct widget access
      if (window._genesys && window._genesys.widgets && window._genesys.widgets.webchat) {
        window._genesys.widgets.webchat.open();
        return;
      }
      
      // Method 3: Legacy method
      if (typeof window.startChat === 'function') {
        window.startChat();
        return;
      }
      
      // Method 4: openGenesysChat global function
      if (typeof window.openGenesysChat === 'function') {
        window.openGenesysChat();
        return;
      }
      
      console.warn('[ChatButton] No chat method available');
    } catch (err) {
      console.error('[ChatButton] Error opening chat:', err);
    }
  };
  // ...
}
```

### GenesysScript Component

The `GenesysScript` component loads necessary scripts and defines the `window.openGenesysChat` function:

```tsx
export function GenesysScript({
  environment = process.env.NEXT_PUBLIC_GENESYS_REGION!,
  deploymentId = process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!,
  orgId = process.env.NEXT_PUBLIC_GENESYS_ORG_ID!,
  userData = {},
  onScriptLoaded,
}: GenesysScriptProps) {
  // ...
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (window.Genesys) {
      setIsLoaded(true);
      if (onScriptLoaded) onScriptLoaded();
    }
    
    // Create global function for manual triggering
    window.openGenesysChat = function() {
      console.log('Manual chat open requested');
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        window.CXBus.command('WebChat.open');
      } else if (window._genesys && window._genesys.widgets && window._genesys.widgets.webchat) {
        window._genesys.widgets.webchat.open();
      }
    };
    
    // Handle script loading...
  }, [onScriptLoaded]);
  // ...
}
```

### LegacyChatWrapper Component

The `LegacyChatWrapper` sets up the `window.chatSettings` object needed by click_to_chat.js:

```tsx
export default function LegacyChatWrapper() {
  // ...
  useEffect(() => {
    // Create the settings object expected by click_to_chat.js
    window.chatSettings = {
      clickToChatToken: process.env.NEXT_PUBLIC_CHAT_TOKEN || '',
      clickToChatEndpoint: process.env.NEXT_PUBLIC_LEGACY_CHAT_URL || '',
      // ... other settings
    };
    
    // Define global functions
    window.startChat = function() {
      logger.info('[LegacyChatWrapper] Manual startChat called', {
        componentId,
        timestamp: new Date().toISOString(),
      });
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        window.CXBus.command('WebChat.open');
      }
    };
    
    // ... other global functions
  }, [userData, chatGroup, formInputs, componentId]);
  // ...
}
```

## Script Loading Process

### Legacy Implementation

1. **Scripts Loading Order**:
   - `widgets.min.js` loaded first with `async=true`
   - `click_to_chat.js` loaded after with dependency on widgets.min.js

2. **Widgets Configuration**:
   - click_to_chat.js configures `window._genesys.widgets`
   - Sets up webchat, chatButton, position, and form options

3. **Initialization**:
   - `window._genesys.widgets.onReady` callback registers plugins
   - CXBus events for WebChat.opened, WebChat.messageAdded, etc.

### Cloud Implementation

1. **Scripts Loading**:
   - Web Messenger loaded from cloud URL
   - Uses region from environment variables

2. **Configuration**:
   - Configures with Genesys('command', 'widgets.registerUI')
   - Sets userData, styling, and deployment settings

3. **Event Registration**:
   - Subscribes to events with Genesys('subscribe', ...)
   - Handles state changes, messages, and connection events

## Configuration

### Environment Variables

- `NEXT_PUBLIC_GENESYS_REGION`: Region for cloud implementation
- `NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID`: Deployment ID
- `NEXT_PUBLIC_GENESYS_ORG_ID`: Organization ID
- `NEXT_PUBLIC_CHAT_TOKEN`: Authentication token for chat
- `NEXT_PUBLIC_LEGACY_CHAT_URL`: Endpoint for legacy chat

### Runtime Configuration

- `window.chatSettings`: Object used by click_to_chat.js with member info
- Eligibility flags: Determined by API responses and passed to components

## User Interface Elements

### Chat Button

- Custom `ChatButton` component with fallback to native button
- Checks visibility of native button and conditionally renders
- Handles click events to open chat using multiple methods

### Chat Container

- `<div id="genesys-chat-container">` serves as mount point for chat widget
- Styled with CSS to control position, visibility, and appearance

### Co-browse Functionality

- Modal dialogs for co-browse confirmation
- Screen sharing capabilities through CobrowseIO integration

## Event Handling

### CXBus Events (Legacy)

- `WebChat.opened`: Triggers when chat is opened
- `WebChat.messageAdded`: Fires when new messages arrive
- `WebChat.errors`: Handles connection errors
- `WebChat.ended`: Fires when chat session ends

### Web Messenger Events (Cloud)

- `MessagingService.ready`: Widget is ready
- `MessagingService.conversationStarted`: Chat begins
- `MessagingService.messageReceived`: New message received
- `MessagingService.connectionStateChanged`: Connection state updates

## Troubleshooting

### Type Error in ChatButton.tsx

The error occurs because `window.openGenesysChat` is used without being declared in the TypeScript interface:

```
Type error: Property 'openGenesysChat' does not exist on type 'Window & typeof globalThis'.
```

**Solution**:

Add the type definition to the global Window interface in `global.d.ts`:

```typescript
interface Window {
  // existing declarations...
  openGenesysChat?: () => void;
  // other declarations...
}
```

### Common Issues

1. **Button Not Appearing**:
   - Check if scripts are loaded properly
   - Verify CSS visibility settings
   - Ensure chat eligibility flags are correct

2. **Chat Not Opening**:
   - Check browser console for errors
   - Verify CXBus is properly initialized
   - Check if openGenesysChat function is defined

3. **Script Loading Order**:
   - Ensure widgets.min.js loads before click_to_chat.js
   - Check for network errors or CORS issues

4. **Configuration Issues**:
   - Verify environment variables are set correctly
   - Check if window.chatSettings is properly populated

---

This documentation covers the complete integration flow of the Genesys chat implementation in the Member Portal, including both legacy and cloud paths, component interactions, script loading, configuration, and troubleshooting.
