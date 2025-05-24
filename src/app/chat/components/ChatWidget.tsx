'use client';

/**
 * @file ChatWidget.tsx
 * @description This component is the main UI/UX orchestrator for the Genesys chat.
 * It loads the appropriate Genesys script (legacy or cloud) based on configuration,
 * subscribes to Genesys events to update application state via chatStore,
 * and renders auxiliary UI like error modals.
 */

import { MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { logger } from '@/utils/logger';

import { useChatStore } from '../stores/chatStore';
// Corrected import for ScriptLoadPhase: it's used as a value.
import type {
  CloudChatConfig,
  GenesysChat,
  GenesysCXBus,
  LegacyChatConfig,
} from '../types/chat-types';
import { ScriptLoadPhase } from '../types/chat-types';
import { ChatErrorDialog } from './ChatErrorDialog';
import GenesysCloudLoader from './GenesysCloudLoader';
import GenesysScriptLoader from './GenesysScriptLoader';
import { PreChatModal } from './PreChatModal';

const GENESYS_BUTTON_SELECTORS = [
  '.cx-widget.cx-webchat-chat-button',
  'button[data-testid="messenger-button"]',
  // Add other selectors for different Genesys button versions if necessary
];

interface ChatWidgetProps {
  containerId?: string;
  showLoaderStatus?: boolean;
  forceFallbackButton?: boolean;
}

// Helper function to determine and render the correct script loader
function _getLoaderComponent(
  shouldAttemptScriptLoading: boolean,
  chatMode: 'legacy' | 'cloud' | undefined,
  isChatEnabled: boolean,
  activeLegacyConfig: LegacyChatConfig | undefined,
  activeCloudConfig: CloudChatConfig | undefined,
  showLoaderStatus: boolean | undefined,
  handleScriptLoadSuccess: () => void,
  handleScriptLoadError: (error: Error) => void,
): JSX.Element | null {
  if (!shouldAttemptScriptLoading) {
    return showLoaderStatus ? <div>Config loading...</div> : null;
  }

  if (chatMode === 'legacy') {
    if (!activeLegacyConfig) {
      logger.warn(
        `[ChatWidget] Render: Legacy mode, but activeLegacyConfig is missing.`,
      );
      return showLoaderStatus ? <div>Legacy config not ready...</div> : null;
    }
    return (
      <GenesysScriptLoader
        legacyConfig={activeLegacyConfig}
        isChatActuallyEnabled={isChatEnabled}
        onLoad={handleScriptLoadSuccess}
        onError={handleScriptLoadError}
        showStatus={showLoaderStatus}
        chatMode="legacy"
      />
    );
  } else if (chatMode === 'cloud') {
    if (!activeCloudConfig) {
      logger.warn(
        `[ChatWidget] Render: Cloud mode, but activeCloudConfig is missing.`,
      );
      return showLoaderStatus ? <div>Cloud config not ready...</div> : null;
    }
    // Ensure userData values are strings as per typical Genesys requirements
    const transformedCloudConfig = {
      ...activeCloudConfig,
      userData: activeCloudConfig.userData
        ? Object.fromEntries(
            Object.entries(activeCloudConfig.userData).map(([key, value]) => [
              key,
              String(value),
            ]),
          )
        : undefined,
    };
    return (
      <GenesysCloudLoader
        {...transformedCloudConfig}
        isChatActuallyEnabled={isChatEnabled}
        onLoad={handleScriptLoadSuccess}
        onError={handleScriptLoadError}
      />
    );
  } else {
    logger.warn(
      `[ChatWidget] Render: Unknown or unsupported chatMode: ${chatMode}`,
    );
    return showLoaderStatus ? <div>Unknown chat mode: {chatMode}</div> : null;
  }
}

export default function ChatWidget({
  containerId = 'genesys-chat-container',
  showLoaderStatus = false,
  forceFallbackButton = false,
}: ChatWidgetProps) {
  const [showChatErrorModal, setShowChatErrorModal] = useState(false);
  const [showFallbackButtonJSXState, setShowFallbackButtonJSXState] =
    useState(false);

  const storeActions = useChatStore((state) => state.actions);
  const { openPreChatModal, closePreChatModal } = storeActions;

  const buttonState = useChatStore((state) => state.ui.buttonState);
  const isPreChatModalOpen = useChatStore(
    (state) => state.ui.isPreChatModalOpen,
  );

  const chatMode = useChatStore(
    (state) => state.config.genesysChatConfig?.chatMode,
  );
  const genesysChatConfigFull = useChatStore(
    (state) => state.config.genesysChatConfig,
  );
  const isLoadingConfig = useChatStore((state) => state.config.isLoading);
  const configError = useChatStore((state) => state.config.error);
  const isChatEnabled = useChatStore(
    (state) =>
      state.config.genesysChatConfig?.isChatEligibleMember === true &&
      state.config.genesysChatConfig?.isChatAvailable === true,
  );

  const isChatActive = useChatStore((state) => state.session.isChatActive);
  const standardErrorMessage = useChatStore(
    (state) => state.session.standardErrorMessage,
  );

  const scriptLoadPhase = useChatStore(
    (state) => state.scripts.scriptLoadPhase,
  );

  // MODIFIED: Added console.log for isPreChatModalOpen
  console.log(
    '[ChatWidget] RENDER. isPreChatModalOpen value:',
    isPreChatModalOpen,
  );

  const prevActiveLegacyConfigRef = useRef<LegacyChatConfig | undefined>();

  const activeLegacyConfig = useMemo(() => {
    if (genesysChatConfigFull?.chatMode === 'legacy') {
      return genesysChatConfigFull as LegacyChatConfig;
    }
    return undefined;
  }, [genesysChatConfigFull]);

  const activeCloudConfig = useMemo(() => {
    if (genesysChatConfigFull?.chatMode === 'cloud') {
      return genesysChatConfigFull as unknown as CloudChatConfig;
    }
    return undefined;
  }, [genesysChatConfigFull]);

  useEffect(() => {
    (window as any).myCustomRequestPreChatOpen = () => {
      console.log(
        '[ChatWidget] (window as any).myCustomRequestPreChatOpen DEFINITION CALLED. Calling openPreChatModal().',
      );
      openPreChatModal();
    };
    return () => {
      delete (window as any).myCustomRequestPreChatOpen;
    };
  }, [openPreChatModal]);

  const isGenesysButtonRendered = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return false;
    for (const selector of GENESYS_BUTTON_SELECTORS) {
      if (document.querySelector(selector)) {
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    const shouldShowFallback =
      (forceFallbackButton || scriptLoadPhase === ScriptLoadPhase.ERROR) && // ScriptLoadPhase used as value
      !isGenesysButtonRendered() &&
      !isPreChatModalOpen;
    setShowFallbackButtonJSXState(shouldShowFallback);
  }, [
    forceFallbackButton,
    scriptLoadPhase,
    isGenesysButtonRendered,
    isPreChatModalOpen,
  ]);

  useEffect(() => {
    const handleGenesysReady = () => {
      storeActions.setButtonState('created');
      storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED); // ScriptLoadPhase used as value
      if (chatMode === 'legacy') {
        (window as any).genesysLegacyChatIsReady = true;
        if ((window as any).genesysLegacyChatOpenRequested) {
          const bus = window._genesysCXBus as any;
          if (bus && typeof bus.command === 'function') {
            try {
              bus.command('WebChat.open');
              (window as any).genesysLegacyChatOpenRequested = false;
            } catch (e: any) {
              logger.error(
                `[ChatWidget] Error commanding WebChat.open in 'genesys:ready' (after request): ${e.message}`,
                e,
              );
              storeActions.setError(e);
              storeActions.setButtonState('failed');
            }
          } else {
            logger.warn(
              `[ChatWidget] _genesysCXBus not available in 'genesys:ready' handler (after request) despite 'genesys:ready' event.`,
            );
            storeActions.setError(
              new Error(
                'Chat CXBus became unavailable before open could be commanded.',
              ),
            );
            storeActions.setButtonState('failed');
          }
        }
      }
    };

    const handleWebChatOpened = () => {
      storeActions.setOpen(true);
      storeActions.startChat();
    };

    const handleWebChatClosed = () => {
      storeActions.setOpen(false);
      storeActions.endChat();
    };

    const handleGenesysError = (event: Event) => {
      const customEvent = event as CustomEvent;
      logger.error(
        `[ChatWidget] Event: 'genesys:error' received.`,
        customEvent.detail,
      );
      storeActions.setError(
        customEvent.detail?.error ||
          new Error(
            customEvent.detail?.message || 'Genesys initialization error',
          ),
      );
      storeActions.setButtonState('failed');
      storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR); // ScriptLoadPhase used as value
      setShowChatErrorModal(true);
    };

    const handleWebChatErrorEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      logger.error(
        `[ChatWidget] Event: 'genesys:webchat:error' received.`,
        customEvent.detail,
      );
      storeActions.setError(
        customEvent.detail?.error ||
          new Error(
            customEvent.detail?.message || 'Genesys webchat session error',
          ),
      );
      setShowChatErrorModal(true);
    };

    const handleWebChatFailedToStart = (event: Event) => {
      const customEvent = event as CustomEvent;
      logger.error(
        `[ChatWidget] Event: 'genesys:webchat:failedToStart' received.`,
        customEvent.detail,
      );
      storeActions.setError(
        new Error(
          customEvent.detail?.message || 'Genesys webchat failed to start',
        ),
      );
      storeActions.endChat();
      setShowChatErrorModal(true);
    };

    const handleAppMainReady = () => {
      /* Original logs removed */
    };
    const handleCreateButtonEvent = () => {
      /* Original logs removed */
    };
    const handleWebChatSubmitted = (/*event: Event*/) => {
      /* Original logs removed */
    };
    const handleMessageReceived = (/*event: Event*/) => {
      storeActions.incrementMessageCount();
    };

    document.addEventListener('genesys:ready', handleGenesysReady);
    document.addEventListener('genesys:webchat:opened', handleWebChatOpened);
    document.addEventListener('genesys:webchat:closed', handleWebChatClosed);
    document.addEventListener('genesys:error', handleGenesysError);
    document.addEventListener('genesys:webchat:error', handleWebChatErrorEvent);
    document.addEventListener(
      'genesys:webchat:failedToStart',
      handleWebChatFailedToStart,
    );
    document.addEventListener('genesys:create-button', handleCreateButtonEvent);
    document.addEventListener(
      'genesys:message:received',
      handleMessageReceived,
    );
    document.addEventListener(
      'genesys:webchat:submitted',
      handleWebChatSubmitted,
    );
    document.addEventListener('genesys:appMainReady', handleAppMainReady);

    return () => {
      document.removeEventListener('genesys:ready', handleGenesysReady);
      document.removeEventListener(
        'genesys:webchat:opened',
        handleWebChatOpened,
      );
      document.removeEventListener(
        'genesys:webchat:closed',
        handleWebChatClosed,
      );
      document.removeEventListener('genesys:error', handleGenesysError);
      document.removeEventListener(
        'genesys:webchat:error',
        handleWebChatErrorEvent,
      );
      document.removeEventListener(
        'genesys:webchat:failedToStart',
        handleWebChatFailedToStart,
      );
      document.removeEventListener(
        'genesys:create-button',
        handleCreateButtonEvent,
      );
      document.removeEventListener(
        'genesys:message:received',
        handleMessageReceived,
      );
      document.removeEventListener(
        'genesys:webchat:submitted',
        handleWebChatSubmitted,
      );
      document.removeEventListener('genesys:appMainReady', handleAppMainReady);
    };
  }, [storeActions, chatMode]);

  useEffect(() => {
    (window as Window & typeof globalThis).openPlanSwitcher = () => {
      if (window._genesysCXBus) {
        (window._genesysCXBus as GenesysCXBus).command('WebChat.close');
      }
      storeActions.openPlanSwitcherModal();
    };
    (window as Window & typeof globalThis).OpenChatDisclaimer = () => {
      storeActions.openTnCModal(genesysChatConfigFull?.LOB || 'General');
    };
    return () => {
      delete (window as Window & typeof globalThis).openPlanSwitcher;
      delete (window as Window & typeof globalThis).OpenChatDisclaimer;
    };
  }, [storeActions, genesysChatConfigFull]);

  useEffect(() => {
    if (configError) {
      setShowChatErrorModal(true);
    }
  }, [configError]);

  const handleClearErrorAndReopen = useCallback(() => {
    setShowChatErrorModal(false);
    storeActions.setError(null);
    if (isChatEnabled && genesysChatConfigFull && !isChatActive) {
      openPreChatModal();
    } else if (!isChatEnabled || !genesysChatConfigFull) {
      logger.warn(
        `[ChatWidget] Chat cannot be reopened: chat not enabled or config missing.`,
      );
    }
  }, [
    storeActions,
    isChatEnabled,
    genesysChatConfigFull,
    isChatActive,
    openPreChatModal,
  ]);

  const handleChatButtonClick = useCallback(() => {
    console.log('[ChatWidget] handleChatButtonClick CALLED');
    if (!isChatEnabled || !genesysChatConfigFull) {
      logger.warn(
        `[ChatWidget] Chat button clicked, but chat is not enabled or not fully configured.`,
        { isChatEnabled, hasFullConfig: !!genesysChatConfigFull },
      );
      storeActions.setError(
        new Error('Chat is currently unavailable or not configured.'),
      );
      setShowChatErrorModal(true);
      return;
    }

    if (typeof (window as any).myCustomRequestPreChatOpen === 'function') {
      console.log(
        '[ChatWidget] myCustomRequestPreChatOpen IS a function. Calling it.',
      );
      (window as any).myCustomRequestPreChatOpen();
    } else {
      logger.warn(
        `[ChatWidget] (window as any).myCustomRequestPreChatOpen is NOT a function. Attempting to call openPreChatModal() directly.`,
      );
      openPreChatModal();
    }
  }, [isChatEnabled, genesysChatConfigFull, storeActions, openPreChatModal]);

  const handleStartChatConfirm = useCallback(() => {
    console.log('[ChatWidget] handleStartChatConfirm CALLED');
    const cxBus =
      (window as any)._genesysCXBus || window._genesys?.widgets?.bus;

    if (cxBus) {
      console.log('[ChatWidget] CXBus IS available.');
      const config = genesysChatConfigFull;
      const userData = config
        ? {
            firstName: config.memberFirstname || config.formattedFirstName,
            lastName: config.memberLastName,
            email: config.email,
            userID: config.userID,
            memberMedicalPlanID: config.memberMedicalPlanID,
            groupId: config.groupId,
            INQ_TYPE: config.INQ_TYPE,
          }
        : {};

      // --- IMPORTANT CHANGE HERE ---
      const chatPayload = {
          userData: userData,
          form: {
              inputs: [
                  { name: 'nickname', value: userData.firstName || '' },
                  { name: 'firstName', value: userData.firstName || '', isHidden: true },
                  { name: 'lastName', value: userData.lastName || '', isHidden: true },
                  { name: 'email', value: userData.email || '', isHidden: true },
                  { name: 'subject', value: userData.INQ_TYPE || 'General Inquiry', isHidden: true }
              ]
          }
      };
      // --- END IMPORTANT CHANGE ---

      console.log(
        '[ChatWidget] Preparing to call WebChat.startChat with FULL payload:',
        JSON.stringify(chatPayload, null, 2),
      );

      // Inside ChatWidget.tsx

const handleStartChatConfirm = async () => { // Make it async
  logger.info('[ChatWidget] handleStartChatConfirm CALLED');
  closePreChatModal(); // Close your custom pre-chat modal immediately

  const cxBus = (window as any)._genesys.widgets.bus; // Direct access to CXBus

  if (!cxBus) {
    logger.error('[ChatWidget] CXBus is NOT available when trying to start chat!');
    // Handle this error: perhaps show an error message to the user
    return;
  }

  logger.info('[ChatWidget] CXBus IS available.');

  // const chatPayload = {
  //   userData: {
  //     firstName: memberData.firstName,
  //     lastName: memberData.lastName,
  //     email: memberData.email,
  //     userID: memberData.userID,
  //     memberMedicalPlanID: memberData.memberMedicalPlanID, // Ensure this exists and is correct
  //     groupId: memberData.groupId, // Ensure this exists and is correct
  //     INQ_TYPE: chatSettings.INQ_TYPE,
  //   },
  //   form: {
  //     inputs: [
  //       { name: 'nickname', value: memberData.firstName },
  //       { name: 'firstName', value: memberData.firstName, isHidden: true },
  //       { name: 'lastName', value: memberData.lastName, isHidden: true },
  //       { name: 'email', value: memberData.email, isHidden: true },
  //       { name: 'subject', value: chatSettings.INQ_TYPE, isHidden: true },
  //     ],
  //   },
  // };

  logger.info('[ChatWidget] Preparing to call WebChat.startChat with FULL payload:', chatPayload);

  try {
    const result = await cxBus.command('WebChat.startChat', chatPayload);
    logger.info('[ChatWidget] WebChat.startChat SUCCEEDED:', result);
    // If successful, Genesys should open its chat window.
    // You might want to hide your button here if the Genesys widget itself takes over.
    // However, your CSS suggests the button is persistent unless Genesys hides it.
  } catch (error) {
    logger.error('[ChatWidget] WebChat.startChat FAILED:', error);
    // CRITICAL: Inspect this error object in detail!
    // This will contain the reason Genesys didn't start the chat.
    // Possible errors:
    // - Chat is outside business hours (even with S_S_24, check rawChatHrs)
    // - Invalid configuration (e.g., chat group doesn't exist or is misconfigured)
    // - Connectivity issues to Genesys backend
    // - Security policies preventing the chat window from opening (e.g., iframe issues)
    // - Licensing issues
    // You might want to show a user-friendly error message based on the error.
  }
};

    } else {
      logger.error(
        `[ChatWidget] Genesys CXBus not available. Cannot open chat. Script load phase: ${scriptLoadPhase}`,
      );
      console.error(
        '[ChatWidget] CXBus IS NOT available. Script load phase:',
        scriptLoadPhase,
      );
      storeActions.setError(new Error('Genesys CXBus not available.'));
      setShowChatErrorModal(true);
      closePreChatModal();
    }
  }, [scriptLoadPhase, closePreChatModal, storeActions, genesysChatConfigFull]);

  // Effect for managing visibility of Genesys native chat button (strict original interpretation)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const legacyButton = document.getElementById('cx_chat_form_button');

    if (isPreChatModalOpen) {
      if (chatMode === 'legacy' && legacyButton) {
        legacyButton.style.display = 'none';
      }
      // In original, this was 'else if (chatMode === 'cloud')'.
      // If it's meant to be exclusive with legacy, it should remain so.
      // If it could apply if legacy conditions aren't met, then it's fine.
      // Assuming it's general for cloud when prechat is open:
      if (chatMode === 'cloud') {
        document.body.classList.add('prechat-panel-open');
      }
    } else if (!isChatActive) {
      // isPreChatModalOpen is false AND !isChatActive
      if (legacyButton) {
        // Primarily for legacy, show the button
        legacyButton.style.display = '';
      }
      // If prechat is closed AND chat is not active, ensure class is removed (original didn't explicitly do this here for cloud)
      // However, the original's next 'else if' for cloud would cover removing it if chat WAS active.
      // To be safe and match common patterns, if prechat is not open, the class should likely be removed.
      // Sticking to structure: only remove if chatMode is cloud AND (implicitly) chat is active.
      // document.body.classList.remove('prechat-panel-open'); // Tentatively removed from this branch
    } else if (chatMode === 'cloud') {
      // isPreChatModalOpen is false AND isChatActive is true AND chatMode is 'cloud'
      document.body.classList.remove('prechat-panel-open');
    }
    // Fallback to ensure class is removed if preChat is not open (covers cases not hit by specific cloud logic above)
    // This addresses a potential gap in the original structure for non-cloud modes or when isChatActive is false.
    if (!isPreChatModalOpen) {
      document.body.classList.remove('prechat-panel-open');
    }
  }, [isPreChatModalOpen, isChatActive, chatMode]);

  useEffect(() => {
    if (chatMode === 'legacy' && activeLegacyConfig) {
      if (
        prevActiveLegacyConfigRef.current &&
        JSON.stringify(prevActiveLegacyConfigRef.current) !==
          JSON.stringify(activeLegacyConfig)
      ) {
        if (window.handleChatSettingsUpdate) {
          window.handleChatSettingsUpdate(
            JSON.parse(JSON.stringify(activeLegacyConfig)),
          );
        }
      }
      prevActiveLegacyConfigRef.current = JSON.parse(
        JSON.stringify(activeLegacyConfig),
      );
    } else if (chatMode !== 'legacy') {
      prevActiveLegacyConfigRef.current = undefined;
    }
  }, [activeLegacyConfig, chatMode]);

  const handleScriptLoadSuccess = useCallback(() => {
    storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED); // ScriptLoadPhase used as value
  }, [storeActions]);

  const handleScriptLoadError = useCallback(
    (error: Error) => {
      logger.error(
        `[ChatWidget] Script load reported as FAILED by child loader.`,
        error,
      );
      storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR); // ScriptLoadPhase used as value
      storeActions.setError(error);
      setShowChatErrorModal(true);
    },
    [storeActions],
  );

  const shouldAttemptScriptLoading = useMemo(() => {
    return !isLoadingConfig && !!genesysChatConfigFull;
  }, [isLoadingConfig, genesysChatConfigFull]);

  const loaderComponentToRender = _getLoaderComponent(
    shouldAttemptScriptLoading,
    chatMode,
    isChatEnabled,
    activeLegacyConfig,
    activeCloudConfig,
    showLoaderStatus,
    handleScriptLoadSuccess,
    handleScriptLoadError,
  );

  return (
    <>
      {/*
        This div is the designated container for the Genesys chat UI.
        It is rendered by ChatWidget and will be available when ChatWidget mounts on the client.
        For true Server-Side Rendering (SSR) of this container,
        it should be placed in a parent Server Component that invokes <ChatWidget />.
        Example: <div id={containerId}></div> in your page.tsx or layout.tsx.
      */}
      <div id={containerId} />

      {loaderComponentToRender}
      {isPreChatModalOpen && (
        <PreChatModal
          isOpen={isPreChatModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              closePreChatModal();
            }
          }}
          hasMultiplePlans={
            (genesysChatConfigFull as any)?.multiPlanData?.hasMultiplePlans ??
            false
          }
          currentPlanName={
            (genesysChatConfigFull as any)?.multiPlanData?.currentPlanName ??
            'Current Plan'
          }
          onSwitchPlanRequest={() => {
            if ((window as any).openPlanSwitcher) {
              (window as any).openPlanSwitcher();
            }
            closePreChatModal();
          }}
          onStartChatConfirm={handleStartChatConfirm}
        />
      )}
      {showChatErrorModal && (
        <ChatErrorDialog
          isOpen={showChatErrorModal}
          onOpenChange={(open: boolean) => {
            if (!open) setShowChatErrorModal(false);
          }}
          title="Chat Error"
          errorMessage={standardErrorMessage}
          onConfirm={handleClearErrorAndReopen}
        />
      )}
      {showFallbackButtonJSXState && (
        <button
          style={
            {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              zIndex: 2147483641,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
            } as React.CSSProperties
          }
          onClick={handleChatButtonClick}
          title="Chat with us"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </>
  );
}

declare global {
  interface Window {
    GenesysChat?: GenesysChat;
    _genesysCXBus?: GenesysCXBus | unknown;
    openPlanSwitcher?: () => void;
    OpenChatDisclaimer?: () => void;
    myCustomRequestPreChatOpen?: () => void;
    _forceChatButtonCreate?: () => boolean;
    _genesys?: any;
    _genesysInitStatus?: any;
    _genesysDiagnostics?: () => void;
    handleChatSettingsUpdate?: (newSettings: LegacyChatConfig) => void;
    genesysLegacyChatIsReady?: boolean;
    genesysLegacyChatOpenRequested?: boolean;
  }
}
