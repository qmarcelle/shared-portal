// Debug utilities for Genesys chat (can be removed later)
export function setupChatDebugger() {
  if (typeof window === 'undefined') return;
  // Add a global debug function that can be called from browser console
  (window as any).debugChatButton = function () {
    console.log('[GLOBAL] Chat debug information:', {
      genesysButton: document.querySelector('.cx-webchat-chat-button')
        ? 'Found'
        : 'Not found',
      debugButton: document.querySelector('#debug-chat-btn')
        ? 'Found'
        : 'Not found',
      _genesys: !!window._genesys,
      hasWebchatModule: !!(window as any)._genesys?.widgets?.webchat,
      CXBus: !!(window as any).CXBus,
      CXBusCommand: typeof (window as any).CXBus?.command === 'function',
      openGenesysChat: typeof (window as any).openGenesysChat === 'function',
      _FORCE_CHAT_AVAILABLE: (window as any)._FORCE_CHAT_AVAILABLE,
      chatSettings: (window as any).chatSettings ? 'Present' : 'Missing',
      enableChatButton: typeof (window as any).enableChatButton === 'function',
      timestamp: new Date().toISOString(),
    });
    return 'Debug information logged to console. Check for DOM button presence and JS functions.';
  };
  // Also create a function to force show the chat button
  (window as any).forceShowChatButton = function () {
    // This function should be implemented in chatUtils and imported here if needed
    if (typeof (window as any).createEmergencyChatButton === 'function') {
      return (window as any).createEmergencyChatButton();
    }
    console.warn('createEmergencyChatButton is not available on window.');
  };
  console.log(
    '[ChatDebugger] Debug utilities added to window. Try window.debugChatButton() or window.forceShowChatButton()',
  );
}
