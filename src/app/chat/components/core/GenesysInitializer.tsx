'use client';

import { useEffect, useState } from 'react';

/**
 * Genesys Initializer Component
 *
 * This component is responsible for loading the Genesys configuration script
 * that is necessary for both cloud and on-premises chat implementations.
 *
 * Key responsibilities:
 * 1. Dynamically loads /public/genesys-config.js into the document head
 * 2. Ensures the script is only loaded once per session
 * 3. Sets up global configuration objects needed by chat widgets
 * 4. Provides a mechanism to know when config is loaded and available
 *
 * Integration points:
 * - Used by ChatProviderFactory to initialize chat configuration
 * - Sets up window.Genesys and window.GenesysJS global objects
 * - Configures mock implementations for testing environments
 */
export function GenesysInitializer() {
  // Track loading state to avoid duplicate loading
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Skip if the script is already loaded
    if (document.getElementById('genesys-config-script')) {
      setIsLoaded(true);
      return;
    }

    // Create script element for genesys-config.js
    const script = document.createElement('script');
    script.id = 'genesys-config-script';
    script.src = '/genesys-config.js';
    script.async = true;

    // Set up load handler to track when config is available
    script.onload = () => {
      console.log('Genesys config loaded');
      setIsLoaded(true);

      // Dispatch a custom event that other components can listen for
      window.dispatchEvent(new CustomEvent('genesys:configLoaded'));
    };

    // Set up error handler for debugging issues
    script.onerror = (error) => {
      console.error('Error loading Genesys config:', error);
      // In a production environment, we might want to implement retry logic
      // or fallback to a default configuration
    };

    // Add script to document head to make it globally available
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // We don't remove the script on unmount since it needs to stay available
      // for the entire session, even if this component is unmounted
      // Note: In a real application, you might want to track if any chat
      // components are still active before deciding to keep the script
    };
  }, []);

  // This component doesn't render anything visible
  // It's purely for initialization side effects
  return null;
}
