/**
 * Collection of utility functions for DOM manipulation related to chat functionality.
 * These utilities help integrate the chat widget with the rest of the application
 * and provide consistent user experience across cloud and legacy implementations.
 */

/**
 * Registry of overrides for Genesys widget behavior.
 * This allows custom behavior to be injected when the widget is ready.
 */
type GenesysOverrideFunction = () => void;
const genesysOverrides: GenesysOverrideFunction[] = [];

/**
 * Registers a function to override default Genesys widget behavior.
 * These functions will be executed when the widget is ready.
 *
 * @param fn - The override function to register
 */
export const registerGenesysOverride = (fn: GenesysOverrideFunction): void => {
  genesysOverrides.push(fn);
};

/**
 * Executes all registered override functions.
 * Called when the widget is ready.
 */
export const executeGenesysOverrides = (): void => {
  genesysOverrides.forEach((fn) => {
    try {
      fn();
    } catch (error) {
      console.error('Error executing Genesys override:', error);
    }
  });
};

/**
 * Forces the chat button to appear as a circular button.
 * This ensures consistent styling across implementations.
 */
export const forceCircularChatButton = (): void => {
  setTimeout(() => {
    const chatButton = document.querySelector(
      '.cx-widget.cx-webchat-chat-button',
    );
    if (chatButton) {
      chatButton.classList.add('circular-chat-button');
    }
  }, 100);
};

/**
 * Hides the inquiry type dropdown in the legacy chat interface.
 * This simplifies the user experience for standard chat flows.
 */
export const hideInquiryDropdown = (): void => {
  const dropdown = document.querySelector('.cx-inquiry-dropdown');
  if (dropdown) {
    dropdown.classList.add('hidden');
  }
};

/**
 * Injects a badge for new messages.
 * This improves notification visibility when the chat is minimized.
 */
export const injectNewMessageBadge = (): void => {
  const chatContainer = document.getElementById('genesys-chat-container');
  if (!chatContainer) return;

  const badge = document.createElement('div');
  badge.className = 'new-message-badge hidden';
  badge.innerHTML = '1';
  chatContainer.appendChild(badge);
};

/**
 * Injects plan switcher controls into the chat interface.
 * This allows users to switch plans during chat if not locked.
 */
export const injectPlanSwitcher = (): void => {
  const chatContainer = document.getElementById('genesys-chat-container');
  if (!chatContainer) return;

  const planSwitcherContainer = document.createElement('div');
  planSwitcherContainer.className = 'plan-switcher-container';
  planSwitcherContainer.setAttribute('data-testid', 'plan-switcher-container');

  // Add to chat container
  const headerSection = chatContainer.querySelector('.cx-header');
  if (headerSection) {
    headerSection.appendChild(planSwitcherContainer);
  }
};

/**
 * Locks the plan switcher during active chat.
 * This prevents plan switching during an active chat session.
 */
export const lockPlanSwitcher = (): void => {
  const planSwitcher = document.querySelector('[data-testid="plan-switcher"]');
  if (!planSwitcher) return;

  // Disable the plan switcher
  planSwitcher.setAttribute('disabled', 'true');
  planSwitcher.classList.add('locked');

  // Show the locked state visually
  const container = planSwitcher.closest('.plan-switcher-container');
  if (container) {
    container.classList.add('locked');
  }

  // Show tooltip
  showPlanSwitcherTooltip();
};

/**
 * Unlocks the plan switcher after chat ends.
 * This allows users to switch plans again after a chat session.
 */
export const unlockPlanSwitcher = (): void => {
  const planSwitcher = document.querySelector('[data-testid="plan-switcher"]');
  if (!planSwitcher) return;

  // Enable the plan switcher
  planSwitcher.removeAttribute('disabled');
  planSwitcher.classList.remove('locked');

  // Remove locked state visually
  const container = planSwitcher.closest('.plan-switcher-container');
  if (container) {
    container.classList.remove('locked');
  }

  // Hide tooltip
  const tooltip = document.querySelector('.plan-switcher-tooltip');
  if (tooltip) {
    tooltip.classList.add('hidden');
  }
};

/**
 * Shows a tooltip explaining plan switcher status.
 * This provides context to users about why the plan switcher is locked.
 */
export const showPlanSwitcherTooltip = (): void => {
  const planSwitcher = document.querySelector('[data-testid="plan-switcher"]');
  if (!planSwitcher) return;

  let tooltip = document.querySelector('.plan-switcher-tooltip');

  // Create tooltip if it doesn't exist
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'plan-switcher-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.textContent =
      'Plan switching is disabled during an active chat session';

    const container = planSwitcher.closest('.plan-switcher-container');
    if (container) {
      container.appendChild(tooltip);
    }
  }

  // Show tooltip
  tooltip.classList.remove('hidden');
};

/**
 * Updates the UI to reflect chat eligibility.
 * This ensures users are aware of their chat eligibility status.
 *
 * @param isEligible - Whether the user is eligible for chat
 */
export const updateChatEligibilityUI = (isEligible: boolean): void => {
  const chatContainer = document.getElementById('genesys-chat-container');
  if (!chatContainer) return;

  if (isEligible) {
    chatContainer.classList.remove('ineligible');
    chatContainer.classList.add('eligible');
  } else {
    chatContainer.classList.remove('eligible');
    chatContainer.classList.add('ineligible');
  }
};

/**
 * Updates the UI to display plan information.
 * This ensures users know which plan they are chatting about.
 *
 * @param isVisible - Whether to show or hide plan information
 */
export const updatePlanDisplayUI = (isVisible: boolean): void => {
  const planDisplay = document.querySelector('.plan-info-header');
  if (!planDisplay) return;

  if (isVisible) {
    planDisplay.classList.remove('hidden');
  } else {
    planDisplay.classList.add('hidden');
  }
};

/**
 * Updates the UI to reflect business hours.
 * This ensures users are aware of when chat is available.
 *
 * @param isOpen - Whether business hours are currently open
 * @param hoursText - Text describing business hours
 */
export const updateBusinessHoursUI = (
  isOpen: boolean,
  hoursText: string,
): void => {
  const hoursElement = document.querySelector('.business-hours');
  if (!hoursElement) return;

  if (isOpen) {
    hoursElement.classList.add('open');
    hoursElement.classList.remove('closed');
  } else {
    hoursElement.classList.remove('open');
    hoursElement.classList.add('closed');
  }

  const textElement = hoursElement.querySelector('.hours-text');
  if (textElement) {
    textElement.textContent = hoursText;
  }
};

/**
 * Wires up event handlers for header buttons.
 * This ensures consistent behavior for header controls.
 */
export const wireHeaderButtons = (): void => {
  const minimizeButton = document.querySelector('.cx-minimize');
  const closeButton = document.querySelector('.cx-close');

  if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {
      if (window.CXBus?.runtime) {
        window.CXBus.runtime.command('WebChat.minimize');
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      if (window.CXBus?.runtime) {
        window.CXBus.runtime.command('WebChat.endChat');
        window.CXBus.runtime.command('WebChat.close');
      }
    });
  }
};

/**
 * Wires up maximize event handler.
 * This ensures the chat can be maximized after being minimized.
 */
export const wireMaximizeEvent = (): void => {
  const chatButton = document.querySelector(
    '.cx-widget.cx-webchat-chat-button',
  );
  if (chatButton) {
    chatButton.addEventListener('click', () => {
      if (window.CXBus?.runtime) {
        window.CXBus.runtime.command('WebChat.maximize');
      }
    });
  }
};

/**
 * Wires up close button with fallback.
 * This ensures the chat can be closed in all scenarios.
 */
export const wireCloseWithFallback = (): void => {
  const closeButton = document.querySelector('.cx-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      try {
        if (window.CXBus?.runtime) {
          window.CXBus.runtime.command('WebChat.endChat');
          setTimeout(() => {
            window.CXBus?.runtime.command('WebChat.close');
          }, 300);
        }
      } catch (error) {
        console.error('Error closing chat, using fallback:', error);
        // Fallback: hide element directly
        const chatWindow = document.querySelector('.cx-widget.cx-webchat');
        if (chatWindow) {
          chatWindow.classList.add('hidden');
        }
      }
    });
  }
};

/**
 * Starts an observer to monitor Genesys widget DOM changes.
 * This allows dynamic adjustments to widget behavior.
 */
export const startGenesysWidgetObserver = (): void => {
  const targetNode = document.getElementById('genesys-chat-container');
  if (!targetNode) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check for newly added elements and apply custom behavior
        executeGenesysOverrides();
      }
    });
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true,
  });
};
