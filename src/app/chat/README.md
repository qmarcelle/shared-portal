# BCBST Member Portal Chat Implementation

## Overview

This implementation integrates Genesys `chat.js` while providing custom functionality for BCBST-specific requirements. We maintain a balance between using native Genesys features and implementing custom behavior where needed.

## Directory Structure

````
src/app/chat/
├── components/              # UI components
│   ├── ChatWidget.tsx      # Main widget component
│   └── PlanInfoHeader.tsx  # Custom plan info display
├── hooks/                  # React hooks
│   ├── useChat.ts         # Main chat integration hook
│   └── useChatEligibility.ts # Eligibility check
├── services/              # Core services
│   └── ChatService.ts    # Chat service wrapper
├── schemas/              # Validation schemas
│   ├── user.ts          # User/chat data validation
│   └── config.ts        # Configuration validation
└── config/              # Configuration
    └── genesys.ts      # Genesys configuration

## Integration with chat.js

### Native Features Used

1. **Core Chat Functions**
   ```typescript
   // Using native Genesys chat initialization
   window.CXBus.command('WebChat.open')
   window.CXBus.command('WebChat.startChat')
   window.CXBus.command('WebChat.close')
````

2. **Event Handling**

   ```typescript
   // Using native Genesys events
   window.CXBus.subscribe('WebChat.opened');
   window.CXBus.subscribe('WebChat.ended');
   window.CXBus.subscribe('WebChat.error');
   ```

3. **Business Hours**
   ```typescript
   // Using Genesys native business hours
   window.CXBus.command('WebChat.open', {
     data: { useNativeBusinessHours: true },
   });
   ```

### Custom Implementations

1. **Plan Switching (31158, 31159)**

   ```typescript
   // Custom implementation for plan switching
   const handlePlanSwitch = () => {
     if (isChatActive) {
       showWarningModal();
     } else {
       onPlanSwitch();
     }
   };
   ```

2. **Plan Info Display (31161, 31164)**

   ```typescript
   // Custom header extension
   window.CXBus.command('WebChat.registerHeaderExtension', {
     name: 'planInfoExtension',
     template: customPlanTemplate,
   });
   ```

3. **Eligibility Check (31154)**

   ```typescript
   // Custom eligibility service
   const checkEligibility = async () => {
     const response = await fetch('/api/chat/eligibility');
     return validateEligibility(response.data);
   };
   ```

4. **Chat Payload Enhancement (31146)**
   ```typescript
   // Enhanced chat payload with BCBST-specific fields
   const enhancedPayload = {
     ...defaultPayload,
     PLAN_ID: planId,
     memberStatus: eligibility.status,
     planEffectiveDate: plan.effectiveDate,
   };
   ```

## Key Customizations

1. **Plan Management**

   - Custom plan switching logic
   - Plan-specific chat routing
   - Plan context persistence
   - Multi-plan UI adaptations

2. **Eligibility**

   - Custom eligibility checks
   - Cache management
   - Business rules enforcement
   - Error handling

3. **UI Enhancements**

   - Custom plan info header
   - Warning modals
   - Business hours display
   - Accessibility improvements

4. **State Management**
   - Chat session tracking
   - Plan state synchronization
   - Error state handling
   - Loading states

## User Stories Implementation

### 1. Chat Initialization (31146)

- ✅ Uses: Native chat.js initialization
- 🔧 Custom: Enhanced payload with plan data

### 2. Eligibility (31154)

- ✅ Uses: Native availability checks
- 🔧 Custom: BCBST eligibility rules

### 3. Business Hours (31156)

- ✅ Uses: Native business hours
- 🔧 Custom: Timezone handling

### 4. Terms & Conditions (31157)

- ✅ Uses: Native T&C display
- 🔧 Custom: LOB-specific content

### 5. Plan Switching (31158, 31159)

- ❌ No native support
- 🔧 Custom: Full implementation

### 6. Plan Info (31161, 31164)

- ✅ Uses: Native header extensions
- 🔧 Custom: Plan info display

### 7. Multiple Plans (31295)

- ❌ No native support
- 🔧 Custom: Full implementation

### 8. API Integration (21842)

- ✅ Uses: Native API structure
- 🔧 Custom: BCBST endpoints

## Configuration

```typescript
interface GenesysConfig {
  // Native Genesys options
  deploymentId: string;
  region: string;

  // Custom BCBST options
  businessHours: BusinessHours;
  planSwitching: PlanSwitchConfig;
}
```

## Error Handling

1. **Native Errors**

   - Network issues
   - Script loading
   - Chat disconnections

2. **Custom Error Handling**
   - Eligibility failures
   - Plan switching errors
   - Business hours transitions

## Testing

1. **Integration Tests**

   - Chat initialization
   - Plan switching
   - Eligibility checks

2. **Unit Tests**
   - Custom components
   - Hooks
   - Services

## Usage Example

```typescript
function ChatContainer() {
  const { startChat, endChat } = useChat({
    planId: 'PLAN123',
    memberId: 'MEM456',
  });

  // Implementation
}
```
