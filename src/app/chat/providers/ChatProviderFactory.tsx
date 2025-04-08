'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { GenesysInitializer } from '../components/core/GenesysInitializer';
import { AlertBar } from '../components/shared/AlertBar';
import { useChatEligibility } from '../hooks/useChatEligibility';
import { GenesysGlobal } from '../types/types';

/**
 * Chat Provider Factory Component
 *
 * This component determines which chat implementation to use (cloud or on-premises)
 * based on the user's eligibility data from the BCBST Chat API.
 *
 * Key responsibilities:
 * 1. Loads the appropriate chat script based on user eligibility
 * 2. Initializes Genesys configuration via GenesysInitializer
 * 3. Handles loading states and error messages
 * 4. Manages cleanup of chat resources on unmount
 *
 * Integration flow:
 * 1. Check eligibility via useChatEligibility hook
 * 2. Determine if user can use cloud chat or needs on-premises solution
 * 3. Load appropriate script (webmessenger.js for cloud, chat.js for on-prem)
 * 4. Initialize chat with proper configuration
 * 5. Clean up resources when component unmounts
 */
export function ChatProviderFactory({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to track loading and error conditions
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get eligibility information from the chat hook
  const {
    isCloudChatEligible, // Determines if we should use Genesys Cloud
    chatInfo, // API response with chat configuration
    eligibility, // User eligibility details
    isEligible, // Overall eligibility for chat
    isBusinessHoursOpen, // Whether chat is available now based on hours
  } = useChatEligibility();

  // Effect to load the appropriate chat implementation based on eligibility
  useEffect(() => {
    // Skip if we're still loading eligibility data
    if (!chatInfo || eligibility === null) {
      return;
    }

    // We now have the eligibility data, so we can stop the loading state
    setIsLoading(false);

    // If user isn't eligible for chat, show error
    if (!isEligible) {
      setError('You are not eligible for chat support at this time.');
      return;
    }

    // If chat is outside business hours, show error with hours information
    if (!isBusinessHoursOpen) {
      setError(
        `Chat support is currently unavailable. Operating hours: ${eligibility.chatHours}`,
      );
      return;
    }

    // Load the appropriate chat implementation based on eligibility
    if (isCloudChatEligible) {
      // For cloud-eligible users, load Genesys Cloud Web Messenger
      const script = document.createElement('script');
      script.src = 'https://apps.mypurecloud.com/widgets/9.0/webmessenger.js';
      script.async = true;
      script.onload = () => {
        console.log('Genesys Cloud WebMessenger loaded');
        // Initialization would happen in a consumer component
      };
      script.onerror = () => {
        setError('Failed to load chat widget. Please try again later.');
      };
      document.head.appendChild(script);
    } else {
      // For non-cloud users, load the on-premises widget
      const script = document.createElement('script');
      script.src = '/chat.js';
      script.async = true;
      script.onload = () => {
        console.log('On-premises chat widget loaded');
        // Initialization would happen in a consumer component
      };
      script.onerror = () => {
        setError('Failed to load chat widget. Please try again later.');
      };
      document.head.appendChild(script);
    }

    // Clean up chat resources when component unmounts
    return () => {
      // Clean up cloud widget if it exists
      if (window.Genesys && window.Genesys.WebMessenger) {
        window.Genesys.WebMessenger.destroy();
      }

      // Clean up on-premises widget if it exists
      if (window.GenesysChat) {
        if (typeof window.GenesysChat.closeChat === 'function') {
          window.GenesysChat.closeChat();
        }
      }
    };
  }, [
    chatInfo,
    eligibility,
    isEligible,
    isBusinessHoursOpen,
    isCloudChatEligible,
  ]);

  // Show loading state while eligibility is being determined
  if (isLoading) {
    return <div className="p-4 text-center">Loading chat...</div>;
  }

  // Show error if user is not eligible or outside business hours
  if (error) {
    return (
      <div className="p-4">
        <AlertBar alerts={[error]} />
      </div>
    );
  }

  // Render the children with GenesysInitializer to load configuration
  return (
    <>
      <GenesysInitializer />
      {children}
    </>
  );
}

// Add window type extensions for the chat widgets
declare global {
  interface Window {
    GenesysChat?: {
      configuration: any;
      openChat: () => void;
      closeChat: () => void;
      sendMessage: (message: string) => void;
      onSessionStart: () => void;
      onSessionEnd: () => void;
      onError: (error: any) => void;
    };
    Genesys?: GenesysGlobal;
  }
}
