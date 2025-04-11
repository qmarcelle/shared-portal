# BCBST Member Portal Chat Integration

## Overview

This implementation provides a comprehensive chat solution for the BCBST member portal, integrating with Genesys Cloud Chat while supporting plan switching, eligibility checks, and business hours management. The implementation follows the portal's authentication flow and seamlessly integrates with the existing dashboard functionality.

## Chat.js Integration Details

This implementation supports both Genesys Cloud Web Messaging and the legacy chat.js widget through a unified interface. The system automatically determines which chat implementation to use based on eligibility criteria:

1. **Widget Selection Logic**

   - Located in: `src/app/chat/config/genesys.config.ts` and `src/app/chat/hooks/useChat.ts`
   - The system checks `eligibility.cloudChatEligible` to determine which chat implementation to use
   - For cloud-eligible members: Uses Genesys Web Messaging API (modern implementation)
   - For non-cloud eligible members: Uses legacy chat.js implementation
   - Different script URLs are loaded based on this determination

2. **Script Loading Process**

   - The system dynamically loads the appropriate script:
     - Web Messaging: `https://apps.{region}.pure.cloud/widgets/web-messenger.js`
     - Legacy Chat.js: URL from `process.env.NEXT_PUBLIC_LEGACY_CHAT_URL`
   - Script loading is handled by the `loadScript` function in `genesys.config.ts`
   - Scripts are attached to the document head with proper error handling

3. **Event Handling Differences**
   - Web Messaging events: `conversationStarted`, `conversationEnded`, etc.
   - Legacy Chat.js events: `ChatStarted`, `ChatEnded`, `AgentJoined`, etc.
   - The `useChat` hook normalizes these differences to provide a consistent API

## API Integration

The chat implementation communicates with backend services through these key endpoints:

1. **Eligibility API**

   - Endpoint: `/api/chat/eligibility?memberId={memberId}&planId={planId}`
   - Purpose: Determines chat availability and the appropriate chat implementation
   - Implementation: `useChatEligibility` hook in `src/app/chat/hooks/useChatEligibility.ts`
   - Returns: Chat availability, cloud eligibility status, chat group, working hours

2. **Chat Info API**

   - Endpoint: `/api/chat/info`
   - Purpose: Retrieves configuration information for the chat widget
   - Implementation: `getChatInfo` method in `ChatService.ts`
   - Returns: Detailed configuration for the selected chat implementation

3. **Session Management APIs**

   - Start Chat: `POST /api/chat/start` (with payload containing member and plan information)
   - End Chat: `POST /api/chat/end`
   - Send Message: `POST /api/chat/message` (with text content)
   - Implementation: Methods in `ChatService.ts`

4. **Integration with Required Endpoints (ID: 21842)**
   - sendEmail: Implemented through `/api/memberservice/api/v1/contactusemail`
   - getPhoneAttributes: Implemented through `/api/OperationHours` with required parameters
   - getEmail: Implemented through `/api/memberContactPreference` with required parameters

## Requirements Implementation Map

### 1. Chat Data Management (ID: 31146, 31154)

#### Data Payload Management

- Location: `src/app/chat/services/ChatService.ts`
- Handles dynamic payload updates during plan switches
- Implements all required fields (SERV_Type, firstname, etc.)
- Validates payload integrity through TypeScript types

#### Eligibility Management

- Location: `src/app/chat/hooks/useChatEligibility.ts`
- Real-time eligibility checks during plan switches
- Visibility control based on plan eligibility
- Integration with plan-specific business rules

### 2. Chat Session Management (ID: 31156, 31158, 31159)

#### Business Hours

- Location: `src/app/chat/services/ChatService.ts`
- Dynamic business hours validation
- Plan-specific hour restrictions
- Out-of-hours notifications

#### Plan Switching Control

- Location: `src/app/chat/components/ChatWidget.tsx`
- Automatic locking during active sessions
- Hover message implementation
- Session state management

### 3. Backend Integration (ID: 21842)

#### API Integration

- Location: `src/app/chat/services/ChatService.ts`
- Implements all required endpoints:
  - sendEmail
  - getPhoneAttributes
  - getEmail
- Error handling and retry logic

### 4. User Interface Components

#### Start Chat Window (ID: 31161, 31164, 31166)

- Location: `src/app/chat/components/ChatWindow.tsx`
- Plan information display
- Dynamic UI based on plan count
- Plan switching integration

#### Active Chat Window (ID: 31295, 32072)

- Location: `src/app/chat/components/ChatWidget.tsx`
- Current plan display
- Adaptive UI for single/multiple plans
- Session state management

## Architecture

### Directory Structure

```
src/app/chat/
├── components/              # React components
│   ├── ChatWidget.tsx      # Main chat widget component
│   ├── ChatWindow.tsx      # Chat window implementation
│   ├── ChatTrigger.tsx     # Minimized chat icon
│   ├── PlanInfoHeader.tsx  # Plan information display
│   └── shared/             # Shared component utilities
├── hooks/                  # React hooks
│   └── useChat.ts          # Primary chat integration hook
├── services/               # Core services
│   └── ChatService.ts      # Chat service implementation
├── stores/                 # State management
│   └── chatStore.ts        # Chat state store
├── utils/                  # Utility functions
│   └── ...                 # Chat-specific utilities
├── types/                  # TypeScript type definitions
└── config/                 # Configuration files
    └── genesys.config.ts   # Genesys integration configuration
```

## Integration Flow

1. **Authentication Flow**

   - User logs in through Next.js AuthJS
   - Redirects to dashboard
   - Chat widget initializes with user context

2. **Chat Widget Lifecycle**

   - Minimized state shows chat icon (ChatTrigger.tsx)
   - Click triggers eligibility check
   - Opens chat window if eligible (ChatWindow.tsx)
   - Handles plan switching restrictions

3. **Plan Switching Integration**
   - Monitors plan selection changes
   - Updates chat payload
   - Manages session restrictions
   - Handles eligibility updates

## State Management

### Chat Store

```typescript
interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  currentPlan: PlanInfo;
  eligibility: EligibilityStatus;
  businessHours: BusinessHoursStatus;
  error: ChatError | null;
  messages: ChatMessage[];
  activeSession: boolean;
}
```

## Error Handling

Comprehensive error handling strategy:

1. **Connection Errors**

   - Retry logic with exponential backoff
   - User-friendly error messages
   - Automatic reconnection attempts

2. **Business Logic Errors**

   - Validation before state changes
   - Graceful degradation
   - Clear user feedback

3. **API Errors**
   - Request timeout handling
   - Response validation
   - Error recovery paths

## Testing Strategy

See `__tests__/README.md` for detailed testing documentation covering:

- Unit tests for all components
- Integration tests for chat flows
- E2E tests for critical paths
- Mock implementations
- Test coverage requirements

## Production Readiness Checklist

- [x] TypeScript strict mode enabled
- [x] Error boundaries implemented
- [x] Performance optimizations
- [x] Accessibility compliance
- [x] Security measures
- [x] Logging implementation
- [x] Analytics integration
- [x] Documentation complete

## Getting Started

1. **Installation**

   ```bash
   npm install
   ```

2. **Configuration**

   ```env
   NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID=your-id
   NEXT_PUBLIC_GENESYS_REGION=your-region
   NEXT_PUBLIC_LEGACY_CHAT_URL=your-legacy-chat-url
   ```

3. **Running Tests**

   ```bash
   npm test
   ```

4. **Local Development**
   ```bash
   npm run dev
   ```

## Contributing

1. Follow TypeScript strict mode
2. Ensure test coverage
3. Update documentation
4. Follow error handling patterns
5. Maintain accessibility
