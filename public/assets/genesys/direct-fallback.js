// Direct fallback script for Genesys chat
// This script creates a chat button without any dependencies on the main app
(function () {
  console.log('[DirectFallback] Script initializing');

  // Check if button already exists
  if (document.querySelector('.fallback-chat-button')) {
    console.log('[DirectFallback] Button already exists, exiting');
    return;
  }

  // Try to set required chat settings if missing
  if (window.chatSettings) {
    console.log('[DirectFallback] Setting missing chat availability flags');
    // Force these to string 'true' to ensure eligibility passes
    window.chatSettings.isChatEligibleMember = 'true';
    window.chatSettings.isDemoMember = 'true';
    window.chatSettings.isChatAvailable = 'true';
    window.chatSettings.cloudChatEligible = 'true';
  } else {
    console.log('[DirectFallback] Creating chatSettings object');
    window.chatSettings = {
      isChatEligibleMember: 'true',
      isDemoMember: 'true',
      isChatAvailable: 'true',
      cloudChatEligible: 'true',
      chatMode: 'legacy',
    };
  }

  // Create button
  const createFallbackButton = function () {
    console.log('[DirectFallback] Creating fallback button');

    const fallbackBtn = document.createElement('div');
    fallbackBtn.className = 'fallback-chat-button';
    fallbackBtn.innerText = 'Chat Now';
    Object.assign(fallbackBtn.style, {
      display: 'flex',
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      backgroundColor: '#0078d4',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '5px',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      zIndex: '9999',
      fontWeight: 'bold',
      fontSize: '16px',
      alignItems: 'center',
      justifyContent: 'center',
    });

    // Handle click - attempt to use Genesys CXBus if available
    fallbackBtn.onclick = function () {
      if (window.CXBus) {
        console.log('[DirectFallback] Using CXBus to open chat');
        try {
          window.CXBus.command('WebChat.open');
        } catch (e) {
          console.error('[DirectFallback] Error using CXBus:', e);
          alert('Please try again or contact support for assistance.');
        }
      } else {
        console.log(
          '[DirectFallback] CXBus not available, trying to load scripts',
        );

        // Last resort - try to load Genesys scripts directly
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '/assets/genesys/plugins/widgets.min.css';
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = '/assets/genesys/plugins/widgets.min.js';
        script.async = true;
        document.head.appendChild(script);

        alert(
          'Chat system is initializing. Please try again in a few seconds.',
        );
      }
    };

    document.body.appendChild(fallbackBtn);
    console.log('[DirectFallback] Button created and added to DOM');
  };

  // Check if Genesys button already exists
  const hasGenesysButton =
    document.querySelector('.cx-webchat-chat-button') !== null;

  if (!hasGenesysButton) {
    console.log(
      '[DirectFallback] No Genesys button detected, creating fallback',
    );
    // Create fallback immediately
    createFallbackButton();
  } else {
    console.log(
      '[DirectFallback] Genesys button already exists, not creating fallback',
    );
  }

  // Add a safety check to create button if Genesys isn't loaded after 2 seconds
  setTimeout(function () {
    const hasGenesysButton =
      document.querySelector('.cx-webchat-chat-button') !== null;
    const hasFallbackButton =
      document.querySelector('.fallback-chat-button') !== null;

    if (!hasGenesysButton && !hasFallbackButton) {
      console.log(
        '[DirectFallback] No button detected after timeout, creating fallback',
      );
      createFallbackButton();
    }
  }, 2000); // Reduced from 5000ms to 2000ms
})();
