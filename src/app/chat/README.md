# Genesys Chat System – `src/app/chat/` Directory Documentation

This is the canonical reference for the Genesys chat integration in the Member Portal, implemented under `src/app/@chat`. It covers architecture, directory structure, key files, integration flows (legacy vs. cloud), extensibility, and troubleshooting.

---

## 1. Directory & File Inventory

### 1.1 Components (`src/app/chat/components`)

| File Name                   | Responsibility / Functionality                                                     |
| --------------------------- | ---------------------------------------------------------------------------------- |
| **BusinessHoursBanner.tsx** | Displays open/closed status and hours banner.                                      |
| **ChatControls.tsx**        | Minimize, close, and other in-chat controls.                                       |
| **ChatErrorBoundary.tsx**   | Error boundary wrapper around chat UI.                                             |
| **ChatLoader.tsx**          | Orchestrates initial config load, eligibility, and renders pre‑chat or in‑chat UI. |
| **ChatPersistence.tsx**     | Persists chat state across reloads/unload warnings.                                |
| **ChatSession.tsx**         | Manages session lifecycle, agent typing indicator, and inactivity timeouts.        |
| **ChatProvider.tsx**        | (Deprecated/Not used)                                                              |
| **CloudChatWrapper.tsx**    | Minimal client wrapper for cloud mode. Does not load Genesys scripts.              |
| **LegacyChatWrapper.tsx**   | Injects legacy `click_to_chat.js`, `widgets.min.js/.css`—only in **legacy** mode.  |
| **PlanInfoHeader.tsx**      | Displays the selected plan's name and metadata in pre‑chat/active UI.              |
| **PlanSwitcherButton.tsx**  | "Switch Plan" button; disabled with tooltip during active chat.                    |
| **PreChatWindow.tsx**       | UI form/modal before chat start: plan info, T&C, start button.                     |
| **TermsAndConditions.tsx**  | Renders LOB‑specific T&C text based on `userData.LOB`.                             |

### 1.2 Services, Store & Utilities

| File Path                     | Responsibility                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| **services/ChatService.ts**   | Core chat API: `getChatInfo`, token/attributes update, open/close widget, reconnection, error handling. |
| **stores/chatStore.ts**       | Zustand store: state (eligibility, plan lock, messages), actions, config validation (Zod).              |
| **utils/chatUtils.ts**        | DOM helpers, CSS, chat settings, and utility functions.                                                 |
| **utils/errorHandler.ts**     | Centralized error formatting and logging utilities.                                                     |
| **schemas/genesys.schema.ts** | Zod schema for backend chat config; validates before store update.                                      |

### 1.3 Hooks (`src/app/chat/hooks`)

| File Name            | Responsibility                                              |
| -------------------- | ----------------------------------------------------------- |
| **useChatSetup.tsx** | Initializes chat settings and state in wrappers/components. |

### 1.4 Entrypoints & Routing

| File Name          | Role                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **ChatWidget.tsx** | Main entry point: sets up `window.chatSettings` and loads `click_to_chat.js`.               |
| **default.tsx**    | Server component: wraps `ChatWidget` in client context; renders nothing if unauthenticated. |
| **page.tsx**       | (Optional) client page for `/@chat` route if used directly.                                 |
| **route.ts**       | Next.js route handling API proxies or custom data endpoints for chat.                       |
| **loading.tsx**    | Suspense fallback UI while chat parallel route loads.                                       |
| **error.tsx**      | Error boundary UI for chat route failures.                                                  |

---

## 2. End‑to‑End Integration Flow

1. **Direct Component Integration** (`src/app/layout.tsx` or page components)

   - Import `ChatWidget` from `@/components/ChatWidget`
   - Include `<ChatWidget chatSettings={...} />` in your layout or page components
   - Preferably wrap with `<ChatErrorBoundary>` and `<Suspense>`
   - Component renders itself only when session is authenticated and user has a plan

2. **ChatWidget Usage**

   ```tsx
   import ChatWidget from '@/components/ChatWidget';
   import { ChatErrorBoundary } from '@/app/chat/components/ChatErrorBoundary';
   import { Suspense } from 'react';

   export default function Layout({ children }) {
     return (
       <>
         {children}
         <Suspense fallback={<div>Loading chat...</div>}>
           <ChatErrorBoundary>
             <ChatWidget chatSettings={/* aggregated settings */} />
           </ChatErrorBoundary>
         </Suspense>
       </>
     );
   }
   ```

3. **ChatWidget Initialization**

   - `ChatWidget` sets `window.chatSettings` and loads `click_to_chat.js` on mount
   - Populates store with eligibility, `userData`, `formInputs` as needed

4. **Mode Selection**

   - `chatStore.chatMode` set to `'cloud'` or `'legacy'` based on API
   - `ChatWidget` and store logic ensure correct mode and settings
   - `CloudChatWrapper` and `LegacyChatWrapper` are minimal wrappers for UI fallback only

5. **Asset Loading**

   - **Legacy**: `LegacyChatWrapper` loads `/assets/genesys/plugins/widgets.min.js`, `.css`, and `click_to_chat.js`
   - **Cloud**: All Genesys script loading is handled by `click_to_chat.js` (no scripts loaded in CloudChatWrapper)

6. **In‑Chat UX**

   - `ChatControls`, `ChatSession`, `BusinessHoursBanner`, and persistence handle live session, inactivity, and unload

---

## 3. Usage & Extension

- **Add chat to any page:** Import and include `<ChatWidget chatSettings={...} />` in your layout or specific pages
- **Customize UI:** Edit or override CSS in `/public/assets/genesys/plugins/*.css` or use Tailwind scoped overrides targeting `.cx-` classes
- **Extend logic:** Update `ChatService.ts` or add new hooks in `hooks/`
- **Validate config:** Adjust `genesys.schema.ts` if backend payload changes

---

## 4. Troubleshooting & Best Practices

- **Script Mix‑ups:** Only legacy code loads legacy assets; cloud path now isolated
- **Plan Switching:** Use `usePlanSwitcherLock` to enforce lock / tooltip patterns
- **Eligibility & Hours:** Confirm API returns correct flags and schema matches
- **Styling Overrides:** Scope overrides in global CSS with `.cx-webchat, .cx-webchat-chat-button { @apply ... }` using `!important` sparingly

---

## 5. Environment Variables & Chat Settings

### 5.1 Environment Variables

The following environment variables are used to configure Genesys chat integration. These should be set in your deployment environment (e.g., `.env.local`, CI/CD secrets, or cloud environment):

```env
NEXT_PUBLIC_GENESYS_DEPLOYMENT_KEY   # Genesys Cloud deployment key
NEXT_PUBLIC_GENESYS_ORG_GUID         # Genesys Cloud org GUID
NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT   # API endpoint for chat
NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT_TYPE # Type: 'legacy' or 'cloud'
NEXT_PUBLIC_GENESYS_WIDGET_URL       # URL for Genesys widget assets
NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL    # URL for Genesys bootstrap script
NODE_ENV                             # Standard Node.js environment
# (Other custom envs as needed for your deployment)
```

### 5.2 `window.chatSettings` Structure

Before loading `click_to_chat.js`, the following global object is set to control chat eligibility, member info, and endpoints:

```js
window.chatSettings = {
  isChatEligibleMember: 'true' | 'false',
  isChatAvailable: 'true' | 'false',
  isDemoMember: 'true' | 'false',
  chatGroup: string,
  formattedFirstName: string,
  memberLastName: string,
  clickToChatToken: string,
  clickToChatEndpoint: string, // API endpoint
  opsPhone: string,
  opsPhoneHours: string,
  chatHours: string,
  rawChatHours: string,
  isMedical: 'true' | 'false',
  isDental: 'true' | 'false',
  isVision: 'true' | 'false',
  retryCount: string | number,
  retryAccount: string,
};
```

---

## 6. Chat Flow Diagram (Mermaid)

Below is a comprehensive flowchart of the Genesys chat integration, including all chat settings and environment variables:

```mermaid
flowchart TD
    subgraph "Page Load / App Initialization"
        A1[User visits page with ChatWidget]
        A2[ChatWidget mounts]
        A3[chatStore loads eligibility/config via API]
        A4[chatMode set to 'legacy' or 'cloud']
    end

    subgraph "Legacy Mode (if selected)"
        B1[LegacyChatWrapper mounts]
        B2[Load widget-config.js]
        B3[Load widgets.min.js]
        B4[Initialize window.chatSettings]
        B5[Load click_to_chat.js]
        B6[Apply chat-fix.css]
        B7[Enable/Show Chat Button]
        B8[User clicks Chat Button]
        B9[window.openGenesysChat() called]
        B10[CXBus.command('WebChat.bootstrap')]
        B11[CXBus.command('WebChat.configure')]
        B12[CXBus.command('WebChat.open')]
        B13[Chat window appears, session starts]
    end

    subgraph "Cloud Mode (if selected)"
        C1[CloudChatWrapper mounts]
        C2[No script loading; click_to_chat.js handles Genesys Messenger]
        C3[Messenger button appears]
        C4[User clicks Messenger button]
        C5[Messenger chat window opens]
    end

    %% Connections
    A1 --> A2 --> A3 --> A4
    A4 -- 'legacy' --> B1
    B1 --> B2 --> B3 --> B4 --> B5 --> B6 --> B7
    B7 --> B8 --> B9 --> B10 --> B11 --> B12 --> B13
    A4 -- 'cloud' --> C1
    C1 --> C2 --> C3 --> C4 --> C5

    %% Chat Settings and Env Vars
    subgraph "window.chatSettings"
        S1[isChatEligibleMember]
        S2[isChatAvailable]
        S3[isDemoMember]
        S4[chatGroup]
        S5[formattedFirstName]
        S6[memberLastName]
        S7[clickToChatToken]
        S8[clickToChatEndpoint]
        S9[opsPhone]
        S10[opsPhoneHours]
        S11[chatHours]
        S12[rawChatHours]
        S13[isMedical]
        S14[isDental]
        S15[isVision]
        S16[retryCount]
        S17[retryAccount]
    end

    B4 --> S1
    B4 --> S2
    B4 --> S3
    B4 --> S4
    B4 --> S5
    B4 --> S6
    B4 --> S7
    B4 --> S8
    B4 --> S9
```
