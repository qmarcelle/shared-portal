import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  destroyChat,
  getGenesysConfig,
  initializeChat,
} from '../config/genesys.config';
import { ChatService } from '../services/ChatService';
import { useChatStore } from '../stores/chatStore';
import { ChatError, ChatInfoResponse } from '../types';
import { GenesysWidgetBus } from '../utils/genesysWidgetBus';

// Create chat service context
const ChatServiceContext = createContext<ChatService | null>(null);

/**
 * Provider component for the chat service
 */
interface ChatServiceProviderProps {
  children: React.ReactNode;
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onLockPlanSwitcher: (locked: boolean) => void;
}

export function ChatServiceProvider(
  props: ChatServiceProviderProps,
): React.JSX.Element {
  const chatService = useMemo(
    () =>
      new ChatService(
        props.memberId,
        props.planId,
        props.planName,
        props.hasMultiplePlans,
        props.onLockPlanSwitcher,
      ),
    [
      props.memberId,
      props.planId,
      props.planName,
      props.hasMultiplePlans,
      props.onLockPlanSwitcher,
    ],
  );

  return (
    <ChatServiceContext.Provider value={chatService}>
      {props.children}
    </ChatServiceContext.Provider>
  );
}

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
  onOpenPlanSwitcher?: () => void;
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

export interface UseChatReturn {
  isInitialized: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  isChatActive: boolean;
  isLoading: boolean;
  error: ChatError | null;
  eligibility: ChatInfoResponse | null;
  info: ChatInfoResponse | null;
  openChat: () => void;
  closeChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  startChat: () => void;
  endChat: () => void;
  sendMessage: (text: string) => Promise<void>;
}

/**
 * Primary hook for chat functionality.
 * This hook provides a unified interface for both cloud and legacy chat implementations,
 * and handles access to the chat service instance.
 */
export function useChat(options?: Partial<UseChatOptions>): UseChatReturn {
  const chatService = useContext(ChatServiceContext);

  if (!chatService && !options) {
    throw new Error(
      'useChat must be used within ChatServiceProvider or with complete options',
    );
  }

  const finalOptions = chatService
    ? {
        memberId: chatService.memberId,
        planId: chatService.planId,
        planName: chatService.planName,
        hasMultiplePlans: chatService.hasMultiplePlans,
        onLockPlanSwitcher: chatService.onLockPlanSwitcher,
        ...options,
      }
    : (options as UseChatOptions);

  return useLocalChat(finalOptions);
}

// Internal hook for chat functionality
function useLocalChat({
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
  // Internal state
  const [isInitialized, setIsInitialized] = useState(false);
  const [info, setInfo] = useState<ChatInfoResponse | null>(null);

  // Access chat store
  const {
    isOpen,
    isMinimized,
    isChatActive,
    error,
    eligibility,
    isLoading,
    setOpen,
    setMinimized,
    setError,
    setChatActive,
    setLoading,
    setEligibility,
    setPlanSwitcherLocked,
  } = useChatStore();

  // Create chat service instance
  const chatService = new ChatService(
    memberId,
    planId,
    planName,
    hasMultiplePlans,
    onLockPlanSwitcher,
  );

  // Initialize chat
  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        setLoading(true);

        // Get chat eligibility information
        const chatInfo = await chatService.getChatInfo();
        setInfo(chatInfo);

        // Update eligibility in store
        setEligibility({
          isEligible: chatInfo.isEligible,
          chatAvailable: chatInfo.isEligible,
          cloudChatEligible: chatInfo.cloudChatEligible,
          chatGroup: chatInfo.chatGroup,
          businessHours: chatInfo.businessHours,
        } as ChatInfoResponse);

        // Initialize appropriate chat implementation
        if (!chatInfo.cloudChatEligible) {
          // Set up legacy chat event handlers
          const widgetBus = GenesysWidgetBus.getInstance();
          await widgetBus.init();

          widgetBus.subscribe('WebChat.agentJoined', (data) => {
            onAgentJoined?.(data.agentName);
          });

          widgetBus.subscribe('WebChat.agentLeft', (data) => {
            onAgentLeft?.(data.agentName);
          });

          widgetBus.subscribe('WebChat.chatTransferred', () => {
            onChatTransferred?.();
          });
        }

        setIsInitialized(true);
      } catch (err) {
        // Handle error
        const chatError =
          err instanceof ChatError
            ? err
            : new ChatError(
                'Failed to initialize chat',
                'INITIALIZATION_ERROR',
              );

        setError(chatError);
      } finally {
        setLoading(false);
      }
    };

    if (!isInitialized && memberId && planId) {
      fetchChatInfo();
    }

    return () => {
      // Clean up on unmount
      if (isInitialized) {
        destroyChat(eligibility?.cloudChatEligible || false);
        setIsInitialized(false);
      }
    };
  }, [memberId, planId, isInitialized]);

  // Handle plan switching
  useEffect(() => {
    if (isInitialized && isChatActive) {
      setPlanSwitcherLocked(true);
    } else {
      setPlanSwitcherLocked(false);
    }
  }, [isChatActive, isInitialized, setPlanSwitcherLocked]);

  // Chat actions

  /**
   * Opens the chat window
   */
  const openChat = () => {
    setOpen(true);
    setMinimized(false);
  };

  /**
   * Closes the chat window
   */
  const closeChat = () => {
    if (isChatActive) {
      endChat();
    }
    setOpen(false);
  };

  /**
   * Minimizes the chat window
   */
  const minimizeChat = () => {
    setMinimized(true);
  };

  /**
   * Maximizes the chat window
   */
  const maximizeChat = () => {
    setMinimized(false);
  };

  /**
   * Starts a new chat session
   */
  const startChat = async () => {
    try {
      if (!isInitialized || !eligibility?.chatAvailable) {
        throw new ChatError('Chat not available', 'CHAT_START_ERROR');
      }

      setLoading(true);

      // Create chat payload
      const payload = {
        memberId,
        planId,
        message: `Starting chat about plan: ${planName}`,
        timestamp: Date.now(),
      };

      // Start chat
      await chatService.startChat(payload);

      // Initialize the appropriate chat implementation
      await initializeChat(
        getGenesysConfig({
          memberId,
          planId,
          planName,
          eligibility: {
            isEligible: eligibility.chatAvailable,
            cloudChatEligible: eligibility.cloudChatEligible,
            chatGroup: eligibility.chatGroup,
            businessHours: {
              text: eligibility.workingHours || '',
              isOpen: eligibility.chatAvailable,
            },
          },
        }),
        eligibility.cloudChatEligible,
      );

      setChatActive(true);

      // Lock plan switcher during active chat
      onLockPlanSwitcher(true);
    } catch (err) {
      const chatError =
        err instanceof ChatError
          ? err
          : new ChatError('Failed to start chat', 'CHAT_START_ERROR');

      setError(chatError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ends the current chat session
   */
  const endChat = async () => {
    try {
      setLoading(true);

      await chatService.endChat();

      setChatActive(false);

      // Unlock plan switcher after chat ends
      onLockPlanSwitcher(false);
    } catch (err) {
      const chatError =
        err instanceof ChatError
          ? err
          : new ChatError('Failed to end chat', 'CHAT_END_ERROR');

      setError(chatError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends a message in the current chat session
   *
   * @param text - Message content to send
   */
  const sendMessage = async (text: string) => {
    try {
      if (!isChatActive) {
        throw new ChatError('No active chat session', 'MESSAGE_ERROR');
      }

      await chatService.sendMessage(text);
    } catch (err) {
      const chatError =
        err instanceof ChatError
          ? err
          : new ChatError('Failed to send message', 'MESSAGE_ERROR');

      setError(chatError);
    }
  };

  return {
    // State
    isInitialized,
    isOpen,
    isMinimized,
    isChatActive,
    error,
    eligibility,
    isLoading,
    info,

    // Actions
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    startChat,
    endChat,
    sendMessage,
  };
}
