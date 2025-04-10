# BCBST Member Portal Chat System Implementation

Based on Genesys chat.js integration, focusing on simplicity and maintainability.

## Directory Structure

```
src/app/chat/
├── components/
│   ├── ChatWidget.tsx        # Main chat component
│   └── PlanInfoHeader.tsx    # Plan info display
├── hooks/
│   ├── useChat.ts           # Main chat hook
│   └── useChatEligibility.ts # Eligibility check
└── config/
    └── genesysConfig.ts     # Basic configuration
```

## Core Implementation

### 1. ChatWidget Component

```typescript
interface ChatWidgetProps {
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onPlanSwitch: () => void;
}

// Simple component that handles chat display and plan switching
function ChatWidget(props: ChatWidgetProps) {
  const [isActive, setIsActive] = useState(false);
  const { eligibility } = useChatEligibility(props.memberId);

  // Rest of the implementation
}
```

### 2. useChat Hook

```typescript
function useChat(options: ChatOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simplified chat operations
  const startChat = useCallback(() => {
    // Direct Genesys chat.js integration
  }, []);

  // Rest of the implementation
}
```

## User Story Implementation

### Chat Initialization (31146)

- ✅ Basic payload with required fields
- ✅ Direct integration with chat.js

### Plan Switching (31158, 31159)

- ✅ Simple active state tracking
- ✅ Lock mechanism using local state

### UI Display (31166, 31295, 32072)

- ✅ Conditional rendering based on plan count
- ✅ Direct DOM manipulation for header info

### Eligibility (31154)

- ✅ Simple eligibility check
- ✅ Basic caching with useEffect

## Error Handling

```typescript
// Simple error handling
function handleChatError(error: Error) {
  console.error(error);
  // Show user-friendly message
}
```

## Testing Requirements

### Unit Tests

- ChatWidget component
- useChat hook
- Eligibility check

### Integration Tests

- Chat flow
- Plan switching
- Error cases

## Security

- JWT handling
- Basic data protection

## Accessibility

- Keyboard navigation
- Screen reader support
- ARIA labels

## Implementation Checklist

### Phase 1: Basic Chat

- [ ] Chat widget
- [ ] Eligibility check
- [ ] Error handling

### Phase 2: Plan Features

- [ ] Plan switching
- [ ] Plan info display
- [ ] Business hours

### Phase 3: Polish

- [ ] Accessibility
- [ ] Error messages
- [ ] Documentation
