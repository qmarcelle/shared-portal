import { memberService } from '@/utils/api/memberService';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createGenesysConfig } from '../../@chat/schemas/genesys.schema';
import { ChatService } from '../../@chat/services/ChatService';
import { useChatStore } from '../../@chat/stores/chatStore';
import { ChatDataPayload, ChatError, ChatInfoResponse } from '../../@chat/types';

// Create chat service context
const ChatServiceContext = createContext<ChatService | null>(null);

// Business hours utilities
const parseBusinessHours = (hoursString: string) => {
  const [days, hours] = hoursString.split('_');
  const [startHour, endHour] = hours.split('-').map(Number);
  return {
    days,
    startHour,
    endHour,
    isValid: !isNaN(startHour) && !isNaN(endHour),
  };
};

// Check if current time is within business hours
const isWithinBusinessHours = (businessHours: string): boolean => {
  const { days, startHour, endHour, isValid } = parseBusinessHours(businessHours);
  if (!isValid) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();

  // Check if current day is within business days
  const isBusinessDay = days.includes(
    ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][currentDay],
  );

  return isBusinessDay && currentHour >= startHour && currentHour < endHour;
};

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
  _onOpenPlanSwitcher?: () => void;
  // Event handlers
  /** Called when an agent joins the chat */
  _onAgentJoined?: (agentName: string) => void;
  /** Called when an agent leaves the chat */
  _onAgentLeft?: (agentName: string) => void;
  /** Called when chat is transferred to another agent */
  _onChatTransferred?: () => void;
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
export function useLocalChat({
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
  _onOpenPlanSwitcher,
  _onAgentJoined,
  _onAgentLeft,
  _onChatTransferred,
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
    updateConfig,
  } = useChatStore();

  // Create chat service instance
  const chatService = useMemo(
    () =>
      new ChatService(
        memberId,
        planId,
        planName,
        hasMultiplePlans,
        onLockPlanSwitcher,
      ),
    [memberId, planId, planName, hasMultiplePlans, onLockPlanSwitcher],
  );

  // Direct eligibility check via API (incorporated from useChatEligibility)
  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        setLoading(true);
        
        // Use memberService to fetch chat eligibility
        const response = await memberService.get(
          `/api/member/v1/members/byMemberCk/${memberId}/chat/getChatInfo`,
          { params: { planId } }
        );
        
        if (!response || response.status !== 200) {
          throw new ChatError(
            'Failed to fetch chat eligibility',
            'ELIGIBILITY_ERROR',
          );
        }
        
        const data: ChatInfoResponse = response.data;

        // Enhance eligibility with business hours check
        const isAvailable = data.businessHours?.text
          ? isWithinBusinessHours(data.businessHours.text)
          : true;

        // Update to match ChatInfoResponse structure with isEligible property
        const eligibilityData: ChatInfoResponse = {
          isEligible: data.isEligible && isAvailable,
          cloudChatEligible: data.cloudChatEligible,
          chatGroup: data.chatGroup,
          workingHours: data.workingHours,
          businessHours: data.businessHours,
          chatAvailable: data.isEligible && isAvailable, // Keep chatAvailable for backward compatibility if needed
        };

        setEligibility(eligibilityData);
        setInfo(data);
      } catch (err) {
        const chatError =
          err instanceof ChatError
            ? err
            : new ChatError('Failed to fetch chat eligibility', 'ELIGIBILITY_ERROR');
        setError(chatError);
        setEligibility(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [memberId, planId, setLoading, setError, setEligibility]);

  // Initialize chat configuration
  const initializeChat = useCallback(async () => {
    try {
      setLoading(true);
      const chatInfo = await chatService.getChatInfo();
      setInfo(chatInfo);

      const config = createGenesysConfig({
        chatbotEligible: true,
        routingchatbotEligible: true,
        isChatAvailable: chatInfo.chatAvailable,
        cloudChatEligible: chatInfo.cloudChatEligible,
        chatGroup: chatInfo.chatGroup,
        workingHours: chatInfo.workingHours,
      });

      updateConfig(config);
      setIsInitialized(true);
    } catch (err) {
      const chatError =
        err instanceof ChatError
          ? err
          : new ChatError('Failed to initialize chat', 'INITIALIZATION_ERROR');
      setError(chatError);
    } finally {
      setLoading(false);
    }
  }, [chatService, setLoading, setError, updateConfig]);

  // Initialize chat on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeChat();
    }
  }, [isInitialized, initializeChat]);

  // Chat window controls
  const openChat = useCallback(() => {
    if (!eligibility?.chatAvailable) {
      setError(new ChatError('Chat is not available', 'CHAT_START_ERROR'));
      return;
    }
    setOpen(true);
  }, [eligibility, setOpen, setError]);

  const closeChat = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

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
      //TODO: MOVE THIS ELSEWHERE
      const payload: ChatDataPayload = {
        SERV_Type: 'MemberPortal',
        firstname: '', 
        lastname: '',
        RoutingChatbotInteractionId: '',
        PLAN_ID: planId,
        GROUP_ID: '',
        IDCardBotName: '',
        IsVisionEligible: false,
        MEMBER_ID: memberId,
        coverage_eligibility: 'eligible',
        INQ_TYPE: 'general',
        IsDentalEligible: false,
        MEMBER_DOB: '',
        LOB: '',
        lob_group: '',
        IsMedicalEligibile: true,
        Origin: 'MemberPortal',
        Source: 'Web',
        message: `Starting chat about plan: ${planName}`,
        timestamp: Date.now(),
      };

      // Start chat
      await chatService.startChat(payload);

      // Initialize the appropriate chat implementation
      await initializeChat();

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
