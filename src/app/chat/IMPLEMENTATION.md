# BCBST Member Portal Chat System Implementation

## Core Components

### Chat Widgets

1. `src/app/chat/components/widgets/GenesysCloudChatWidget.tsx`

   - Main cloud-based chat widget implementation
   - Handles Genesys Cloud integration
   - Manages chat events and user data

2. `src/app/chat/components/widgets/CloudChatWidget.tsx`

   - Simplified cloud chat widget
   - Initializes Genesys Cloud chat
   - Manages user data and configuration

3. `src/app/chat/components/widgets/LegacyOnPremChatWidget.tsx`

   - Legacy on-premises chat implementation
   - Handles non-cloud eligible members
   - Manages chat events and configuration

4. `src/app/chat/components/core/ChatWidget.tsx`
   - Core chat widget wrapper
   - Manages chat state and UI
   - Handles plan switching and eligibility

## Services and Hooks

1. `src/app/chat/services/plan/PlanService.ts`

   - Manages plan-related functionality
   - Handles plan eligibility
   - Provides plan information

2. `src/app/chat/hooks/useChatEligibility.ts`

   - Custom hook for eligibility checks
   - Manages business hours
   - Handles plan switching locks

3. `src/app/chat/hooks/useChat.ts`
   - Main chat functionality hook
   - Manages chat state
   - Handles chat events

## Providers and Configuration

1. `src/app/chat/providers/ChatProviderFactory.tsx`

   - Factory for chat implementation
   - Determines cloud vs. on-prem
   - Loads appropriate scripts

2. `src/app/chat/config/widget.config.ts`
   - Widget configuration
   - Genesys settings
   - Chat UI configuration

## Documentation

1. `src/app/chat/docs/API_INTEGRATION.md`

   - API integration details
   - Error handling documentation
   - Integration patterns

2. `src/app/chat/README.md`
   - Implementation overview
   - Chat payload structure
   - Business hours format

## Tests

1. `src/app/chat/__tests__/components/core/GenesysChat.test.tsx`

   - Core chat component tests
   - Plan switching tests
   - Authentication tests

2. `src/app/chat/__tests__/components/core/GenesysWidget.test.tsx`
   - Widget functionality tests
   - Configuration tests
   - Event handling tests

## Types and Models

1. `src/app/chat/models/types.ts`

   - TypeScript interfaces
   - Chat-related types
   - Genesys types

2. `src/app/chat/models/errors.ts`
   - Error definitions
   - Error handling types
   - Error codes

## Stores

1. `src/app/chat/stores/chatStore.ts`
   - Chat state management
   - User session data
   - Chat configuration

## Additional Files

1. `src/app/chat/config/env.ts`

   - Environment configuration
   - API endpoints
   - Feature flags

2. `src/app/chat/services/api/index.ts`

   - API service implementation
   - Endpoint definitions
   - Request/response handling

3. `src/app/chat/services/utils/businessHours.ts`

   - Business hours utilities
   - Time zone handling
   - Hours formatting

4. `public/chat.js`

   - On-premises chat script
   - Legacy implementation
   - Chat initialization

5. `public/genesys-config.js`
   - Genesys configuration
   - Widget settings
   - Integration parameters

## Key Features Implementation Status

1. ✅ Chat Data Management

   - Chat payload structure

   ```typescript
   {
     "SERV_Type": "MemberPortal",
     "firstname": "...",
     "RoutingChatbotInteractionId": "...",
     "PLAN_ID": "...",
     "lastname": "...",
     "GROUP_ID": "...",
     "IDCardBotName": "...",
     "IsVisionEligible": true/false,
     "MEMBER_ID": "...",
     "coverage_eligibility": true/false,
     "INQ_TYPE": "...",
     "IsDentalEligible": true/false,
     "MEMBER_DOB": "...",
     "LOB": "...",
     "lob_group": "...",
     "IsMedicalEligibile": true/false,
     "Origin": "MemberPortal",
     "Source": "Web"
   }
   ```

   - Data validation
   - Error handling

2. ✅ Chat Session Management

   - Session initialization
   - Session cleanup
   - State management
   - Business hours format: `DAY_DAY_HOUR_HOUR`
     - Example: `M_F_8_6` (Monday to Friday, 8AM to 6PM)
     - Example: `S_S_24` (24/7 availability)

3. ✅ Backend Integration

   - Genesys Cloud integration via Web Messenger API
   - On-premises integration via legacy widget
   - API endpoints for:
     - Eligibility checks
     - Business hours
     - Chat session management
     - Plan switching

4. ✅ User Interface

   - Chat windows (start, active, end states)
   - Plan switching interface
   - Error messages and alerts
   - Loading states
   - Business hours notifications

5. ✅ Business Rules

   - Eligibility checks:
     - Plan-based eligibility
     - Business hours validation
     - User authentication
   - Plan switching rules:
     - Lock during active chat
     - Update chat data on switch
     - Multiple plan handling

6. ✅ Testing
   - Unit tests for components
   - Integration tests for:
     - Multi-plan scenarios
     - Business hours
     - Eligibility checks
   - Component tests for UI elements

## Integration Methods

### Cloud Integration

- Uses Genesys Web Messenger API
- Script: `https://apps.mypurecloud.com/widgets/9.0/webmessenger.js`
- Supports modern features:
  - File uploads
  - Emoji support
  - Typing indicators
  - Real-time updates

### On-Premises Integration

- Uses legacy widget from `/public/chat.js`
- Maintains compatibility with older systems
- Supports basic chat functionality:
  - Text messages
  - Basic formatting
  - Session management

## Error Handling

Common error codes and their meanings:

- `CHAT_START_ERROR`: Failed to start chat session
- `CHAT_END_ERROR`: Failed to end chat session
- `HOURS_CHECK_FAILED`: Failed to check business hours
- `ELIGIBILITY_CHECK_FAILED`: Failed to check eligibility
- `NETWORK_ERROR`: General network connectivity issues

## Security Considerations

1. Authentication

   - JWT-based authentication
   - Session management
   - Token refresh handling

2. Data Protection

   - Secure data transmission
   - PII handling
   - Session encryption

3. Access Control
   - Role-based access
   - Plan-specific permissions
   - Feature flags

## Performance Optimizations

1. Resource Loading

   - Async script loading
   - Dynamic imports
   - Code splitting

2. State Management

   - Efficient updates
   - Caching strategies
   - Memory management

3. Error Recovery
   - Automatic retries
   - Fallback mechanisms
   - Graceful degradation

## Accessibility Features

1. ARIA Support

   - Proper labeling
   - Role definitions
   - State announcements

2. Keyboard Navigation

   - Focus management
   - Shortcut keys
   - Tab order

3. Screen Reader Support
   - Descriptive text
   - Status updates
   - Error announcements

## Future Enhancements

1. Potential Improvements

   - Enhanced analytics
   - AI-powered routing
   - Multilingual support
   - Improved file handling

2. Planned Features
   - Video chat support
   - Co-browsing
   - Chat transcripts
   - Satisfaction surveys

## Deployment Considerations

1. Environment Setup

   - Configuration management
   - API endpoints
   - Feature flags

2. Monitoring

   - Error tracking
   - Performance metrics
   - Usage analytics

3. Maintenance
   - Version updates
   - Dependency management
   - Security patches
