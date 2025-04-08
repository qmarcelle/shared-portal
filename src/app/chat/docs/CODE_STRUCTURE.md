# Chat Module Code Structure

## Directory Organization

The chat module follows a structured organization:

```
src/app/chat/
├── components/          # UI components
│   ├── core/            # Core widget components
│   ├── shared/          # Shared UI elements
│   └── widgets/         # Widget implementations
├── config/              # Configuration
│   ├── index.ts         # Main config exports
│   ├── env.ts           # Environment variables
│   └── genesys.config.ts # Genesys integration
├── hooks/               # React hooks
│   ├── useChatEligibility.ts # Eligibility hook
│   └── useChat.ts       # Main chat functionality
├── providers/           # React context providers
│   ├── ChatProvider.tsx # Main provider
│   └── ChatProviderFactory.tsx # Widget factory
├── schemas/             # Zod schemas
│   └── user.ts          # User and payload schemas
├── services/            # Service layer
│   ├── api/             # API integration
│   └── utils/           # Service utilities
├── stores/              # State management
│   └── chatStore.ts     # Chat Zustand store
├── types/               # TypeScript types
│   ├── errors.ts        # Error types
│   └── types.ts         # Domain types
└── utils/               # Utility functions
    └── chatUtils.ts     # Chat-specific utilities
```

## Key Files

### Configuration

- **config/index.ts**: Central configuration exports
- **config/env.ts**: Environment variable management
- **config/genesys.config.ts**: Genesys integration config

### API Integration

- **services/api/index.ts**: Core API integration with all endpoints
- **schemas/user.ts**: Data schemas and parsing functions

### Providers

- **providers/ChatProvider.tsx**: Main chat provider with error handling
- **providers/ChatProviderFactory.tsx**: Dynamically selects and loads the appropriate widget

### Hooks

- **hooks/useChatEligibility.ts**: Fetches eligibility data and business hours
- **hooks/useChat.ts**: Provides chat functionality to components

### Components

- **components/core/ChatWidget.tsx**: Main chat widget component
- **components/core/GenesysInitializer.tsx**: Loads Genesys configuration

## Flow Diagrams

### Initialization Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ ChatWidget   │────>│ ChatProvider    │────>│ useChatEligibility│
└──────────────┘     └─────────────────┘     └──────────────────┘
                            │                         │
                            ▼                         ▼
                     ┌──────────────┐          ┌──────────────┐
                     │ Factory loads │          │ chatAPI      │
                     │ correct widget│<─────────│ getChatInfo  │
                     └──────────────┘          └──────────────┘
```

### Session Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ User action  │────>│ ChatWidget      │────>│ useChatEligibility│
└──────────────┘     └─────────────────┘     └──────────────────┘
                            │                         │
                            ▼                         ▼
                     ┌──────────────┐          ┌──────────────┐
                     │ chatStore    │          │ chatAPI      │
                     │ state update │<─────────│ startSession │
                     └──────────────┘          └──────────────┘
```

## Component Responsibilities

### ChatProvider

- Handles errors
- Manages session state
- Provides cleanup

### ChatProviderFactory

- Determines which widget type to use
- Loads the appropriate script
- Handles initialization

### chatAPI Service

- Makes API calls
- Handles errors
- Formats data

### useChatEligibility Hook

- Fetches user eligibility
- Processes business hours
- Prepares chat payload

### chatStore

- Manages chat state
- Handles plan lock/unlock
- Stores messages

## Testing Structure

Tests follow the same structure as the implementation:

```
src/app/chat/__tests__/
├── components/          # Component tests
├── hooks/               # Hook tests
├── services/            # Service tests
└── stores/              # Store tests
```

## Error Boundary

The chat module uses error boundaries to prevent chat crashes from affecting the rest of the application:

```tsx
<ChatErrorBoundary onReset={resetStore}>
  <ChatProviderFactory>{children}</ChatProviderFactory>
</ChatErrorBoundary>
```

## Integration Points

### Dashboard Integration

The chat widget integrates with the dashboard via:

```tsx
// Dashboard component
import { ChatWidget } from '@/app/chat';

function Dashboard() {
  return (
    <div className="dashboard">
      <SideNav />
      <MainContent />
      <ChatWidget /> {/* Chat widget added here */}
    </div>
  );
}
```

### Plan Switcher Integration

Plan switching is handled through events:

```typescript
// Lock plan switcher during chat
window.addEventListener('chat:started', lockPlanSwitcher);

// Unlock plan switcher when chat ends
window.addEventListener('chat:ended', unlockPlanSwitcher);
```
