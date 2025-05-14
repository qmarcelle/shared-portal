'use client';

/**
 * ChatWidget Component with Debug Tools
 *
 * Enhanced with direct script/CSS loading and debug controls
 * to help diagnose loading issues in the browser.
 */

import { usePlanContext } from '@/app/chat/hooks/usePlanContext';
import { useUserContext } from '@/app/chat/hooks/useUserContext';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define Genesys-specific properties for typechecking
interface GenesysWindow {
  chatSettings?: Record<string, any>;
  gmsServicesConfig?: {
    GMSChatURL: () => string;
  };
  _forceChatButtonCreate?: () => boolean;
  CXBus?: Record<string, any>;
}

// Define a type that allows any chat settings structure
interface ChatWidgetProps {
  chatSettings?: Record<string, any>;
}

export default function ChatWidget({ chatSettings = {} }: ChatWidgetProps) {
  // Track component state
  const [hasConfigLoaded, setHasConfigLoaded] = useState(false);
  const [scriptLoadFailed, setScriptLoadFailed] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(true); // Debug mode enabled by default
  const [scriptState, setScriptState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const didInitialize = useRef(false);
  const cssInjected = useRef(false);

  // Get chat configuration from store
  const { genesysChatConfig, isLoading, error, loadChatConfiguration } =
    useChatStore();

  // Get user and plan contexts
  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    isPlanContextLoading,
    error: planError,
  } = usePlanContext();

  // Extract member and plan IDs for configuration loading
  const memberId = userContext?.memberId;
  const planId = planContext?.planId;

  // Debug logging helper
  const debug = useCallback((message: string) => {
    console.log(`[DEBUG] ${message}`);
    setDebugLogs((prev) => [
      ...prev,
      `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`,
    ]);
  }, []);

  // Initialize chat configuration
  const initializeChat = useCallback(() => {
    if (
      memberId &&
      planId &&
      !genesysChatConfig &&
      !isLoading &&
      !error &&
      !didInitialize.current
    ) {
      debug(
        `Initializing chat config for memberId: ${memberId}, planId: ${planId}`,
      );
      didInitialize.current = true;
      loadChatConfiguration(memberId, planId);
    }
  }, [
    loadChatConfiguration,
    memberId,
    planId,
    genesysChatConfig,
    isLoading,
    error,
    debug,
  ]);

  // Set up window configuration when genesysChatConfig is available
  useEffect(() => {
    if (genesysChatConfig && window) {
      debug(
        `Setting window.chatSettings with keys: ${Object.keys(genesysChatConfig).join(', ')}`,
      );

      try {
        // Set up window objects with complete configuration
        (window as unknown as GenesysWindow).chatSettings = genesysChatConfig;
        debug('Window configuration set successfully');
        setHasConfigLoaded(true);
      } catch (err) {
        debug(
          `Error setting window configuration: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  }, [genesysChatConfig, debug]);

  // Load chat configuration when contexts are ready
  useEffect(() => {
    if (memberId && planId) {
      initializeChat();
    }
  }, [memberId, planId, initializeChat]);

  // Direct script loading function
  const loadScriptDirectly = useCallback(() => {
    debug('Loading script directly via DOM manipulation');

    try {
      // Remove existing script if any
      const existingScript = document.getElementById('debug-chat-script');
      if (existingScript) {
        debug('Removing existing script element');
        existingScript.remove();
      }

      // Try different paths
      const scriptPath = '/assets/genesys/click_to_chat.js';
      debug(`Using script path: ${scriptPath}`);

      // Create script element
      const script = document.createElement('script');
      script.src = scriptPath;
      script.id = 'debug-chat-script';

      // Add error and load handlers
      script.onload = () => {
        debug(`✅ Script loaded successfully!`);
        setScriptState('ready');

        // Give time for the script to initialize
        setTimeout(() => {
          debug('Checking for _forceChatButtonCreate function');
          if ((window as any)._forceChatButtonCreate) {
            debug('Calling _forceChatButtonCreate()');
            (window as any)._forceChatButtonCreate();
          } else {
            debug('⚠️ _forceChatButtonCreate function not found');
          }

          // Try event dispatch as fallback
          debug('Dispatching genesys:create-button event');
          document.dispatchEvent(new CustomEvent('genesys:create-button'));
        }, 1000);
      };

      script.onerror = () => {
        debug(`❌ Script failed to load: ${scriptPath}`);
        setScriptState('error');
        setScriptLoadFailed(true);
      };

      // Add to document
      document.body.appendChild(script);
      debug('Script element added to document.body');
    } catch (err) {
      debug(
        `❌ Error loading script: ${err instanceof Error ? err.message : String(err)}`,
      );
      setScriptState('error');
      setScriptLoadFailed(true);
    }
  }, [debug]);

  // Load CSS files
  const loadCSSFiles = useCallback(() => {
    debug('Loading CSS files directly via DOM manipulation');

    try {
      const cssFiles = [
        {
          id: 'debug-widgets-css',
          href: '/assets/genesys/plugins/widgets.min.css',
        },
        {
          id: 'debug-custom-css',
          href: '/assets/genesys/styles/bcbst-custom.css',
        },
      ];

      cssFiles.forEach((file) => {
        if (document.getElementById(file.id)) {
          debug(`CSS already exists: ${file.id}`);
          return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = file.href;
        link.id = file.id;

        link.onload = () => debug(`✅ CSS loaded: ${file.id}`);
        link.onerror = () => debug(`❌ CSS failed to load: ${file.id}`);

        document.head.appendChild(link);
        debug(`CSS link added: ${file.id}`);
      });

      setCssLoaded(true);
      cssInjected.current = true;
    } catch (err) {
      debug(
        `❌ Error loading CSS: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }, [debug]);

  // Check window objects
  const checkWindowObjects = useCallback(() => {
    debug('Checking window objects for Genesys properties');

    if ((window as any).chatSettings) {
      debug(
        `✅ window.chatSettings exists with ${Object.keys((window as any).chatSettings).length} keys`,
      );
    } else {
      debug('❌ window.chatSettings not found');
    }

    if ((window as any).gmsServicesConfig) {
      debug('✅ window.gmsServicesConfig exists');
    } else {
      debug('❌ window.gmsServicesConfig not found');
    }

    if ((window as any)._forceChatButtonCreate) {
      debug('✅ window._forceChatButtonCreate function exists');
    } else {
      debug('❌ window._forceChatButtonCreate function not found');
    }

    if ((window as any).CXBus) {
      debug('✅ window.CXBus exists');
    } else {
      debug('❌ window.CXBus not found');
    }
  }, [debug]);

  // Verify file exists
  const verifyFileExists = useCallback(async () => {
    debug('Verifying script file exists using fetch');

    try {
      const response = await fetch('/assets/genesys/click_to_chat.js');
      if (response.ok) {
        const text = await response.text();
        debug(
          `✅ File exists! Status: ${response.status}, Size: ${text.length} bytes`,
        );
      } else {
        debug(
          `❌ File not found. Status: ${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      debug(
        `❌ Fetch error: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }, [debug]);

  // Look for button in DOM
  const checkForChatButton = useCallback(() => {
    debug('Checking DOM for chat button element');

    const button = document.querySelector('.cx-widget.cx-webchat-chat-button');
    if (button) {
      debug('✅ Chat button found in DOM');

      // Log position
      const rect = button.getBoundingClientRect();
      debug(
        `Button position: x=${rect.x}, y=${rect.y}, width=${rect.width}, height=${rect.height}`,
      );
    } else {
      debug('❌ Chat button not found in DOM');

      // Try manual creation
      debug('Attempting manual button creation');

      try {
        const manualButton = document.createElement('div');
        manualButton.className =
          'cx-widget cx-webchat-chat-button fallback-chat-button';
        manualButton.textContent = 'Chat (Manual)';
        manualButton.style.cssText =
          'position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background: #0056b3; color: white; border-radius: 5px; cursor: pointer; z-index: 9999;';

        manualButton.addEventListener('click', () => {
          debug('Manual chat button clicked');
          if ((window as any).CXBus && (window as any).CXBus.command) {
            debug('Calling CXBus.command("WebChat.open")');
            (window as any).CXBus.command('WebChat.open');
          } else {
            debug('CXBus not available for manual button');
            alert('Chat service not fully loaded');
          }
        });

        document.body.appendChild(manualButton);
        debug('✅ Manual chat button created');
      } catch (err) {
        debug(
          `❌ Error creating manual button: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  }, [debug]);

  // Full initialization sequence
  const fullInitialize = useCallback(() => {
    debug('Starting full initialization sequence');

    // 1. Set window.chatSettings
    if (genesysChatConfig) {
      debug('Setting window.chatSettings');
      (window as unknown as GenesysWindow).chatSettings = genesysChatConfig;
    } else {
      debug('⚠️ No chat config available');
    }

    // 2. Load CSS files
    loadCSSFiles();

    // 3. Load script directly
    setTimeout(() => {
      loadScriptDirectly();

      // 4. Check results after delay
      setTimeout(() => {
        checkWindowObjects();
        checkForChatButton();
      }, 2000);
    }, 500);
  }, [
    genesysChatConfig,
    loadCSSFiles,
    loadScriptDirectly,
    checkWindowObjects,
    checkForChatButton,
    debug,
  ]);

  // Debug panel component
  const DebugPanel = () => (
    <div
      style={{
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
        margin: '15px 0',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h3 style={{ margin: 0 }}>Genesys Chat Debug Controls</h3>
        <button
          onClick={() => setShowDebug(false)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#f87171',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Hide Debug Panel
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '15px',
        }}
      >
        <button
          onClick={loadScriptDirectly}
          style={{
            padding: '6px 12px',
            backgroundColor: '#0284c7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Load Script
        </button>

        <button
          onClick={loadCSSFiles}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Load CSS
        </button>

        <button
          onClick={verifyFileExists}
          style={{
            padding: '6px 12px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Verify File
        </button>

        <button
          onClick={checkWindowObjects}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Check Window
        </button>

        <button
          onClick={checkForChatButton}
          style={{
            padding: '6px 12px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Find Button
        </button>

        <button
          onClick={fullInitialize}
          style={{
            padding: '6px 12px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Full Initialize
        </button>

        <button
          onClick={() =>
            window.open('/assets/genesys/click_to_chat.js', '_blank')
          }
          style={{
            padding: '6px 12px',
            backgroundColor: '#475569',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Open File URL
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Config Status</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '4px 10px',
              backgroundColor: userContext ? '#10b981' : '#d1d5db',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            User Context: {userContext ? '✓' : '✗'}
          </div>

          <div
            style={{
              padding: '4px 10px',
              backgroundColor: planContext ? '#10b981' : '#d1d5db',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            Plan Context: {planContext ? '✓' : '✗'}
          </div>

          <div
            style={{
              padding: '4px 10px',
              backgroundColor: genesysChatConfig ? '#10b981' : '#d1d5db',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            Chat Config: {genesysChatConfig ? '✓' : '✗'}
          </div>

          <div
            style={{
              padding: '4px 10px',
              backgroundColor: hasConfigLoaded ? '#10b981' : '#d1d5db',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            Window Config: {hasConfigLoaded ? '✓' : '✗'}
          </div>

          <div
            style={{
              padding: '4px 10px',
              backgroundColor: cssLoaded ? '#10b981' : '#d1d5db',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            CSS Loaded: {cssLoaded ? '✓' : '✗'}
          </div>

          <div
            style={{
              padding: '4px 10px',
              backgroundColor:
                scriptState === 'ready'
                  ? '#10b981'
                  : scriptState === 'error'
                    ? '#ef4444'
                    : '#f59e0b',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            Script:{' '}
            {scriptState === 'ready'
              ? 'Loaded ✓'
              : scriptState === 'error'
                ? 'Failed ✗'
                : 'Loading...'}
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Debug Logs</h4>
        <div
          style={{
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            padding: '10px',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px',
          }}
        >
          {debugLogs.length === 0 ? (
            <div style={{ color: '#94a3b8' }}>
              No logs yet. Click a button to start debugging.
            </div>
          ) : (
            debugLogs.map((log, index) => <div key={index}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );

  // Content without debug panel (just shows button to enable it)
  const NormalContent = () => (
    <div>
      {!showDebug && (
        <button
          onClick={() => setShowDebug(true)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#0284c7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            margin: '10px 0',
          }}
        >
          Show Debug Controls
        </button>
      )}
      <div id="genesys-chat-container"></div>
    </div>
  );

  // Main render
  return (
    <div>
      {showDebug && <DebugPanel />}
      <NormalContent />
    </div>
  );
}
