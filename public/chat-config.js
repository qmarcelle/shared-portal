'use strict';

/* eslint-disable no-console, no-undef */

/**
 * Mock Chat Configuration
 * This provides a fully functional mock of the Genesys Chat API
 * for development and testing purposes.
 */

// Initialize required global objects first
window._genesys = window._genesys || {};
window._gt = window._gt || [];

// IMPORTANT: Set core deployment settings at global level
window._genesys = {
  deploymentId: 'local-deployment',
  environment: 'test',
  widgets: {
    main: {
      debug: true,
      theme: 'light',
      lang: 'en',
      mobileModeEnabled: true,
      plugins: ['cx-webchat-service', 'cx-webchat'],
      preload: ['webchat'],
    },
    webchat: {
      transport: {
        type: 'purecloud-v2-sockets',
        dataURL: 'https://api.test.genesys.com',
        deploymentKey: 'local-deployment',
        orgGuid: 'test-org',
        markdown: true,
      },
      emojis: true,
      cometD: { enabled: false },
      autoInvite: {
        enabled: false,
        timeToInviteSeconds: 5,
        inviteTimeoutSeconds: 30,
      },
      chatButton: {
        enabled: true,
        template:
          '<div class="cx-widget cx-webchat-chat-button chatbutton-minimized" role="button" tabindex="0" data-message="Chat with an agent" aria-label="Chat with an agent"></div>',
        effect: 'fade',
        openDelay: 1000,
        effectDuration: 300,
        hideDuringInvite: true,
      },
      minimizeOnLoad: true,
      enableMinimize: true,
      showMinimizeButton: true,
    },
  },
};

// Initialize backwards compatibility
window.Genesys = window.Genesys || {};
window.Genesys = { ...window._genesys };

console.log(
  '[CHAT-CONFIG] Configuration loaded with deploymentId:',
  window._genesys.deploymentId,
);
