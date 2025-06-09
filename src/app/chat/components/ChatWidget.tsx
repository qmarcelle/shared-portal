'use client';

/**
 * @file ChatWidget.tsx
 * @description This component is the main UI/UX orchestrator for the Genesys chat.
 * It loads the appropriate Genesys script (legacy or cloud) based on configuration,
 * subscribes to Genesys events to update application state via chatStore,
 * and renders auxiliary UI like error modals.
 */

import { MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { logger } from '@/utils/logger';

import { useChatStore } from '../stores/chatStore';
// Corrected import for ScriptLoadPhase: it's used as a value.
import type {
  CloudChatConfig,
  GenesysChat,
  GenesysCXBus,
  GenesysGlobal,
} from '../types/chat-types';
import { ScriptLoadPhase } from '../types/chat-types';
import { ChatErrorDialog } from './ChatErrorDialog';
import GenesysCloudLoader from './GenesysCloudLoader';
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
  activeCloudConfig: CloudChatConfig | undefined,
  showLoaderStatus: boolean | undefined,
  handleScriptLoadSuccess: () => void,
  handleScriptLoadError: (error: Error) => void,
): JSX.Element | null {
  if (!shouldAttemptScriptLoading) {
    return showLoaderStatus ? <div>Config loading...</div> : null;
  }

  // Cloud-only architecture - always use GenesysCloudLoader
  if (chatMode === 'cloud') {
    if (!activeCloudConfig) {
      logger.warn(
        '[ChatWidget] Render: Cloud mode, but activeCloudConfig is missing.',
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
      `[ChatWidget] Render: Legacy mode no longer supported, chat disabled. ChatMode: ${chatMode}`,
    );
    return showLoaderStatus ? <div>Legacy mode no longer supported</div> : null;
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

  const activeCloudConfig = useMemo(() => {
    if (genesysChatConfigFull?.chatMode === 'cloud') {
      return genesysChatConfigFull as unknown as CloudChatConfig;
    }
    return undefined;
  }, [genesysChatConfigFull]);

  useEffect(() => {
    (
      window as Window & { myCustomRequestPreChatOpen?: () => void }
    ).myCustomRequestPreChatOpen = () => {
      console.log(
        '[ChatWidget] myCustomRequestPreChatOpen DEFINITION CALLED. Calling openPreChatModal().',
      );
      openPreChatModal();
    };
    return () => {
      delete (window as Window & { myCustomRequestPreChatOpen?: () => void })
        .myCustomRequestPreChatOpen;
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
      // Cloud-only implementation - legacy WebChat.open logic removed
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
        '[ChatWidget] Event: genesys:error received.',
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
        '[ChatWidget] Event: genesys:webchat:error received.',
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
        '[ChatWidget] Event: genesys:webchat:failedToStart received.',
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
        '[ChatWidget] Chat cannot be reopened: chat not enabled or config missing.',
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
        '[ChatWidget] Chat button clicked, but chat is not enabled or not fully configured.',
        { isChatEnabled, hasFullConfig: !!genesysChatConfigFull },
      );
      storeActions.setError(
        new Error('Chat is currently unavailable or not configured.'),
      );
      setShowChatErrorModal(true);
      return;
    }

    if (
      typeof (window as Window & { myCustomRequestPreChatOpen?: () => void })
        .myCustomRequestPreChatOpen === 'function'
    ) {
      console.log(
        '[ChatWidget] myCustomRequestPreChatOpen IS a function. Calling it.',
      );
      (
        window as Window & { myCustomRequestPreChatOpen?: () => void }
      ).myCustomRequestPreChatOpen?.();
    } else {
      logger.warn(
        '[ChatWidget] (window as any).myCustomRequestPreChatOpen is NOT a function. Attempting to call openPreChatModal() directly.',
      );
      openPreChatModal();
    }
  }, [isChatEnabled, genesysChatConfigFull, storeActions, openPreChatModal]);

  const handleStartChatConfirm = useCallback(() => {
    console.log('[ChatWidget] handleStartChatConfirm CALLED');
    const cxBus =
      (window as Window & { _genesysCXBus?: GenesysCXBus })._genesysCXBus ||
      (window._genesys as unknown as GenesysGlobal)?.widgets?.bus;

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
            {
              name: 'firstName',
              value: userData.firstName || '',
              isHidden: true,
            },
            {
              name: 'lastName',
              value: userData.lastName || '',
              isHidden: true,
            },
            { name: 'email', value: userData.email || '', isHidden: true },
            {
              name: 'subject',
              value: userData.INQ_TYPE || 'General Inquiry',
              isHidden: true,
            },
          ],
        },
      };
      // --- END IMPORTANT CHANGE ---

      console.log(
        '[ChatWidget] Preparing to call WebChat.startChat with FULL payload:',
        JSON.stringify(chatPayload, null, 2),
      );

      try {
        // <--- ADD A TRY-CATCH BLOCK HERE
        (
          cxBus as {
            command: (
              cmd: string,
              data: unknown,
            ) => {
              done: (cb: (result: unknown) => void) => {
                fail: (cb: (err: unknown) => void) => void;
              };
            };
          }
        )
          .command('WebChat.startChat', chatPayload) // Pass the full chatPayload
          .done((result: unknown) => {
            console.log(
              '[ChatWidget] WebChat.startChat command successful via CXBus.',
              result,
            );
            logger.info(
              '[ChatWidget] WebChat.startChat command successful via CXBus.',
            );
            console.log(
              '[ChatWidget] WebChat.startChat SUCCEEDED (done callback).',
            );
            closePreChatModal();
          })
          .fail((err: unknown) => {
            logger.error(
              '[ChatWidget] WebChat.startChat command failed via CXBus.',
              err,
            );
            console.error(
              '[ChatWidget] WebChat.startChat FAILED (fail callback). Error:',
              JSON.stringify(err, null, 2),
            );
            storeActions.setError(
              new Error(
                (err as Error).message || 'Failed to open chat via CXBus.',
              ),
            );
            setShowChatErrorModal(true);
            closePreChatModal();
          });
      } catch (e: unknown) {
        // <--- CATCH SYNCHRONOUS ERRORS
        console.error(
          '[ChatWidget] Synchronous error calling WebChat.startChat:',
          e,
        );
        storeActions.setError(
          new Error((e as Error).message || 'Synchronous error starting chat.'),
        );
        setShowChatErrorModal(true);
        closePreChatModal();
      }
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
      // Cloud-only implementation
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

  // Legacy config update handling removed for cloud-only implementation

  const handleScriptLoadSuccess = useCallback(() => {
    storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED); // ScriptLoadPhase used as value
  }, [storeActions]);

  const handleScriptLoadError = useCallback(
    (error: Error) => {
      logger.error(
        '[ChatWidget] Script load reported as FAILED by child loader.',
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
            (
              genesysChatConfigFull as unknown as {
                multiPlanData?: { hasMultiplePlans: boolean };
              }
            )?.multiPlanData?.hasMultiplePlans ?? false
          }
          currentPlanName={
            (
              genesysChatConfigFull as unknown as {
                multiPlanData?: { currentPlanName: string };
              }
            )?.multiPlanData?.currentPlanName ?? 'Current Plan'
          }
          onSwitchPlanRequest={() => {
            if (
              (window as Window & { openPlanSwitcher?: () => void })
                .openPlanSwitcher
            ) {
              (
                window as Window & { openPlanSwitcher?: () => void }
              ).openPlanSwitcher?.();
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
    _genesys?: unknown;
    _genesysInitStatus?: unknown;
    _genesysDiagnostics?: () => void;
    // Legacy chat properties removed for cloud-only implementation
  }
}
