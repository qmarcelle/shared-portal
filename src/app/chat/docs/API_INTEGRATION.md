# BCBST Chat API Integration

## Overview

This document details the integration between our chat module and the BCBST Chat API, including both cloud-based Genesys and on-premises widget implementations.

## API Communication Flow

The integration follows this sequence:

1. **Eligibility Check**: Retrieve user's chat eligibility status
2. **Business Hours**: Check if chat is currently available
3. **Widget Type**: Determine if cloud or on-premises widget should be used
4. **Session Start**: Initialize chat session with appropriate payload
5. **Message Exchange**: Send/receive chat messages
6. **Session End**: Properly close the chat session

## Endpoints

### 1. Get Chat Eligibility Information

**Endpoint:** `GET /MemberServiceWeb/api/member/v1/members/:lookup/:memberId/chat/getChatInfo`

**Purpose:** Determines chat eligibility and configuration for a specific member.

**Path Parameters:**

- `lookup`: Method to identify the member (typically "byMemberCk")
- `memberId`: Member identifier value (e.g., memberCk)

**Headers:**

- `X-Portal-Login`: [Required] User login ID
- `Authorization`: Bearer token

**Response Example:**

```json
{
  "chatGroup": "Test_Chat",
  "workingHours": "M_F_8_6",
  "chatIDChatBotName": "speechstorm-chatbot",
  "chatBotEligibility": true,
  "routingChatBotEligibility": true,
  "chatAvailable": true,
  "cloudChatEligible": true
}
```

**Key Fields:**

- `cloudChatEligible`: Determines whether to use cloud or on-premises widget
- `chatAvailable`: Whether chat is currently available based on business hours
- `workingHours`: Business hours format (e.g., "M_F_8_6")

### 2. Get Cloud Chat Groups

**Endpoint:** `GET /MemberServiceWeb/api/member/v1/members/chat/cloudChatGroups`

**Purpose:** Retrieves available cloud chat groups configuration.

**Headers:**

- `X-Portal-Login`: [Required] User login ID
- `Authorization`: Bearer token

### 3. Email Communications

**Endpoint:** `POST /memberservice/api/v1/contactusemail`

**Purpose:** Sends email communication related to chat sessions.

**Request Format:**

```json
{
  "memberEmail": "user@example.com",
  "message": "Chat transcript",
  "category": "Chat",
  "contactNumber": "555-123-4567"
}
```

### 4. Phone Attributes

**Endpoint:** `GET /OperationHours`

**Purpose:** Retrieves phone operation hours and attributes.

**Query Parameters:**

- `groupId`: Group identifier
- `subscriberCk`: Subscriber check key
- `effectiveDetials`: Effective details parameter

## Business Hours Processing

### Format: `DAY_DAY_HOUR_HOUR`

- First segment: Starting day of the week
  - M = Monday, T = Tuesday, W = Wednesday, R = Thursday, F = Friday, S = Saturday, A = Sunday
- Second segment: Ending day of the week
- Third segment: Starting hour (in 24-hour format)
- Fourth segment: Ending hour (in 24-hour format)

### Examples:

- `M_F_8_6`: Monday to Friday, 8AM to 6PM
- `S_S_24`: Sunday to Saturday, 24 hours (all week)
- `M_F_9_17`: Monday to Friday, 9AM to 5PM

### Processing Logic:

```typescript
function parseWorkingHours(workingHours: string): BusinessHours {
  const parts = workingHours.split('_');

  if (parts.length === 4) {
    const [startDay, endDay, startHour, endHour] = parts;

    // Check for 24-hour availability
    if (endHour === '24') {
      return {
        isOpen24x7: true,
        days: getDaysOfWeek(startDay, endDay).map((day) => ({
          day,
          openTime: '00:00',
          closeTime: '24:00',
          isOpen: true,
        })),
        timezone: 'America/New_York',
        isCurrentlyOpen: true,
        lastUpdated: Date.now(),
        source: 'api' as const,
      };
    }

    // Regular hours...
  }
}
```

## Chat Data Payload

When integrating with the chat API, the following data payload must be constructed and updated when a member changes plans:

```typescript
interface ChatDataPayload {
  SERV_Type: string; // Service type
  firstname: string; // Member's first name
  RoutingChatbotInteractionId: string; // Routing identifier
  PLAN_ID: string; // Current plan ID
  lastname: string; // Member's last name
  GROUP_ID: string; // Group identifier
  IDCardBotName: string; // ID card bot name
  IsVisionEligible: boolean; // Vision eligibility
  MEMBER_ID: string; // Member identifier
  coverage_eligibility: boolean; // Coverage eligibility
  INQ_TYPE: string; // Inquiry type
  IsDentalEligible: boolean; // Dental eligibility
  MEMBER_DOB: string; // Member date of birth
  LOB: string; // Line of business
  lob_group: string; // Line of business group
  IsMedicalEligibile: boolean; // Medical eligibility
  Origin: 'MemberPortal'; // Origin of chat
  Source: 'Web'; // Source of chat
}
```

## Client Type Determination

The API uses specific client types for determining chat behavior:

### Client Types

- `BlueCare`: Code 'BC' - BlueCare member
- `BlueCarePlus`: Code 'DS' - BlueCare Plus member
- `CoverTN`: Code 'CT' - CoverTN member
- `CoverKids`: Code 'CK' - CoverKids member
- `SeniorCare`: Code 'BA' - Senior Care member
- `Individual`: Code 'INDV' - Individual member
- `BlueElite`: Code 'INDVMX' - Blue Elite member
- `Default`: Default member type

### Chat Types

- `BlueCareChat`: 'BlueCare_Chat' - For BlueCare members
- `SeniorCareChat`: 'SCD_Chat' - For Senior Care members
- `DefaultChat`: 'MBAChat' - For default members

## Error Handling

### API Response Errors

The API may return the following error responses:

- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Authentication issues
- `403 Forbidden`: Access permission issues
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side errors

### Error Handling in Code

Errors are captured using a custom `ChatError` class:

```typescript
export class ChatError extends Error {
  constructor(
    message: string,
    public code: ChatErrorCode,
    public severity: ErrorSeverity = 'error',
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ChatError';
  }
}
```

Common error codes include:

- `CHAT_START_ERROR`: Failed to start chat session
- `CHAT_END_ERROR`: Failed to end chat session
- `HOURS_CHECK_FAILED`: Failed to check business hours
- `ELIGIBILITY_CHECK_FAILED`: Failed to check eligibility
- `NETWORK_ERROR`: General network connectivity issues

## Genesys Integration

### Cloud Widget

For cloud-eligible members:

1. Load the cloud script: `https://apps.mypurecloud.com/widgets/9.0/webmessenger.js`
2. Configure with member-specific data
3. Use the Genesys Web Messenger API for interaction

### On-Premises Widget

For non-cloud-eligible members:

1. Load the on-premises script: `/chat.js`
2. Access via the `GenesysChat` global object
3. Use the legacy API for interaction:
   - `GenesysChat.openChat()`
   - `GenesysChat.closeChat()`
   - `GenesysChat.sendMessage(message)`

## Plan Switching Rules

1. Plan switcher must be locked during active chat sessions
2. Plan switcher must be unlocked when a chat session ends
3. Chat data payload must update when a member changes plans
4. For members with multiple plans, chat window must display which plan is being discussed

## Testing Tips

1. **Multi-Plan Testing**

   - Test members with multiple plans across same LOB
   - Test members with multiple plans across different LOBs
   - Test members with only one plan

2. **Business Hours Testing**

   - Test during business hours for all plans
   - Test outside business hours for some plans
   - Test outside business hours for all plans

3. **Eligibility Testing**

   - Test all plans chat-eligible
   - Test some plans chat-eligible
   - Test no plans chat-eligible

4. **Cloud vs. On-Prem Testing**
   - Test members eligible for cloud chat
   - Test members requiring on-premises chat
