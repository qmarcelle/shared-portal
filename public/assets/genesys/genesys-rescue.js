/**
 * Genesys Chat Widget Rescue Script
 * This script prevents widget initialization loops and button proliferation
 *
 * How to use:
 * 1. Include this script after the main Genesys scripts
 * 2. It will automatically monitor the DOM for excessive button creation
 * 3. If detected, it will cleanup and create a reliable fallback button
 */

(function () {
  console.log('[Genesys Rescue] Initializing rescue script...');

  // Configuration
  const CONFIG = {
    MAX_BUTTONS: 3, // Maximum acceptable number of buttons before intervention
    CHECK_INTERVAL_MS: 2000, // How often to check for button proliferation
    BUTTON_SELECTORS: [
      // CSS selectors for identifying Genesys buttons
      '.cx-widget.cx-webchat-chat-button',
      '.cx-webchat-chat-button',
      '[data-cx-widget="WebChat"]',
      '.cx-button.cx-webchat',
      '.cx-button',
      '[class*="cx-button"]',
    ],
    MAX_CHECKS: 30, // Maximum number of checks before giving up
    FALLBACK_BUTTON_ID: 'genesys-rescue-fallback-button',
  };

  // State tracking
  let checkCount = 0;
  let proliferationDetected = false;
  let interventionApplied = false;
  let checkInterval = null;

  // Helper to count buttons in the DOM
  function countButtons() {
    return CONFIG.BUTTON_SELECTORS.reduce((count, selector) => {
      return count + document.querySelectorAll(selector).length;
    }, 0);
  }

  // Helper to log with timestamp
  function log(message, data) {
    console.log(
      `[Genesys Rescue ${new Date().toISOString().slice(11, 19)}] ${message}`,
      data || '',
    );
  }

  // Clean up excess buttons to prevent DOM overflow
  function cleanupButtons() {
    let removedCount = 0;

    CONFIG.BUTTON_SELECTORS.forEach((selector) => {
      const buttons = document.querySelectorAll(selector);
      if (buttons.length > 1) {
        // Keep first button, remove others
        for (let i = 1; i < buttons.length; i++) {
          try {
            buttons[i].remove();
            removedCount++;
          } catch (e) {
            // Ignore removal errors
          }
        }
      }
    });

    if (removedCount > 0) {
      log(`Removed ${removedCount} excess buttons`);
    }

    return removedCount;
  }

  // Create a reliable fallback button
  function createFallbackButton() {
    // Check if our fallback already exists
    if (document.getElementById(CONFIG.FALLBACK_BUTTON_ID)) {
      return false;
    }

    const button = document.createElement('button');
    button.id = CONFIG.FALLBACK_BUTTON_ID;
    button.innerText = '💬';
    button.setAttribute('aria-label', 'Chat with us');
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #0078d4;
      color: white;
      font-size: 24px;
      border: none;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Add click handling to open chat
    button.onclick = function () {
      log('Fallback button clicked');

      // Try multiple approaches to open the chat
      if (
        window._genesysCXBus &&
        typeof window._genesysCXBus.command === 'function'
      ) {
        try {
          window._genesysCXBus.command('WebChat.open');
        } catch (e) {
          log('Error using CXBus to open chat', e);
        }
      }

      // Try alternative approaches if available
      if (
        window.GenesysChat &&
        typeof window.GenesysChat.openChat === 'function'
      ) {
        try {
          window.GenesysChat.openChat();
        } catch (e) {
          log('Error using GenesysChat.openChat', e);
        }
      }

      // Also try to notify any React components
      try {
        const event = new CustomEvent('genesys:rescue:openchat');
        document.dispatchEvent(event);
      } catch (e) {
        // Ignore event dispatch errors
      }
    };

    document.body.appendChild(button);
    log('Created fallback button');
    return true;
  }

  // Detect initializaton problems
  function detectGenesysInitializationFailure() {
    // Check for the specific error condition we've seen
    const hasGenesysObject = typeof window._genesys !== 'undefined';
    const hasWidgetsObject = Boolean(window._genesys?.widgets);
    const hasMainObject = Boolean(window._genesys?.widgets?.main);
    const hasInitializeFunction =
      typeof window._genesys?.widgets?.main?.initialise === 'function';

    // If we have the objects but not the function, that's our specific error
    if (
      hasGenesysObject &&
      hasWidgetsObject &&
      hasMainObject &&
      !hasInitializeFunction
    ) {
      log(
        'Detected specific initialization failure: _genesys.widgets.main.initialise is NOT a function',
      );
      return true;
    }

    return false;
  }

  // Main check function that runs periodically
  function performCheck() {
    checkCount++;

    // Check for button proliferation
    const buttonCount = countButtons();

    if (buttonCount > CONFIG.MAX_BUTTONS) {
      if (!proliferationDetected) {
        log(`Button proliferation detected! Found ${buttonCount} buttons.`);
        proliferationDetected = true;
      }

      // Clean up excess buttons
      cleanupButtons();

      // Apply intervention if not already done
      if (!interventionApplied) {
        log('Applying emergency intervention');
        createFallbackButton();
        interventionApplied = true;
      }
    }

    // Also check for the specific initialization failure
    if (detectGenesysInitializationFailure()) {
      if (!interventionApplied) {
        log('Applying emergency intervention due to initialization failure');
        cleanupButtons();
        createFallbackButton();
        interventionApplied = true;
      }
    }

    // Stop checking if we've reached max attempts or intervention applied
    if (
      checkCount >= CONFIG.MAX_CHECKS ||
      (interventionApplied && proliferationDetected)
    ) {
      log(
        `Stopping checks: count=${checkCount}, intervention=${interventionApplied}`,
      );
      clearInterval(checkInterval);
    }
  }

  // Start periodic checking
  function startMonitoring() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeMonitoring);
    } else {
      initializeMonitoring();
    }

    function initializeMonitoring() {
      log('Starting button proliferation monitoring');
      checkInterval = setInterval(performCheck, CONFIG.CHECK_INTERVAL_MS);

      // Perform an immediate check
      performCheck();
    }
  }

  // Add global rescue utility
  window.genesysRescue = {
    checkNow: performCheck,
    cleanup: cleanupButtons,
    createFallback: createFallbackButton,
    config: CONFIG,
  };

  // Start monitoring
  startMonitoring();
})();
