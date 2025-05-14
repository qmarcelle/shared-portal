'use client';

/**
 * ChatWidget Component
 *
 * Uses the GenesysScriptLoader for a more reliable approach to loading the Genesys chat script.
 */

import GenesysScriptLoader from './GenesysScriptLoader';

export default function ChatWidget() {
  return (
    <div>
      <div id="genesys-chat-container"></div>
      <GenesysScriptLoader />
    </div>
  );
}
