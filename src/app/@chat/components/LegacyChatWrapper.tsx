'use client';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import { logger } from '@/utils/logger';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  hideInquiryDropdown,
  injectNewMessageBadge,
  injectPlanSwitcher,
} from '../utils/chatDomUtils';

declare global {
  interface Window {
    __genesysInitialized?: boolean;
  }
}

/**
 * Legacy chat implementation wrapper
 * Loads Genesys chat.js script with beforeInteractive strategy
 * Ensures proper integration with click_to_chat.js implementation
 */
export default function LegacyChatWrapper() {
  const { userData, formInputs, chatGroup, isPlanSwitcherLocked } =
    useChatStore();
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const componentId = Math.random().toString(36).substring(2, 10); // Unique ID for tracking this instance

  // Stage-based Genesys/chat initialization logging
  let genesysInitStage = 0;
  const stageNames = [
    '',
    'Scripts requested',
    'jQuery loaded',
    'Genesys widgets loaded',
    'chatSettings set',
    'click_to_chat.js loaded',
    'Genesys/CXBus ready',
    'Chat button injected',
  ];
  function logStage(stage: number, context: Record<string, any> = {}) {
    if (genesysInitStage < stage) {
      genesysInitStage = stage;
      logger.info(
        `[GenesysInit] Stage ${stage}: ${stageNames[stage]}`,
        context,
      );
    }
  }

  // Log when component is first rendered
  useEffect(() => {
    logger.info('[LegacyChatWrapper] Component mounted', {
      componentId,
      hasUserData: !!userData,
      hasFormInputs: Array.isArray(formInputs) && formInputs.length > 0,
      chatGroup,
      timestamp: new Date().toISOString(),
    });

    return () => {
      logger.info('[LegacyChatWrapper] Component unmounting', {
        componentId,
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  // When scripts are loaded, apply DOM customizations
  useEffect(() => {
    if (!scriptsLoaded) return;

    logger.info(
      '[LegacyChatWrapper] Scripts loaded, applying DOM customizations',
      {
        componentId,
        timestamp: new Date().toISOString(),
      },
    );

    // Apply chat DOM customizations
    const applyCustomizations = () => {
      try {
        hideInquiryDropdown();
        injectNewMessageBadge();
        injectPlanSwitcher();

        logger.info('[LegacyChatWrapper] Chat DOM customizations applied', {
          componentId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('[LegacyChatWrapper] Failed to apply DOM customizations', {
          componentId,
          error,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Apply immediately and then after a delay to ensure DOM elements are available
    applyCustomizations();
    const timer = setTimeout(applyCustomizations, 1000);

    return () => clearTimeout(timer);
  }, [scriptsLoaded, componentId]);

  // Helper to convert any value to proper string representation for the chat settings
  const toStringValue = (val: any): string => {
    if (val === undefined || val === null) return '';
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    return String(val);
  };

  // Helper to convert value to proper boolean
  const toBooleanValue = (val: any): boolean => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return Boolean(val);
  };

  // Setup chat settings global object for click_to_chat.js to use
  useEffect(() => {
    // Defensive: close any previous chat session
    if (typeof window.CXBus?.command === 'function') {
      try {
        window.CXBus.command('WebChat.close');
      } catch (e) {
        console.error('Error closing chat:', e);
      }
    }

    // Log what we're about to do
    logger.info('[LegacyChatWrapper] Setting up chat settings', {
      componentId,
      hasUserData: !!userData,
      timestamp: new Date().toISOString(),
    });

    // Create the settings object expected by click_to_chat.js
    window.chatSettings = {
      clickToChatToken: process.env.NEXT_PUBLIC_CHAT_TOKEN || '',
      clickToChatEndpoint: process.env.NEXT_PUBLIC_LEGACY_CHAT_URL || '',
      clickToChatDemoEndPoint:
        process.env.NEXT_PUBLIC_LEGACY_CHAT_DEMO_URL || '',
      coBrowseLicence: process.env.NEXT_PUBLIC_COBROWSE_LICENSE || '',
      opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE || '',
      opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS || '',
      isChatEligibleMember: 'true',
      isDemoMember:
        process.env.NEXT_PUBLIC_IS_DEMO === 'true' ? 'true' : 'false',
      isAmplifyMem: toStringValue(userData?.isAmplify),
      formattedFirstName: userData?.firstName || '',
      memberLastName: userData?.lastName || '',
      groupId: userData?.groupId || '',
      subscriberID: userData?.subscriberId || '',
      sfx: userData?.suffix || '',
      memberDOB: userData?.dob || '',
      memberMedicalPlanID: userData?.planId || '',
      groupType: userData?.groupType || '',
      isMedical: toStringValue(userData?.isMedical),
      isDental: toStringValue(userData?.isDental),
      isVision: toStringValue(userData?.isVision),
      isWellnessOnly: toStringValue(userData?.isWellnessOnly),
      isCobraEligible: toStringValue(userData?.isCobraEligible),
      isIDCardEligible: toStringValue(userData?.isIdCardEligible),
      isChatbotEligible: toStringValue(userData?.isChatbotEligible),
      chatHours: userData?.chatHours || '8:00 AM - 6:00 PM ET, Monday - Friday',
      rawChatHours: userData?.rawChatHours || '8_18',
      isChatAvailable: toStringValue(userData?.isChatAvailable),
      // For this field, we ensure it's properly converted to a boolean value
      routingchatbotEligible: toBooleanValue(userData?.routingChatbotEligible),
      memberClientID: userData?.clientId || '',
      isBlueEliteGroup: toStringValue(userData?.isBlueElite),
      selfServiceLinks: Array.isArray(userData?.selfServiceLinks)
        ? userData?.selfServiceLinks
        : [],
      idCardChatBotName: userData?.idCardChatBotName || '',
    };

    logger.info('[LegacyChatWrapper] Chat settings initialized', {
      componentId,
      memberClientID: window.chatSettings?.memberClientID || '',
      isChatAvailable: window.chatSettings?.isChatAvailable || 'false',
      endpoint: window.chatSettings?.clickToChatEndpoint || 'N/A',
      hasSettings: !!window.chatSettings,
      timestamp: new Date().toISOString(),
    });

    // Add required global functions for Terms and Conditions modal
    window.OpenChatDisclaimer = function () {
      logger.info('[LegacyChatWrapper] OpenChatDisclaimer called', {
        componentId,
      });
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        const disclaimerMessage =
          'This information provided today is based on current eligibility and contract limitations. Final determination will be made upon the completion of the processing of your claim. For quality assurance your chat may be monitored and/or recorded.';

        // Create the modal content with vanilla JS instead of jQuery
        const modalContainer = document.createElement('div');
        modalContainer.id = 'disclaimerId';

        const modalContent = document.createElement('p');
        modalContent.className = 'termsNConditions';

        const modalTitle = document.createElement('span');
        modalTitle.className = 'modalTitle';
        modalTitle.textContent = 'Terms and Conditions';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.paddingBottom = '10px';
        buttonContainer.style.backgroundColor = '#fff';

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'cx-btn cx-btn-primary buttonWide';
        closeButton.textContent = 'CLOSE';
        // Fix TypeScript error by using a proper event handler function
        closeButton.onclick = function (event) {
          if (typeof window.CloseChatDisclaimer === 'function') {
            window.CloseChatDisclaimer();
          }
        };

        // Assemble the elements
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(document.createElement('br'));
        modalContent.appendChild(document.createElement('br'));
        modalContent.appendChild(document.createTextNode(disclaimerMessage));
        modalContainer.appendChild(modalContent);
        buttonContainer.appendChild(closeButton);

        // Create a wrapper element to hold both parts
        const wrapper = document.createElement('div');
        wrapper.appendChild(modalContainer);
        wrapper.appendChild(buttonContainer);

        // Show the overlay with our vanilla JS elements
        window.CXBus.command('WebChat.showOverlay', {
          html: wrapper,
          hideFooter: true,
        });
      }
    };

    window.CloseChatDisclaimer = function () {
      logger.info('[LegacyChatWrapper] CloseChatDisclaimer called', {
        componentId,
      });
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        window.CXBus.command('WebChat.hideOverlay');
      }
    };

    // Expose window.startChat for debugging purposes
    if (typeof window.startChat !== 'function') {
      window.startChat = function () {
        logger.info('[LegacyChatWrapper] Manual startChat called', {
          componentId,
          timestamp: new Date().toISOString(),
        });
        if (window.CXBus && typeof window.CXBus.command === 'function') {
          window.CXBus.command('WebChat.open');
        }
      };
    }

    return () => {
      if (typeof window.CXBus?.command === 'function') {
        try {
          window.CXBus.command('WebChat.close');
        } catch (e) {
          console.error('Error closing chat on cleanup:', e);
        }
      }
    };
  }, [userData, chatGroup, formInputs, componentId]);

  // Handle script load events
  const handleGenesysScriptLoad = () => {
    logger.info('[LegacyChatWrapper] Genesys widgets script loaded', {
      componentId,
      timestamp: new Date().toISOString(),
    });
    setScriptsLoaded(true);
  };

  // Handle script error
  const handleScriptError = (error: Error) => {
    logger.error('[LegacyChatWrapper] Failed to load Genesys script', {
      componentId,
      error: error?.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  };

  // Manually check for window.CXBus for debugging
  useEffect(() => {
    const checkCXBus = () => {
      logger.info('[LegacyChatWrapper] Checking CXBus status', {
        componentId,
        hasCXBus: typeof window.CXBus !== 'undefined',
        hasGenesys: typeof window._genesys !== 'undefined',
        hasWebChat: typeof window._genesys?.widgets?.webchat !== 'undefined',
        hasCommand: typeof window.CXBus?.command === 'function',
        timestamp: new Date().toISOString(),
      });
      if (
        typeof window.CXBus !== 'undefined' &&
        typeof window.CXBus.command === 'function'
      ) {
        logStage(6);
      }
    };
    checkCXBus();
    const interval = setInterval(checkCXBus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [componentId]);

  // Debug check for chat button
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if chat button is present after initialization
    setTimeout(() => {
      const button = document.querySelector('.cx-webchat-chat-button');
      logger.info('[Genesys] Chat button found check:', !!button);
    }, 500);
  }, []);

  // 1. Scripts requested
  useEffect(() => {
    logStage(1, { scripts: ['jQuery', 'widgets.min.js', 'click_to_chat.js'] });
  }, []);

  // 4. chatSettings set
  useEffect(() => {
    logStage(4, { chatSettings: window.chatSettings });
  }, [userData, chatGroup, formInputs, componentId]);

  // 6. Genesys/CXBus ready
  useEffect(() => {
    const checkCXBus = () => {
      logger.info('[LegacyChatWrapper] Checking CXBus status', {
        componentId,
        hasCXBus: typeof window.CXBus !== 'undefined',
        hasGenesys: typeof window._genesys !== 'undefined',
        hasWebChat: typeof window._genesys?.widgets?.webchat !== 'undefined',
        hasCommand: typeof window.CXBus?.command === 'function',
        timestamp: new Date().toISOString(),
      });
      if (
        typeof window.CXBus !== 'undefined' &&
        typeof window.CXBus.command === 'function'
      ) {
        logStage(6);
      }
    };
    checkCXBus();
    const interval = setInterval(checkCXBus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [componentId]);

  // 7. Chat button injected (by Genesys/click_to_chat.js)
  useEffect(() => {
    let found = false;
    let attempts = 0;
    const maxAttempts = 20; // 20 seconds
    const checkChatButton = () => {
      const btn = document.querySelector('.cx-webchat-chat-button');
      if (btn && !found) {
        found = true;
        logger.info('[LegacyChatWrapper] Genesys chat button injected in DOM', {
          componentId,
          button: btn,
        });
        logStage(7);
      } else if (!btn && attempts === maxAttempts) {
        logger.warn(
          '[LegacyChatWrapper] Genesys chat button NOT found after waiting',
          {
            componentId,
          },
        );
      }
      attempts++;
    };
    const interval = setInterval(checkChatButton, 1000);
    setTimeout(() => clearInterval(interval), maxAttempts * 1000);
    return () => clearInterval(interval);
  }, [componentId]);

  return (
    <>
      {/* 2. jQuery loaded */}
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          logger.info('[LegacyChatWrapper] jQuery loaded', { componentId });
          logStage(2);
        }}
        onError={() =>
          logger.error('[LegacyChatWrapper] Failed to load jQuery', {
            componentId,
          })
        }
      />

      {/* 3. Genesys widgets loaded */}
      <Script
        src="/assets/genesys/plugins/widgets.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          handleGenesysScriptLoad();
          logStage(3);
        }}
        onError={handleScriptError}
      />

      {/* Add jQuery as a global variable specifically for click_to_chat.js */}
      <Script
        id="jquery-global-assignment"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Ensure jQuery is assigned to window.jQuery
            if (typeof jQuery !== 'undefined') {
              window.jQuery = jQuery;
            }
          `,
        }}
      />

      {/* 5. click_to_chat.js loaded */}
      <Script
        src="/assets/genesys/click_to_chat.js"
        strategy="afterInteractive"
        onLoad={() => {
          logger.info('[LegacyChatWrapper] click_to_chat.js loaded', {
            componentId,
          });
          logStage(5);
        }}
        onError={() =>
          logger.error('[LegacyChatWrapper] Failed to load click_to_chat.js', {
            componentId,
          })
        }
      />

      {/* Initialization script to debug and trigger chat if needed */}
      <Script
        id="legacy-chat-debug-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Debug and initialization
            if (window._genesys && !window._genesys._widgets) {
              try {
                if (typeof window.CXBus === 'undefined' && typeof window.genesys?.widgets?.bus === 'function') {
                  window.CXBus = window.genesys.widgets.bus;
                }
              } catch(e) {
                console.error('Failed to initialize chat', e);
              }
            }
          `,
        }}
      />

      {/* Initialization script to trigger the chat when ready */}
      <Script
        id="legacy-chat-init-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function initializeChat() {
              if (window._genesys && window.chatSettings && window.jQuery) {
                if (!window._genesys._widgets) {
                  try {
                    if (window.CXBus && typeof window.CXBus.configure === 'function') {
                      window.CXBus.configure({ 
                        debug: true, 
                        pluginsPath: '/assets/genesys/plugins/' 
                      });
                    }
                    if (window.startChat) {
                      // Uncomment this line to automatically open chat for testing
                      // setTimeout(window.startChat, 1000);
                    }
                  } catch(e) {
                    console.error('Failed to initialize Genesys:', e);
                  }
                }
              } else {
                setTimeout(initializeChat, 500);
              }
            })();
          `,
        }}
      />

      {/* Container div for the Genesys chat widget */}
      <div
        id="genesys-chat-container"
        aria-label="Genesys Legacy Chat"
        className="genesys-chat-container"
      />

      {/* Required modal elements for co-browse functionality */}
      <div
        id="cobrowse-sessionConfirm"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        style={{
          background: 'rgba(50, 50, 50, 0.4)',
          position: 'fixed',
          zIndex: 2147483647,
        }}
      >
        <div className="cobrowse-card" style={{ width: '100%' }}>
          <div style={{ textAlign: 'left', marginBottom: '5px' }}>
            <b>Are you on the phone with us?</b>
          </div>
          <div>We can help better if we can see your screen.</div>
          <div
            style={{
              float: 'left',
              marginTop: '10px',
              color: 'rgb(0, 122, 255)',
            }}
          >
            <button
              className="btn btn-secondary cobrowse-deny-button"
              onClick={() => {
                logger.info('[LegacyChatWrapper] Co-browse No clicked', {
                  componentId,
                });
              }}
            >
              No
            </button>
            <button
              className="btn btn-primary cobrowse-allow-button"
              style={{ marginLeft: '10px' }}
              onClick={() => {
                logger.info('[LegacyChatWrapper] Co-browse Yes clicked', {
                  componentId,
                });
                if (
                  typeof window.CobrowseIO?.createSessionCode === 'function'
                ) {
                  window.CobrowseIO.createSessionCode().then((code: string) => {
                    const tokenElement = document.getElementById(
                      'cobrowse-sessionToken',
                    );
                    if (tokenElement) tokenElement.textContent = code;
                  });
                }
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="cobrowse-sessionYesModal"
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-bottom">
          <div className="modal-content sessionmodalcontent">
            <div className="modal-body">
              <div className="scrSharingHead">
                {' '}
                Your session ID is{' '}
                <span
                  id="cobrowse-sessionToken"
                  className="sessiontoken"
                ></span>
              </div>
              <div className="scrSharingSubHead">
                Read this ID number to the representative you&apos;re speaking
                with when they ask for it.
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '0px' }}
                onClick={() => {
                  logger.info('[LegacyChatWrapper] Co-browse Cancel clicked', {
                    componentId,
                  });
                  if (typeof window.endCoBrowseCall === 'function') {
                    window.endCoBrowseCall();
                  }
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
