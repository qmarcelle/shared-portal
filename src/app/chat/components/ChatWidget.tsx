'use client';

/**
 * ChatWidget Component
 *
 * Uses the GenesysScriptLoader for a more reliable approach to loading the Genesys chat script.
 */

import GenesysScriptLoader from './GenesysScriptLoader';

export default function ChatWidget() {
  return (
    <>
      <style>{`
        .cobrowse-card,
        #cobrowse-sessionConfirm,
        #cobrowse-sessionYesModal,
        #cobrowse-contactUsScreen1,
        #cobrowse-contactUsScreen2 {
          display: none !important;
        }
      `}</style>
      <div id="genesys-chat-container"></div>
      <GenesysScriptLoader />
    </>
  );
}
