# BCBST Member Portal Chat Integration

## Overview

A unified chat solution that automatically selects between the on-prem Genesys legacy widget and the Genesys Cloud Web Messenger based on member eligibility. Built on Next.js 14 App Router, Zustand for state, and declarative `<Script>` loads—no manual DOM hacks.

## File Structure

src/
├─ app/
│ └─ chat/
│ ├─ layout.tsx # Server layout that mounts ChatLoader
│ ├─ page.tsx # Chat page wrapper
│ ├─ components/
│ │ ├─ ChatLoader.tsx # Orchestrates config load, event hooks, UI
│ │ ├─ ChatWidget.tsx # Launcher button + plan-lock chrome
│ │ ├─ LegacyChatWrapper.tsx # <Script> + config for legacy widget
│ │ ├─ CloudChatWrapper.tsx # <Script> + init for Cloud Messenger
│ │ ├─ PlanInfoHeader.tsx # Displays current plan info
│ │ ├─ PlanSwitcherButton.tsx # “Switch Plan” button
│ │ ├─ TermsAndConditions.tsx # LOB-specific T&C copy
│ │ ├─ BusinessHoursBanner.tsx# Out-of-hours notification
│ │ ├─ ChatControls.tsx # Minimize/maximize/close buttons
│ │ ├─ ChatSession.tsx # Typing indicator & inactivity timeout
│ │ └─ ChatPersistence.tsx # Warn on unload, auto-minimize
│ └─ hooks/
│ ├─ useChatEventHandlers.ts # Subscribes CXBus & Messenger events
│ └─ usePlanSwitcherLock.ts # Locks/unlocks plan switcher UI
├─ stores/
│ └─ chatStore.ts # Zustand store: payload, state, actions
│ └─ planStore.ts # Zustand store: plans, selection, lock
├─ schemas/
│ └─ genesys.schema.ts # Zod schema for widget config
├─ types/
│ ├─ ChatError.ts # Domain‐specific ChatError class
│ ├─ ChatInfoResponse.ts # API response interface for /api/chat/info
│ └─ ChatDataPayload.ts # Payload interface for startChat
├─ utils/
│ └─ api/
│ ├─ memberService.ts # Axios instance + interceptors
│ └─ ChatService.ts # getChatInfo(), sendEmail, etc.
└─ app/
└─ api/
└─ chat/ # Next.js API routes
├─ chat-info/route.ts # GET /api/chat/info
├─ sendEmail/route.ts # POST /api/chat/sendEmail
├─ getPhoneAttributes/route.ts
└─ getEmail/route.ts
.env.local # NEXT_PUBLIC_GENESYS_CHAT_URL, CHAT_MODE_URL, etc.

## Installation & Setup

1. **Install**

   ```bash
   npm install zustand zod axios

   	2.	Copy your legacy assets into
   public/assets/genesys/widgets.min.js
   and any override CSS under public/assets/genesys/.
   	3.	Configure your environment variables in .env.local:
   ```

NEXT_PUBLIC_GENESYS_CHAT_URL=…
CHAT_MODE_URL=…
NEXT_PUBLIC_GC_ENV=…
NEXT_PUBLIC_GC_ORG_ID=…
NEXT_PUBLIC_GC_DEPLOYMENT_KEY=…
NEXT_PUBLIC_GC_QUEUE=…
PORTAL_SERVICES_URL=…
MEMBERSERVICE_CONTEXT_ROOT=…
IDCARDSERVICE_CONTEXT_ROOT=…
NEXT_PUBLIC_MEMBER_PORTAL_SOA_ENDPOINT=…

    4.	Run your dev server:

npm run dev

Usage

Mounting the Chat

In your app’s route:

// src/app/chat/layout.tsx
import ChatLoader from '@/app/chat/components/ChatLoader';
export default function ChatLayout({ children, params }) {
const memberId = Number(params.memberId);
const planId = params.planId;
return (
<>
<ChatLoader memberId={memberId} planId={planId} />
{children}
</>
);
}

// src/app/chat/page.tsx
export default function ChatPage() {
return (
<main className="p-4">
<h1 className="text-xl font-bold">Member Chat</h1>
<p>Click “Start Chat” above to connect.</p>
</main>
);
}

Core Flow 1. ChatLoader calls loadChatConfiguration(memberId, planId) on mount. 2. ChatLoader invokes useChatEventHandlers() to wire CXBus/Messenger events → store. 3. ChatLoader renders <ChatWidget> with:
• Pre-chat UI (PlanInfoHeader, PlanSwitcherButton, TermsAndConditions, Start Chat)
• Widget injection via <LegacyChatWrapper> or <CloudChatWrapper>
• In-chat UI (BusinessHoursBanner, ChatControls, ChatSession) 4. usePlanSwitcherLock locks/unlocks your plan switcher based on isChatActive. 5. All global state and actions live in chatStore.ts; plans live in planStore.ts.

API Routes
• GET /api/chat/info → returns ChatInfoResponse with eligibility, LOB, hours, routing.
• POST /api/chat/sendEmail → proxies to member service email endpoint.
• GET /api/chat/getPhoneAttributes → proxies to SOA OperationHours.
• GET /api/chat/getEmail → proxies to memberContactPreference.

Testing
• Unit tests for each component, hook, and store action.
• Integration tests covering:
• Legacy vs. Cloud flows
• Plan switching lock/unlock
• Business-hours banner
• Payload data refresh on plan swap
• Mock the /api/chat/info response to simulate different eligibility scenarios.

Troubleshooting
• Widget fails to load → verify asset URLs in public/assets/genesys and CSP headers.
• CORS errors → ensure NEXT_PUBLIC_GENESYS_CHAT_URL and CHAT_MODE_URL allow localhost or use a proxy route.
• Plan switcher not locking → confirm useChatEventHandlers is mounted and ChatControls dispatches startChat/endChat.
• Missing payload fields → check loadChatConfiguration maps all required fields into userData and formInputs.

⸻

This document reflects the final, production-ready implementation. All legacy DOM utilities have been replaced by Next.js <Script> wrappers and airtight state management.
