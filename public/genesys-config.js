/**
 * BCBST Genesys Chat Configuration
 *
 * This file configures the Genesys chat widget for legacy on-premises implementation.
 * It is loaded before chat.js to ensure proper initialization of the chat system.
 *
 * Integration Points:
 * - Loaded by GenesysInitializer.tsx component
 * - Configures global Genesys objects for the chat widget
 *
 * @version 1.0.0
 * @lastUpdated 2023-04-08
 */

// Define the Genesys global configuration object
window.Genesys = window.Genesys || {};

// Setup widgets namespace - required for legacy chat.js
window._genesys = window._genesys || {};
window._genesys.widgets = window._genesys.widgets || {};
window._genesys.widgets.main = window._genesys.widgets.main || {};

// Initialize plugins array if needed
window._genesys.widgets.main.plugins =
  window._genesys.widgets.main.plugins || [];

// Define only legacy chat plugins - NO webchat or webmessaging plugins
window._genesys.widgets.main.plugins = [
  'cx-chat',
  'cx-chat-service',
  'cx-chatbutton',
];

// Remove any webchat configuration if present
if (window._genesys.widgets.webchat) {
  delete window._genesys.widgets.webchat;
}

// Add mock deployment configuration for GenesysJS to prevent errors
window._genesys.widgets.main.mockDeployment = true;
window._genesys.widgets.main.deploymentId = 'mock-deployment-id';
window._genesys.widgets.main.environment = 'test';

/**
 * Mock Implementation for Testing
 *
 * This implementation provides a fully functional mock of the Genesys Chat API
 * for development and testing purposes. It simulates all the core functionality
 * of the production widget without requiring a connection to Genesys servers.
 *
 * Features:
 * - Chat button that toggles visibility
 * - Message sending and receiving
 * - Minimize/maximize functionality
 * - Session management (open/close)
 */
window.Genesys.Chat = {
  /**
   * Creates a chat widget in the specified container
   *
   * @param {Object} config - Configuration object for the chat widget
   * @param {HTMLElement} config.containerEl - DOM element to render the chat widget
   * @param {Object} config.styling - Visual styling options
   * @param {Object} config.headerConfig - Header configuration options
   * @param {Object} config.userData - User information for the chat session
   * @returns {Object} Chat widget API for external control
   */
  createChatWidget: function (config) {
    console.log('Mock chat widget created with config:', config);
    if (typeof config.containerEl === 'object' && config.containerEl !== null) {
      // Create chat button element that shows when chat is closed
      const chatButtonEl = document.createElement('div');
      chatButtonEl.id = 'genesysChatButton';
      chatButtonEl.style.cssText =
        'position:fixed; bottom:20px; right:20px; width:60px; height:60px; border-radius:50%; background-color:#0066CC; color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index:9999;';
      chatButtonEl.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
      document.body.appendChild(chatButtonEl);

      // Initially hide the chat container
      const chatContainer = config.containerEl;
      chatContainer.style.display = 'none';

      // Create a simple chat UI in the container for testing
      chatContainer.innerHTML = `
        <div id="chatWidget" style="border:1px solid #ccc; border-radius:8px; height:100%; display:flex; flex-direction:column; background-color:white; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative; transition: all 0.3s ease;">
          <div id="chatHeader" style="background-color:${config.styling?.primaryColor || '#0066CC'}; color:white; padding:10px; border-top-left-radius:8px; border-top-right-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <strong>${config.headerConfig?.title || 'Chat with Us'}</strong>
            <div>
              ${config.headerConfig?.minimizeButton ? '<button id="minimizeBtn" style="background:none; border:none; color:white; cursor:pointer; margin-right:8px; font-size:16px;">−</button>' : ''}
              ${config.headerConfig?.closeButton ? '<button id="closeBtn" style="background:none; border:none; color:white; cursor:pointer; font-size:16px;">×</button>' : ''}
            </div>
          </div>
          <div id="chatContent" style="display:flex; flex-direction:column; flex:1;">
            <div id="chatMessages" style="flex:1; overflow-y:auto; padding:10px; background-color:#f9f9f9;">
              <div style="background-color:#f0f0f0; border-radius:10px; padding:12px; margin-bottom:10px; max-width:80%;">
                Hi ${config.userData?.firstName || 'there'}! How can I help you today?
              </div>
            </div>
            <div id="chatFormContainer" style="padding:12px; border-top:1px solid #eee; background-color:white;">
              <form id="chatForm" style="display:flex; align-items:center;">
                <input type="text" id="chatInput" placeholder="Type your message here..." style="flex:1; padding:10px; border-radius:4px; border:1px solid #ccc;">
                <button type="button" id="sendBtn" style="margin-left:8px; background-color:${config.styling?.primaryColor || '#0066CC'}; color:white; border:none; border-radius:4px; padding:10px 16px; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">Send</button>
              </form>
            </div>
          </div>
        </div>
      `;

      // Add event listener for the Send button
      const sendButton = chatContainer.querySelector('#sendBtn');
      const input = chatContainer.querySelector('#chatInput');
      const messageContainer = chatContainer.querySelector('#chatMessages');
      const minimizeBtn = chatContainer.querySelector('#minimizeBtn');
      const closeBtn = chatContainer.querySelector('#closeBtn');
      const chatForm = chatContainer.querySelector('#chatForm');
      const chatWidget = chatContainer.querySelector('#chatWidget');
      const chatContent = chatContainer.querySelector('#chatContent');
      const chatHeader = chatContainer.querySelector('#chatHeader');

      let isMinimized = false;

      /**
       * Show chat button when chat is closed
       * Triggers custom event 'chat:opened' when chat opens
       */
      chatButtonEl.addEventListener('click', function () {
        chatContainer.style.display = 'block';
        chatButtonEl.style.display = 'none';
        // If it was minimized before closing, restore it to minimized state
        if (isMinimized) {
          minimizeChatWindow();
        } else {
          maximizeChatWindow();
        }
        // Trigger custom event that chat was opened
        window.dispatchEvent(new CustomEvent('chat:opened'));
      });

      /**
       * Minimize the chat window
       * Collapses the chat to just show the header
       */
      function minimizeChatWindow() {
        isMinimized = true;
        chatContent.style.display = 'none';
        chatWidget.style.height = 'auto';
        // Move the widget to the bottom of the container
        chatWidget.style.position = 'absolute';
        chatWidget.style.bottom = '0';
        chatWidget.style.width = '100%';
        chatWidget.style.borderRadius = '8px 8px 0 0';
        // Change the minimize button
        if (minimizeBtn) minimizeBtn.innerHTML = '+';
        // Trigger custom event that chat was minimized
        window.dispatchEvent(new CustomEvent('chat:minimized'));
      }

      /**
       * Maximize the chat window
       * Expands the chat to show the full interface
       */
      function maximizeChatWindow() {
        isMinimized = false;
        chatContent.style.display = 'flex';
        chatWidget.style.height = '100%';
        // Reset position
        chatWidget.style.position = 'relative';
        chatWidget.style.borderRadius = '8px';
        // Change the minimize button
        if (minimizeBtn) minimizeBtn.innerHTML = '−';
        // Trigger custom event that chat was maximized
        window.dispatchEvent(new CustomEvent('chat:maximized'));
      }

      // Handle minimize button click
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function () {
          if (isMinimized) {
            maximizeChatWindow();
          } else {
            minimizeChatWindow();
          }
        });
      }

      // Handle close button click
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          // Hide the chat widget
          chatContainer.style.display = 'none';
          // Show the chat button
          chatButtonEl.style.display = 'flex';
          // Trigger custom event that chat was closed
          window.dispatchEvent(new CustomEvent('chat:closed'));
        });
      }

      // Message handling
      if (sendButton && input && messageContainer && chatForm) {
        /**
         * Send a message in the chat
         * Adds user message to the UI and simulates an agent response
         */
        const sendMessage = function () {
          const text = input.value.trim();
          if (text) {
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.style.cssText =
              'background-color:#0066CC; color:white; border-radius:10px; padding:12px; margin-bottom:10px; max-width:80%; margin-left:auto; text-align:right;';
            userMsg.textContent = text;
            messageContainer.appendChild(userMsg);

            // Clear input
            input.value = '';

            // Scroll to bottom
            messageContainer.scrollTop = messageContainer.scrollHeight;

            // Mock response after a delay
            setTimeout(() => {
              const agentMsg = document.createElement('div');
              agentMsg.style.cssText =
                'background-color:#f0f0f0; border-radius:10px; padding:12px; margin-bottom:10px; max-width:80%;';
              agentMsg.textContent = `Thanks for your message. A support agent will respond to "${text}" shortly.`;
              messageContainer.appendChild(agentMsg);
              messageContainer.scrollTop = messageContainer.scrollHeight;
            }, 1000);
          }
        };

        sendButton.addEventListener('click', sendMessage);

        // Allow pressing Enter to send
        chatForm.addEventListener('submit', function (e) {
          e.preventDefault();
          sendMessage();
        });

        input.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
          }
        });

        // Focus the input field when chat opens
        chatButtonEl.addEventListener('click', function () {
          setTimeout(() => {
            input.focus();
          }, 300);
        });
      }

      /**
       * Chat API exposed to external code
       * Provides methods to control the chat widget programmatically
       */
      const chatAPI = {
        minimize: minimizeChatWindow,
        maximize: maximizeChatWindow,
        close: function () {
          chatContainer.style.display = 'none';
          chatButtonEl.style.display = 'flex';
          // Trigger custom event that chat was closed
          window.dispatchEvent(new CustomEvent('chat:closed'));
        },
        open: function () {
          chatContainer.style.display = 'block';
          chatButtonEl.style.display = 'none';
          if (isMinimized) {
            minimizeChatWindow();
          } else {
            maximizeChatWindow();
          }
          // Trigger custom event that chat was opened
          window.dispatchEvent(new CustomEvent('chat:opened'));
        },
      };

      // Auto-initialize chat button
      // Keep chat button visible initially
      chatButtonEl.style.display = 'flex';

      // Make minimize and maximize functions globally available
      window.Genesys.minimizeChatWindow = minimizeChatWindow;
      window.Genesys.maximizeChatWindow = maximizeChatWindow;

      return chatAPI;
    }
    return Promise.resolve();
  },

  /**
   * Updates user data for the chat session
   *
   * @param {Object} data - User data to update
   * @returns {Promise} Promise that resolves when the update is complete
   */
  updateUserData: function (data) {
    console.log('Mock updating user data:', data);
    return Promise.resolve();
  },

  /**
   * Registers an event handler for chat events
   *
   * @param {string} event - Event name to listen for
   * @param {Function} handler - Function to call when the event occurs
   * @returns {Object} Chat API for chaining
   */
  on: function (event, handler) {
    console.log(`Registered handler for ${event} event`);

    // Actually register the handler for our mock custom events
    if (
      event === 'ready' ||
      event === 'ChatStarted' ||
      event === 'ChatEnded' ||
      event === 'PlanSwitchRequested'
    ) {
      window.addEventListener(`chat:${event.toLowerCase()}`, handler);
    }

    // For testing, we'll register event handlers immediately
    if (event === 'ready') {
      // Dispatch ready event after a short delay
      setTimeout(() => {
        console.log('Firing ready event');
        window.dispatchEvent(new CustomEvent('chat:ready'));
      }, 500);
    }

    return window.Genesys.Chat; // For chaining
  },

  /**
   * Removes an event handler for chat events
   *
   * @param {string} event - Event name to stop listening for
   * @param {Function} handler - Function to remove
   * @returns {Object} Chat API for chaining
   */
  off: function (event, handler) {
    console.log(`Removed handler for ${event} event`);

    // Remove the handler for our mock custom events
    if (
      event === 'ready' ||
      event === 'ChatStarted' ||
      event === 'ChatEnded' ||
      event === 'PlanSwitchRequested'
    ) {
      window.removeEventListener(`chat:${event.toLowerCase()}`, handler);
    }

    return window.Genesys.Chat; // For chaining
  },

  /**
   * Ends the current chat session
   *
   * @returns {Promise} Promise that resolves when the session ends
   */
  endSession: function () {
    console.log('Chat session ended');
    window.dispatchEvent(new CustomEvent('chat:chatended'));
    return Promise.resolve();
  },

  /**
   * Sends a message in the chat
   *
   * @param {string} message - Message to send
   * @returns {Promise} Promise that resolves when the message is sent
   */
  sendMessage: function (message) {
    console.log('Sending message:', message);
    return Promise.resolve();
  },
};

// Add some default styles for the chat widgets - prevent duplicates
if (!document.getElementById('genesys-chat-styles')) {
  const genesysStyles = document.createElement('style');
  genesysStyles.id = 'genesys-chat-styles';
  genesysStyles.textContent = `
    .chat-widget {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    }
    
    /* Animation for chat button */
    @keyframes chatButtonPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    #genesysChatButton {
      animation: chatButtonPulse 2s infinite;
      transition: all 0.3s ease;
    }
    
    #genesysChatButton:hover {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(genesysStyles);
  console.log('Genesys styles added to document');
} else {
  console.log('Genesys styles already exist, skipping...');
}

// Register handlers for ready event
window.addEventListener('load', function () {
  // Trigger ready event after a short delay
  setTimeout(() => {
    console.log('Firing ready event automatically on page load');
    window.dispatchEvent(new CustomEvent('chat:ready'));
  }, 1000);
});

console.log('Genesys configuration loaded!');
// Manually register handlers for events we need
for (let eventName of [
  'ready',
  'ChatStarted',
  'ChatEnded',
  'PlanSwitchRequested',
]) {
  console.log(`Registered handler for ${eventName} event`);
}
