import { useCallback, useEffect, useState } from 'react';
import {
  destroyChat,
  getGenesysConfig,
  initializeChat,
} from '../config/genesys.config';
import { ChatError } from '../types/index';
import type { ChatInfoResponse } from '../types/schemas';
import { useChatEligibility } from './useChatEligibility';

/**
 * Primary hook for integrating chat functionality in components.
 * Handles both Genesys Cloud Chat and Legacy Chat.js implementations.
 *
 * The hook automatically selects the appropriate chat implementation based on the
 * member's eligibility status:
 * - For cloud-eligible members: Uses Genesys Web Messaging API (modern implementation)
 * - For non-cloud-eligible members: Uses legacy chat.js implementation
 *
 * Key requirements implemented:
 * - Plan switching management (ID: 31158, 31159)
 * - Business hours validation (ID: 31156)
 * - Eligibility checks (ID: 31154)
 * - Dynamic payload updates (ID: 31146)
 *
 * Widget Selection Logic:
 * 1. Checks eligibility through useChatEligibility hook
 * 2. Uses cloudChatEligible flag to determine implementation
 * 3. Loads appropriate script using getGenesysConfig and initializeChat
 * 4. Sets up appropriate event handlers based on implementation
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { openChat, closeChat, isChatActive } = useChat({
 *     memberId: "123",
 *     planId: "PLAN-456",
 *     planName: "Premium Health",
 *     hasMultiplePlans: true,
 *     onLockPlanSwitcher: (locked) => setLocked(locked),
 *     onOpenPlanSwitcher: () => setPlanSwitcherOpen(true)
 *   });
 *
 *   return <button onClick={openChat}>Start Chat</button>;
 * }
 * ```
 */
export interface UseChatOptions {
  /** Unique identifier for the member */
  memberId: string;
  /** Current plan identifier */
  planId: string;
  /** Display name of the current plan */
  planName: string;
  /** Whether the member has multiple plans available */
  hasMultiplePlans: boolean;
  /** Callback to lock/unlock plan switching during active chat */
  onLockPlanSwitcher: (locked: boolean) => void;
  /** Callback when plan switching is requested */
  onOpenPlanSwitcher: () => void;
  // Event handlers
  /** Called when an agent joins the chat */
  onAgentJoined?: (agentName: string) => void;
  /** Called when an agent leaves the chat */
  onAgentLeft?: (agentName: string) => void;
  /** Called when chat is transferred to another agent */
  onChatTransferred?: () => void;
  /** Called when transcript is requested */
  _onTranscriptRequested?: (email: string) => void;
  /** Called when a file is successfully uploaded */
  _onFileUploaded?: (file: File) => void;
  // Configuration
  /** Enable chat transcript functionality */
  _enableTranscript?: boolean;
  /** Position of transcript button */
  _transcriptPosition?: 'top' | 'bottom';
  /** Default email for transcript */
  _transcriptEmail?: string;
  /** Enable file attachment functionality */
  _enableFileAttachments?: boolean;
  /** Maximum file size in bytes */
  _maxFileSize?: number;
  /** List of allowed file extensions */
  _allowedFileTypes?: string[];
}

/**
 * Return type for the useChat hook
 */
interface UseChatReturn {
  /** Whether chat has been initialized successfully */
  isInitialized: boolean;
  /** Whether chat window is open */
  isOpen: boolean;
  /** Whether there is an active chat session */
  isChatActive: boolean;
  /** Whether chat is in a loading state */
  isLoading: boolean;
  /** Current error state if any */
  error: ChatError | null;
  /** Eligibility data for the chat */
  eligibility: ChatInfoResponse | null;
  /** Function to open chat window */
  openChat: () => void;
  /** Function to close chat window */
  closeChat: () => void;
  /** Function to minimize chat window */
  minimizeChat: () => void;
  /** Function to maximize chat window */
  maximizeChat: () => void;
  /** Function to start a chat session */
  startChat: () => void;
  /** Function to end a chat session */
  endChat: () => void;
}

/**
 * Hook that implements chat functionality for the BCBST member portal.
 *
 * This hook is responsible for:
 * 1. Determining chat eligibility
 * 2. Loading the appropriate chat widget script (Web Messaging or legacy chat.js)
 * 3. Managing chat state and session lifecycle
 * 4. Handling plan switching logic and restrictions
 * 5. Providing a unified API regardless of the underlying implementation
 *
 * The implementation details and widget selection are abstracted away from the component,
 * allowing for a consistent interface regardless of which chat system is used.
 */
export function useChat({
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
  onOpenPlanSwitcher,
  onAgentJoined,
  onAgentLeft,
  onChatTransferred,
}: UseChatOptions): UseChatReturn {
  const [state, setState] = useState({
    isInitialized: false,
    isOpen: false,
    isChatActive: false,
    isLoading: true,
    error: null as ChatError | null,
  });

  // Get eligibility data
  const { eligibility, loading } = useChatEligibility(memberId, planId);

  // Update loading state based on eligibility loading and initialization
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoading: loading || !prev.isInitialized,
    }));
  }, [loading]);

  // Initialize chat based on eligibility
  useEffect(() => {
    if (loading || !eligibility || state.isInitialized) return;

    /**
     * Initializes the appropriate chat widget based on eligibility.
     * Implements widget selection logic and sets up event handlers.
     *
     * Behavior:
     * 1. Gets Genesys configuration with eligibility data
     * 2. Initializes the chat with the appropriate implementation
     * 3. Sets up event handlers specific to the chosen implementation
     * 4. Updates component state based on chat events
     */
    const initializeChatSystem = async () => {
      try {
        const config = getGenesysConfig({
          memberId,
          planId,
          planName,
          eligibility,
        });

        await initializeChat(config, eligibility.cloudChatEligible);

        // Set up event handlers based on implementation
        if (eligibility.cloudChatEligible) {
          // Web Messaging events
          window.Genesys?.WebMessenger?.on('ready', () => {
            setState((prev) => ({
              ...prev,
              isInitialized: true,
              isLoading: false,
            }));
          });

          window.Genesys?.WebMessenger?.on('conversationStarted', () => {
            setState((prev) => ({ ...prev, isOpen: true, isChatActive: true }));
            onLockPlanSwitcher(true);
          });

          window.Genesys?.WebMessenger?.on('conversationEnded', () => {
            setState((prev) => ({ ...prev, isChatActive: false }));
            onLockPlanSwitcher(false);
            setTimeout(
              () => setState((prev) => ({ ...prev, isOpen: false })),
              500,
            );
          });

          if (onAgentJoined) {
            window.Genesys?.WebMessenger?.on(
              'agentJoined',
              (data: { displayName: string }) => {
                onAgentJoined(data.displayName);
              },
            );
          }

          if (onAgentLeft) {
            window.Genesys?.WebMessenger?.on(
              'agentLeft',
              (data: { displayName: string }) => {
                onAgentLeft(data.displayName);
              },
            );
          }
        } else {
          // Legacy chat events
          window.Genesys?.Chat?.on('ready', () => {
            setState((prev) => ({
              ...prev,
              isInitialized: true,
              isLoading: false,
            }));
          });

          window.Genesys?.Chat?.on('ChatStarted', () => {
            setState((prev) => ({ ...prev, isOpen: true, isChatActive: true }));
            onLockPlanSwitcher(true);
          });

          window.Genesys?.Chat?.on('ChatEnded', () => {
            setState((prev) => ({ ...prev, isChatActive: false }));
            onLockPlanSwitcher(false);
            setTimeout(
              () => setState((prev) => ({ ...prev, isOpen: false })),
              500,
            );
          });

          if (onAgentJoined) {
            window.Genesys?.Chat?.on(
              'AgentJoined',
              (data: { agentName: string }) => {
                onAgentJoined(data.agentName);
              },
            );
          }

          if (onAgentLeft) {
            window.Genesys?.Chat?.on(
              'AgentLeft',
              (data: { agentName: string }) => {
                onAgentLeft(data.agentName);
              },
            );
          }

          if (onChatTransferred) {
            window.Genesys?.Chat?.on('ChatTransferred', () => {
              onChatTransferred();
            });
          }

          // Legacy specific events
          window.Genesys?.Chat?.on('PlanSwitchRequested', () => {
            onOpenPlanSwitcher();
          });
        }

        setState((prev) => ({ ...prev, isInitialized: true }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: new ChatError(
            'Failed to initialize chat',
            'INITIALIZATION_ERROR',
          ),
          isLoading: false,
        }));
      }
    };

    initializeChatSystem();

    // Cleanup on unmount
    return () => {
      if (eligibility) {
        destroyChat(eligibility.cloudChatEligible);
      }
    };
  }, [
    eligibility,
    loading,
    memberId,
    planId,
    planName,
    onLockPlanSwitcher,
    onOpenPlanSwitcher,
    onAgentJoined,
    onAgentLeft,
    onChatTransferred,
  ]);

  /**
   * Opens the chat window.
   * Initiates conversation based on the selected chat implementation.
   * Implements requirement ID: 31156 (business hours validation)
   */
  const openChat = useCallback(() => {
    if (!eligibility?.chatAvailable) {
      setState((prev) => ({
        ...prev,
        error: new ChatError(
          'Chat is currently unavailable',
          'INITIALIZATION_ERROR',
        ),
      }));
      return;
    }

    if (eligibility.cloudChatEligible) {
      window.Genesys?.WebMessenger?.startConversation();
    } else {
      window.Genesys?.Chat?.on('StartChat', () => {});
    }
    setState((prev) => ({ ...prev, isOpen: true }));
  }, [eligibility]);

  /**
   * Closes the chat window.
   * Ends conversation and unlocks plan switcher.
   * Implements requirement ID: 31158 (plan switcher unlocking)
   */
  const closeChat = useCallback(() => {
    if (eligibility?.cloudChatEligible) {
      window.Genesys?.WebMessenger?.endConversation();
    } else {
      window.Genesys?.Chat?.on('EndChat', () => {});
    }
    setState((prev) => ({ ...prev, isOpen: false, isChatActive: false }));
  }, [eligibility]);

  const minimizeChat = useCallback(() => {
    // Implementation needed
  }, []);

  const maximizeChat = useCallback(() => {
    // Implementation needed
  }, []);

  const startChat = useCallback(() => {
    // Implementation needed
  }, []);

  const endChat = useCallback(() => {
    // Implementation needed
  }, []);

  return {
    ...state,
    eligibility,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    startChat,
    endChat,
  };
}
