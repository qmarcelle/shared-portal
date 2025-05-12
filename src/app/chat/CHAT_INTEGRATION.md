Here’s the full updated documentation with your functional requirements appended at the end under a new Requirements section:

# Genesys Chat System – `src/app/chat/` Directory Documentation

This document is the canonical reference for the Genesys chat integration in the Member Portal, as implemented in the `src/app/chat/` directory. It covers architecture, directory structure, key files, integration flows (legacy and cloud), extensibility, troubleshooting, and the full injection path from root layout to UI, including script/style loading from Genesys assets.

---

## File Inventory & Responsibilities

### Components

| File Name               | Size (bytes) | Responsibility / Functionality                                                                                                    |
| ----------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| BusinessHoursBanner.tsx | 531          | Displays chat business hours and open/closed status.                                                                              |
| ChatButton.tsx          |              | The custom ChatButton component and related CSS have been removed. The Genesys widget's native button is now used exclusively.    |
| ChatControls.tsx        | 1132         | UI controls for chat (minimize, close, etc.).                                                                                     |
| ChatErrorBoundary.tsx   | 1183         | Error boundary for chat UI, catches and displays errors.                                                                          |
| ChatLoader.tsx          | 12140        | Handles loading state, possibly with advanced logic or UI.                                                                        |
| ChatPersistence.tsx     | 2031         | Manages chat session persistence (e.g., localStorage/sessionStorage).                                                             |
| ChatSession.tsx         | 4108         | Manages the lifecycle of a chat session, possibly including reconnection.                                                         |
| ChatWidget.tsx          | 5930         | Main entry point: loads config, chooses legacy/cloud, renders wrappers, manages state.                                            |
| CloudChatWrapper.tsx    | 392          | Wrapper for Genesys Cloud Messenger (minimal logic).                                                                              |
| GenesysScript.tsx       | 6464         | Loads/configures Genesys Cloud Messenger scripts and styles, sets up global functions.                                            |
| LegacyChatWrapper.tsx   | 18418        | Handles legacy Genesys chat: loads scripts, sets up window globals, DOM customizations, advanced logging, debug tools, co-browse. |
| PlanInfoHeader.tsx      | 508          | Displays plan information in the chat UI.                                                                                         |
| PlanSwitcherButton.tsx  | 678          | Button/UI for switching plans during chat.                                                                                        |
| PreChatWindow.tsx       | 1693         | UI for pre-chat form or information.                                                                                              |
| TermsAndConditions.tsx  | 534          | Renders terms and conditions modal or section.                                                                                    |

### Services, Store, and Utilities

| File Name                 | Size (bytes) | Responsibility / Functionality                                                                                        |
| ------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| services/ChatService.ts   | 17279        | Core chat logic: session management, reconnection, API calls, cloud/legacy switching, error handling, plan switching. |
| stores/chatStore.ts       | 15023        | Zustand store: chat state, config validation (Zod), advanced logging, eligibility, plan switching, error state.       |
| utils/chatDomUtils.ts     | 9559         | DOM helpers: chat button, plan switcher, eligibility UI, header controls, event wiring, mutation observers.           |
| utils/businessHours.ts    | 3715         | Business hours calculation and formatting.                                                                            |
| utils/chatHours.ts        | 2484         | Chat hours logic, possibly for eligibility or display.                                                                |
| utils/errorHandler.ts     | 3646         | Centralized error handling utilities for chat.                                                                        |
| schemas/genesys.schema.ts | 1272         | Zod schema for config validation, utility for creating config from backend data.                                      |

### Hooks

| File Name                    | Size (bytes) | Responsibility / Functionality                               |
| ---------------------------- | ------------ | ------------------------------------------------------------ |
| hooks/useChatSession.ts      | 7824         | Custom hook for chat session state, effects, and lifecycle.  |
| hooks/usePlanSwitcherLock.ts | 937          | Custom hook for locking/unlocking plan switcher during chat. |

### Entrypoints

| File Name   | Size (bytes) | Responsibility / Functionality                           |
| ----------- | ------------ | -------------------------------------------------------- |
| default.tsx | 3229         | Entry for the chat parallel route. Renders `ChatWidget`. |

---

## End-to-End Integration Flow

### 1. **Injection in Root Layout (`src/app/layout.tsx`):**

- The chat system is injected as a **parallel route** in the root layout.
- Example (simplified):
  ```tsx
  import { ChatErrorBoundary } from './@chat/components/ChatErrorBoundary';
  import ChatLoading from './@chat/loading';
  // ...
  export default async function RootLayout({ children, chat }) {
    return (
      <html lang="en">
        <body>
          <ErrorBoundary>
            <SessionProvider session={session}>
              <ClientInitComponent />
              <SiteHeaderServerWrapper />
              <ClientLayout>
                {children}
                {/* Parallel route for chat */}
                {session?.user?.currUsr?.plan && (
                  <ChatErrorBoundary>
                    <Suspense fallback={<ChatLoading />}>{chat}</Suspense>
                  </ChatErrorBoundary>
                )}
              </ClientLayout>
              <Footer />
            </SessionProvider>
          </ErrorBoundary>
        </body>
      </html>
    );
  }
  ```

2. ClientLayout and ChatWidget
   • ClientLayout is the main app shell for client‐side features.
   • The chat UI is rendered as a child of ClientLayout.
   • The entrypoint in src/app/@chat (page.tsx or default.tsx) renders ChatWidget, which:
   • Loads config (eligibility, plan, etc.)
   • Chooses legacy vs cloud flow
   • Renders LegacyChatWrapper or CloudChatWrapper
   • Manages state, plan switch locking, error handling

3. Genesys Scripts & Styles
   • Assets served from public/assets/genesys/:
   • /click_to_chat.js
   • /plugins/widgets.min.js
   • /plugins/widgets.min.css
   • Loaded by:
   • LegacyChatWrapper.tsx (legacy assets only)
   • GenesysScript.tsx (cloud messenger only)

4. Flow Diagram

RootLayout
└─ ClientLayout
├─ [App children]
└─ [chat parallel route]
└─ default.tsx / page.tsx
└─ ChatWidget
├─ loadConfig()
├─ decide flow
├─ render wrapper
└─ manage state/hooks

⸻

Key Files & Responsibilities
• layout.tsx – injects chat as a parallel route
• ClientLayout.tsx – app shell
• default.tsx / page.tsx – entrypoint for @chat
• ChatWidget.tsx – main orchestration
• LegacyChatWrapper.tsx – legacy Genesys chat loader
• GenesysScript.tsx – Genesys Cloud Messenger loader
• public/assets/genesys/ – only supported Genesys JS/CSS assets

⸻

Usage & Extension
• To use chat:
• Ensure parallel route is configured.
• Place <ChatWidget/> in entrypoint.
• To extend:
• Update components in @chat/components/.
• Adjust ChatService.ts for logic changes.
• Add new hooks or utils under @chat/hooks and @chat/utils.
• To customize DOM:
• Use/extend chatDomUtils.ts.
• To validate config:
• Update genesys.schema.ts.

⸻

Troubleshooting
• Script loading issues – verify asset paths and CSP headers.
• Plan switching – ensure useChatEventHandlers and usePlanSwitcherLock are active.
• Eligibility – check /api/chat/info response, Zod schema.
• UI issues – extend chatDomUtils.ts or inject CSS overrides.

⸻

Contact & Maintenance
• All future dev/bugfix/support belongs in src/app/chat/.
• Keep this doc up‐to‐date as you refactor or extend.

⸻

Requirements

1. Chat Data Management

1.1 Chat Data Payload (ID: 31146)
• Payload must update when member changes plans.
• Required fields:
• SERV_Type
• firstname
• RoutingChatbotInteractionId
• PLAN_ID
• lastname
• GROUP_ID
• IDCardBotName
• IsVisionEligible
• MEMBER_ID
• coverage_eligibility
• INQ_TYPE
• IsDentalEligible
• MEMBER_DOB
• LOB
• lob_group
• IsMedicalEligibile
• Origin
• Source

1.2 Chat Eligibility (ID: 31154)
• Widget visibility determined by selected plan’s eligibility.
• Must appear only for chat‐eligible plans.
• Reassess eligibility on plan switch.

2. Chat Session Management

2.1 Business Hours Handling (ID: 31156)
• Show out‐of‐hours banner based on plan’s hours.
• Prevent new chats outside business hours.

2.2 Plan Switching Restrictions (ID: 31158)
• Lock plan switcher during active chat.
• Unlock when chat ends (member or agent).
• Lock persists while window is visible.

2.3 Plan Switching Messaging (ID: 31159)
• On hover when locked, show:
"End your chat session to switch plan information."

3. Backend Integration

3.1 API Integration (ID: 21842)
• POST /api/chat/sendEmail → MemberPortal_REST_Endpoint + /memberservice/api/v1/contactusemail
• GET /api/chat/getPhoneAttributes → IDCARD_MEMBER_SOA_ENDPOINT + OperationHours
• GET /api/chat/getEmail → MEMBER_PORTAL_SOA_ENDPOINT + /memberContactPreference

3.2 Error Handling
• On connection errors, show:
"There was an issue starting your chat session… please try again."
• Allow user to click "Ok" to return to chat start.

4. User Interface Requirements

4.1 Start Chat Window

4.1.1 Plan Info Display (ID: 31161)
• Show current plan in pre‐chat UI for multi‐plan members.
• Reflect selected plan accurately.

4.1.2 Plan Switching Option (ID: 31164)
• Offer "Switch Plan" before chat start.
• Clicking "Switch" closes chat window, opens plan switcher.

4.1.3 Single Plan Handling (ID: 31166)
• If only one plan: hide plan info & switch option.

4.2 Active Chat Window

4.2.1 Multi-Plan Display (ID: 31295)
• Show current plan at top for multi‐plan members.

4.2.2 Single Plan Display (ID: 32072)
• If only one plan: hide plan info.

4.3 Widget Display

4.3.1 Terms & Conditions (ID: 31157)
• T&C copy must match member's LOB.
• Update on plan switch across LOBs.

5. Test Scenarios
   • Multi‐plan variations (same/different LOBs, single plan).
   • Plan switching: before, during (blocked), after chat.
   • Business hours: in/out of hours per plan.
   • Eligibility: all/some/no plans eligible.

6. Integration Requirements

6.1 Plan Switcher Integration
• Chat must respond to plan changes.
• Active chat locks switcher.

6.2 Genesys Chat API Events
• Use proper events to lock/unlock switcher:
WebChat.opened, WebChat.closed, MessagingService.ready, etc.

7. Acceptance Criteria
   1. Payload refreshes on plan switch.
   2. Eligibility updates on plan switch.
   3. Business‐hours banner displays correctly.
   4. Correct T&C per LOB.
   5. Plan switcher locked during chat.
   6. Hover message shown when locked.
   7. Plan info UI rules for single vs multi plan.
   8. All error flows behave as specified.

⸻

This document is now both your architecture map and your functional spec in one place.

## Chat Button Styling

The chat button is now rendered exclusively by the Genesys widget. To customize its appearance, override the `.cx-webchat-chat-button` class in `src/styles/genesys-overrides.css`.

Example:

```css
.cx-webchat-chat-button {
  @apply bg-primary text-white rounded-full shadow-soft font-base;
}
```

No custom React button or CSS is needed.
