import { useCallback, useEffect, useState } from 'react';
import { getGenesysConfig } from '../config/genesys.config';
import { loadGenesysScript } from '../services/ChatService';
import type { ChatInfoResponse } from '../types';
import { ChatError } from '../types';
import { useChatEligibility } from './useChatEligibility';

export interface UseChatOptions {
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onLockPlanSwitcher: (locked: boolean) => void;
  onOpenPlanSwitcher: () => void;
  // Event handlers
  onAgentJoined?: (agentName: string) => void;
  onAgentLeft?: (agentName: string) => void;
  onChatTransferred?: () => void;
  onTranscriptRequested?: (email: string) => void;
  onFileUploaded?: (file: File) => void;
  // Configuration
  enableTranscript?: boolean;
  transcriptPosition?: 'top' | 'bottom';
  transcriptEmail?: string;
  enableFileAttachments?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

interface UseChatReturn {
  isInitialized: boolean;
  isOpen: boolean;
  isChatActive: boolean;
  isLoading: boolean;
  eligibility: ChatInfoResponse | null;
  error: ChatError | null;
  openChat: () => void;
  closeChat: () => void;
}

export function useChat({
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
  onOpenPlanSwitcher,
  // Event handlers
  onAgentJoined,
  onAgentLeft,
  onChatTransferred,
  onTranscriptRequested,
  onFileUploaded,
  // Configuration
  enableTranscript,
  transcriptPosition,
  transcriptEmail,
  enableFileAttachments,
  maxFileSize,
  allowedFileTypes,
}: UseChatOptions): UseChatReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ChatError | null>(null);
  const [_currentAgent, setCurrentAgent] = useState<string | null>(null);

  // Get eligibility data
  const { eligibility, loading } = useChatEligibility(memberId, planId);

  // Update loading state based on eligibility loading and initialization
  useEffect(() => {
    setIsLoading(loading || !isInitialized);
  }, [loading, isInitialized]);

  // Initialize Genesys widget
  useEffect(() => {
    if (loading || !eligibility || isInitialized) return;

    const initializeChat = async () => {
      try {
        // Determine which script to load based on eligibility
        const scriptUrl = eligibility.cloudChatEligible
          ? 'https://apps.mypurecloud.com/widgets/9.0/webcomponents/cxw-widget-connector.js'
          : '/chat.js';

        // Load the appropriate script
        await loadGenesysScript(scriptUrl);

        // Initialize based on type
        if (eligibility.cloudChatEligible && window.CXBus) {
          // Configure Genesys Cloud
          const config = getGenesysConfig({
            type: 'cloud',
            eligibility,
            memberId,
            planId,
            planName,
            hasMultiplePlans,
          });

          window.CXBus.configure(config);

          // Set up event handlers
          window.CXBus.subscribe('WebChat.started', () => {
            setIsOpen(true);
            setIsChatActive(true);
            onLockPlanSwitcher(true);
          });

          window.CXBus.subscribe('WebChat.ended', () => {
            setIsChatActive(false);
            onLockPlanSwitcher(false);
            setTimeout(() => setIsOpen(false), 500);
          });

          // Create header extension for plan information
          if (hasMultiplePlans) {
            await window.CXBus.command('WebChat.registerHeaderExtension', {
              name: 'planInfoExtension',
              template: `<div class="plan-info-header">Chatting about: ${planName}</div>`,
            });
          }
        } else if (window.GenesysChat) {
          // Configure on-premise Genesys
          const config = getGenesysConfig({
            type: 'onprem',
            eligibility,
            memberId,
            planId,
            planName,
            hasMultiplePlans,
          });

          window.GenesysChat.configure(config);

          // Set up event handlers
          window.GenesysChat.onSessionStart = () => {
            setIsOpen(true);
            setIsChatActive(true);
            onLockPlanSwitcher(true);

            // Add plan info to header for multiple plans
            if (hasMultiplePlans) {
              const headerEl = document.querySelector('.genesys-chat-header');
              if (headerEl) {
                const planInfoEl = document.createElement('div');
                planInfoEl.className = 'plan-info-header';
                planInfoEl.textContent = `Chatting about: ${planName}`;
                headerEl.appendChild(planInfoEl);
              }
            }
          };

          window.GenesysChat.onSessionEnd = () => {
            setIsChatActive(false);
            onLockPlanSwitcher(false);
            setTimeout(() => setIsOpen(false), 500);
          };
        }

        setIsInitialized(true);
      } catch (err) {
        const chatError = new ChatError(
          'Failed to initialize chat',
          'INITIALIZATION_ERROR',
        );
        setError(chatError);
      }
    };

    initializeChat();
  }, [
    eligibility,
    loading,
    isInitialized,
    memberId,
    planId,
    planName,
    hasMultiplePlans,
    onLockPlanSwitcher,
  ]);

  const openChat = useCallback(() => {
    if (!eligibility?.chatAvailable) {
      setError(
        new ChatError('Chat is currently unavailable', 'INITIALIZATION_ERROR'),
      );
      return;
    }

    setIsOpen(true);
    setIsChatActive(true);
  }, [eligibility]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsChatActive(false);
  }, []);

  // Add message sending capability
  const _sendMessage = useCallback(
    (message: string) => {
      if (!isInitialized || !isChatActive) return;

      try {
        if (window.CXBus) {
          window.CXBus.command('WebChat.sendMessage', { message });
        } else if (window.GenesysChat) {
          window.GenesysChat.sendMessage(message);
        }
      } catch (err) {
        const chatError = new ChatError(
          err instanceof Error ? err.message : String(err),
          'MESSAGE_ERROR',
        );
        setError(chatError);
      }
    },
    [isInitialized, isChatActive],
  );

  useEffect(() => {
    if (!window.CXBus || !isInitialized) return;

    // Legacy chat.js specific event handlers
    window.CXBus.subscribe('WebChat.agentJoined', (data) => {
      setCurrentAgent(data.agentName);
      onAgentJoined?.(data.agentName);
    });

    window.CXBus.subscribe('WebChat.agentLeft', (data) => {
      setCurrentAgent(null);
      onAgentLeft?.(data.agentName);
    });

    window.CXBus.subscribe('WebChat.transferred', () => {
      onChatTransferred?.();
    });

    // Configure transcript options if enabled
    if (enableTranscript) {
      window.CXBus.command('WebChat.configureTranscript', {
        position: transcriptPosition,
        emailAddress: transcriptEmail,
      });
    }

    // Configure file upload if enabled
    if (enableFileAttachments) {
      window.CXBus.command('WebChat.configureFileUpload', {
        enabled: true,
        maxFileSize: maxFileSize,
        allowedFileTypes: allowedFileTypes,
      });
    }
  }, [
    isInitialized,
    enableTranscript,
    transcriptPosition,
    transcriptEmail,
    enableFileAttachments,
    maxFileSize,
    allowedFileTypes,
    onAgentJoined,
    onAgentLeft,
    onChatTransferred,
  ]);

  // File upload handler
  const _uploadFile = useCallback(
    async (file: File) => {
      if (!isInitialized || !isChatActive || !enableFileAttachments) return;

      try {
        if (window.CXBus) {
          await window.CXBus.command('WebChat.uploadFile', { file });
          onFileUploaded?.(file);
        }
      } catch (err) {
        const chatError = new ChatError(
          err instanceof Error ? err.message : String(err),
          'FILE_UPLOAD_ERROR',
        );
        setError(chatError);
      }
    },
    [isInitialized, isChatActive, enableFileAttachments, onFileUploaded],
  );

  // Request transcript
  const _requestTranscript = useCallback(
    (email: string = transcriptEmail || '') => {
      if (!isInitialized || !enableTranscript) return;

      try {
        if (window.CXBus) {
          window.CXBus.command('WebChat.requestTranscript', { email });
          onTranscriptRequested?.(email);
        }
      } catch (err) {
        const chatError = new ChatError(
          err instanceof Error ? err.message : String(err),
          'TRANSCRIPT_ERROR',
        );
        setError(chatError);
      }
    },
    [isInitialized, enableTranscript, transcriptEmail, onTranscriptRequested],
  );

  // Add plan switcher handler
  useEffect(() => {
    if (window.CXBus && hasMultiplePlans) {
      window.CXBus.subscribe('WebChat.planSwitchRequested', () => {
        onOpenPlanSwitcher();
      });
    }
  }, [hasMultiplePlans, onOpenPlanSwitcher]);

  return {
    isInitialized,
    isOpen,
    isChatActive,
    isLoading,
    eligibility,
    error,
    openChat,
    closeChat,
  };
}
