# Genesys Chat System – Implementation Documentation (2024 Update)

This is the up-to-date reference for the Genesys chat integration in the Member Portal. It covers the architecture, config flow, file structure, validation, and best practices for both legacy and cloud modes.

---

## 1. Modern Architecture Overview

- **Single Source of Truth:** All chat config and state is managed in a Zustand store (`chatStore.ts`) organized by domains (UI, config, session, scripts).
- **Optimized Performance:** Store provides selectors for each domain to prevent unnecessary re-renders.
- **Centralized Configuration:** The store's `loadChatConfiguration` method handles all aspects of config building, including PBE consent verification.
- **Config Assembly:** The config is built from environment variables, API responses (`getChatInfo`), and user/plan context, then exposed as `genesysChatConfig` in the store and on `window.chatSettings`.
- **Config Validation:** Before any Genesys scripts load, the config is validated for all required fields (see `genesysChatConfig.ts`). Any missing or mismatched fields are logged in dev.
- **Simplified Components:** Components access store state/actions directly with no local state duplication.
- **Clean Initialization:** `ChatProvider` component handles one-time initialization with user/plan context.
- **Minimal Loader:** The `ChatWidget` component loads Genesys scripts only after config is ready and validated, sets all required globals, and handles both cloud and legacy modes.
- **No Legacy Fallbacks:** All legacy/duplicate config logic, props, and multi-fallback systems have been removed for clarity and maintainability.
- **Optimized Initialization:** One-time initialization with refs prevents infinite API request loops and ensures resources are loaded efficiently.
- **Cobrowse & Optional Features:** Cobrowse and other features are toggled via config fields and can be disabled for troubleshooting or by environment.

---

## 2. Key Files

| File Name                   | Location                      | Responsibility                                   |
| --------------------------- | ----------------------------- | ------------------------------------------------ |
| **chatStore.ts**            | src/app/chat/stores/          | Zustand store: config, state, actions, selectors |
| **ChatProvider.tsx**        | src/app/chat/components/      | Initializes store with user/plan context         |
| **ChatWidget.tsx**          | src/app/chat/components/      | Loads scripts, sets globals, renders chat root   |
| **ChatControls.tsx**        | src/app/chat/components/      | Provides UI controls using store state           |
| **GenesysScriptLoader.tsx** | src/app/chat/components/      | Handles script loading with lifecycle events     |
| **useUserContext.ts**       | src/app/chat/hooks/           | Session-based user context hook                  |
| **usePlanContext.ts**       | src/app/chat/hooks/           | Session-based plan context hook                  |
| **genesysChatConfig.ts**    | src/app/chat/                 | Config builder, DTO, type safety, validation     |
| **endpoints.ts**            | src/app/chat/config/          | Centralizes endpoint construction from .env      |
| **click_to_chat.js**        | public/assets/genesys/        | Genesys widget logic (legacy/cloud)              |
| **getChatInfo**             | src/app/api/chat/getChatInfo/ | API endpoint for chat config                     |

---

## 3. Integration Flow (2024)

1. **Session Access & Context**

   - `ChatProvider` component initializes the chat store when mounted.
   - `useUserContext` and `usePlanContext` hooks extract user and plan data from NextAuth session.
   - Context follows the session structure: `session.user.currUsr.plan.memCk` for member ID and `session.user.currUsr.plan.grpId` for plan ID.

2. **Config Fetch & Assembly**

   - The `loadChatConfiguration` method in the store fetches user/plan context, chat token, PBE consent data, and chat info from APIs.
   - The config is built from these sources and environment variables using `buildGenesysChatConfig` in `genesysChatConfig.ts`.
   - All required fields (see `GenesysChatConfig` interface) are validated for presence and type. Missing or mismatched fields are logged in dev.
   - The config is mapped to the exact structure expected by `click_to_chat.js` and set on `window.chatSettings`.

3. **Widget Loading**

   - `ChatWidget` only renders `GenesysScriptLoader` after `genesysChatConfig` is ready and validated.
   - All required globals (`window.chatSettings`, `window.gmsServicesConfig`) are set before any Genesys scripts are loaded.
   - CSS is loaded first, then `click_to_chat.js`, then (for legacy) `widgets.min.js`.
   - The widget automatically handles both cloud and legacy modes based on config.

4. **Component Integration**

   - Components like `ChatControls` access store state through optimized selectors and trigger actions directly.
   - UI components are lightweight with minimal props, deriving state directly from the store.
   - Event listeners for chat events are centralized in the `ChatWidget` component.

5. **Cobrowse & Optional Features**
   - Cobrowse and other features are toggled via config fields (e.g., `isCobrowseActive`).
   - These can be disabled for troubleshooting or by environment.

---

## 4. Environment Variables & API Parity

- All sensitive and environment-specific values (base URLs, bot IDs, org IDs, etc.) are set in `.env` files and referenced in `endpoints.ts` for endpoint construction.
- The API (`getChatInfo`) must return all required fields as defined in `GenesysChatConfig`.
- The config builder (`genesysChatConfig.ts`) ensures that all fields are present and mapped to the names/structure expected by `click_to_chat.js`.
- **Parity is critical:** If any required field is missing or mismatched, the widget may fail to load or behave unexpectedly.

---

## 5. Example: How to Integrate

```tsx
// In your page or component
import { ChatProvider, ChatWidget, ChatControls } from '@/app/chat/components';

export default function YourComponent() {
  return (
    <ChatProvider>
      {/* Chat Controls - Opens and closes the chat */}
      <ChatControls
        buttonText="Need Help?"
        className="your-custom-button-class"
      />

      {/* Chat Widget - Renders the actual chat container */}
      <ChatWidget
        containerId="your-chat-container-id"
        hideCoBrowse={true}
        onChatOpened={() => console.log('Chat opened')}
        onChatClosed={() => console.log('Chat closed')}
      />
    </ChatProvider>
  );
}
```

---

## 6. Config Validation & Mapping

- The config builder (`buildGenesysChatConfig`) validates all required fields for presence and type.
- If any required field is missing, a detailed error is logged in dev.
- The config is mapped to the exact structure expected by `click_to_chat.js` (see both the interface and the script for field names).
- Optional features (like cobrowse) are toggled via config fields and can be omitted or set to false/empty as needed.
- **Best Practice:** Always inspect `window.chatSettings` in the browser before loading Genesys scripts to confirm all required fields are present and correct.

---

## 7. Accessing Chat Store

For components that need to access chat state or actions directly:

```tsx
import {
  chatUISelectors,
  chatConfigSelectors,
  chatSessionSelectors,
  useChatStore,
} from '@/app/chat/stores/chatStore';

function YourComponent() {
  // Get state using selectors for optimized rendering
  const isOpen = useChatStore(chatUISelectors.isOpen);
  const isLoading = useChatStore(chatConfigSelectors.isLoading);
  const messages = useChatStore(chatSessionSelectors.messages);

  // Get actions directly
  const { setOpen, addMessage } = useChatStore((state) => state.actions);

  // Use state and actions in your component
  return (
    <div>
      <button onClick={() => setOpen(!isOpen)}>
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </button>

      {isLoading ? <div>Loading chat...</div> : <div>Chat is ready</div>}

      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.sender}: {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 8. Troubleshooting

- **Button not appearing:** Check for script errors, ensure config is ready and validated before widget loads.
- **Wrong mode:** Ensure `chatMode` and all required fields are set in config.
- **Environment mismatch:** Check that all endpoints and IDs are set from the correct `.env` for your environment.
- **Infinite API calls:** Check if initialization logic is being triggered multiple times in `ChatProvider`.
- **Session data missing:** Verify session structure and ensure `useUserContext` and `usePlanContext` are correctly accessing session data.
- **Config field mismatch:** If the widget fails to load or behaves unexpectedly, inspect `window.chatSettings` and compare to `GenesysChatConfig` and `click_to_chat.js` for missing or mismatched fields.
- **Store state issues:** Use Redux DevTools to inspect Zustand store state and action dispatches.

---

## 9. Updating Genesys Integration

- Update `.env` for new endpoints or IDs.
- Update `endpoints.ts` if endpoint construction logic changes.
- Update `genesysChatConfig.ts` for new config fields or mapping.
- Update `getChatInfo` API to ensure all required fields are returned.
- Test both cloud and legacy modes after any update.
- Ensure any changes maintain the one-time initialization and config validation pattern.

---

## 10. Detailed Architecture Diagram

```mermaid
graph TD
    %% Main Components
    AppEntry[App Entry Point] --> ChatProvider

    %% Core Components
    subgraph Components
        ChatProvider[ChatProvider.tsx\nInitializes store with context]
        ChatWidget[ChatWidget.tsx\nRenders chat container and loads scripts]
        ChatControls[ChatControls.tsx\nUI controls for chat]
        ScriptLoader[GenesysScriptLoader.tsx\nLoads Genesys scripts]
        ChatExample[ChatExample.tsx\nExample implementation]
        ErrorBoundary[ChatErrorBoundary.tsx\nHandles errors]
        StatusComponents[StatusComponents.tsx\nStatus indicators]
    end

    %% Hooks
    subgraph Hooks
        UserContext[useUserContext.ts\nGets user from session]
        PlanContext[usePlanContext.ts\nGets plan from session]
    end

    %% Store
    subgraph Store
        ChatStore[chatStore.ts\nZustand store with domains:\nUI, config, session, scripts]

        subgraph Selectors
            UISelectors[chatUISelectors\nisOpen, isMinimized, etc]
            ConfigSelectors[chatConfigSelectors\nisLoading, error, config, etc]
            SessionSelectors[chatSessionSelectors\nisChatActive, messages, etc]
            ScriptSelectors[chatScriptSelectors\nscriptLoadPhase]
        end

        subgraph Actions
            UIActions[UI Actions\nsetOpen, minimizeChat, etc]
            ConfigActions[Config Actions\nloadChatConfiguration, setError, etc]
            SessionActions[Session Actions\naddMessage, setChatActive, etc]
            ScriptActions[Script Actions\nsetScriptLoadPhase]
        end
    end

    %% Config and Types
    subgraph Configuration
        ConfigBuilder[genesysChatConfig.ts\nBuilds and validates config]
        Endpoints[endpoints.ts\nEndpoint construction]
        GenesysSchema[genesys.schema.ts\nSchema definitions]
    end

    subgraph Types
        ScriptPhase[ScriptLoadPhase.ts\nEnum for script load phases]
        ChatTypes[Types for chat components]
    end

    %% Services and APIs
    subgraph Services
        ChatService[chat.service.ts\nAPI client functions]
    end

    subgraph APIs
        GetChatInfo[getChatInfo API\nReturns chat configuration]
        GetChatToken[token API\nReturns auth token]
    end

    %% External Resources
    subgraph External
        ClickToChat[click_to_chat.js\nGenesys widget logic]
        WidgetsJS[widgets.min.js\nLegacy widget code]
        GenesysCSS[genesys.css\nWidget styles]
    end

    %% Relationships and data flow

    %% Provider and context relationships
    ChatProvider --> UserContext
    ChatProvider --> PlanContext
    ChatProvider --> ChatStore

    %% Store to components
    ChatStore --> ChatWidget
    ChatStore --> ChatControls

    %% Component relationships
    ChatWidget --> ScriptLoader
    ChatWidget --> ErrorBoundary
    ChatWidget --> StatusComponents
    ChatExample --> ChatProvider
    ChatExample --> ChatWidget
    ChatExample --> ChatControls

    %% Store internals
    ChatStore --> UISelectors
    ChatStore --> ConfigSelectors
    ChatStore --> SessionSelectors
    ChatStore --> ScriptSelectors
    ChatStore --> UIActions
    ChatStore --> ConfigActions
    ChatStore --> SessionActions
    ChatStore --> ScriptActions

    %% Configuration flow
    ConfigActions --> ConfigBuilder
    ConfigBuilder --> Endpoints
    ConfigBuilder --> GenesysSchema
    ConfigBuilder --> ChatStore

    %% API relationships
    ConfigActions --> GetChatInfo
    ConfigActions --> GetChatToken
    ChatService --> GetChatInfo
    ChatService --> GetChatToken

    %% Script loading
    ScriptLoader --> External
    ScriptLoader --> ScriptActions

    %% Type relationships
    ScriptPhase --> ChatStore
    ChatTypes --> Components

    %% Styling
    style ChatStore fill:#f9f,stroke:#333,stroke-width:2px
    style ChatProvider fill:#bbf,stroke:#333,stroke-width:2px
    style ConfigBuilder fill:#fb9,stroke:#333,stroke-width:2px
    style ScriptLoader fill:#bfb,stroke:#333,stroke-width:2px

    %% Flow Descriptions
    classDef flow-description fill:#f5f5f5,stroke:#ccc,stroke-width:1px,color:#666

    Flow1[1. Initialize\nChatProvider mounts\nand initializes store]:::flow-description
    Flow2[2. Load Configuration\nStore fetches user/plan data,\nPBE consent, and chat info]:::flow-description
    Flow3[3. Build Config\nConfig is built and validated\nwith all required fields]:::flow-description
    Flow4[4. Load Scripts\nGenesysScriptLoader loads\nscripts based on config]:::flow-description
    Flow5[5. Widget Ready\nGenesys widget initialized\nand ready for user]:::flow-description

    ChatProvider --> Flow1
    Flow1 --> ConfigActions
    ConfigActions --> Flow2
    Flow2 --> ConfigBuilder
    ConfigBuilder --> Flow3
    Flow3 --> ChatWidget
    ChatWidget --> ScriptLoader
    ScriptLoader --> Flow4
    Flow4 --> External
    External --> Flow5
```

---

## 11. Eliminated Redundancies

In this refactored implementation, the following redundancies have been eliminated:

- **Duplicate State Management**: Removed local state in components that duplicated store functionality
- **Multiple Config Builders**: Consolidated config building into a single function in the store
- **Redundant API Calls**: Eliminated multiple hooks making the same API calls
- **Duplicated Initialization Logic**: Centralized in ChatProvider component
- **Removed Hooks**: Deprecated redundant hooks (useChatConfig, usePBEData, useChatContext)
- **Simplified Component Props**: Components now derive state directly from store

This architecture is robust, maintainable, fully aligned with Genesys best practices, and optimized for performance.
