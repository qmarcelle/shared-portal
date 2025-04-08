import { switchUser } from '@/userManagement/actions/switchUser';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { validateEnv } from '../config/env';
import { updateUserData } from '../config/genesys.config';
import { ChatError, ChatErrorCodes } from '../models/errors';
import {
  BusinessHours,
  ChatPlan,
  GenesysChatEvent,
  GenesysWebChat,
  PlanInfo,
  UserEligibility,
} from '../models/types';
import { PlanService } from '../services';
import { useChatStore } from '../stores/chatStore';

export interface UseChatProps {
  onError?: (error: ChatError) => void;
  onChatStarted?: () => void;
  onChatEnded?: () => void;
  onMessageReceived?: (message: GenesysChatEvent['data']) => void;
  userData?: {
    firstName: string;
    lastName: string;
    email: string;
    customFields: Record<string, string>;
  };
  initialPlanId?: string;
}

interface UseChatResult {
  isReady: boolean;
  isLoading: boolean;
  isInChat: boolean;
  isEligible: boolean;
  isWithinBusinessHours: boolean;
  error: ChatError | null;
  plans: PlanInfo[];
  selectedPlan: PlanInfo | null;
  userEligibility: UserEligibility | null;
  planStatus: 'idle' | 'loading' | 'success' | 'error';
  startChat: () => Promise<void>;
  endChat: () => Promise<void>;
  switchPlan: (planId: string) => Promise<void>;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
}

export const useChat = ({
  onError,
  onChatStarted,
  onChatEnded,
  onMessageReceived,
  userData,
  initialPlanId,
}: UseChatProps): UseChatResult => {
  const router = useRouter();
  const chatRef = useRef<GenesysWebChat | null>(null);
  const store = useChatStore();

  // Chat state
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInChat, setIsInChat] = useState(false);
  const [isEligible, setIsEligible] = useState(true);
  const [isWithinBusinessHours, setIsWithinBusinessHours] = useState(true);

  // Plan state
  const [plans, setPlans] = useState<ChatPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ChatPlan | null>(null);
  const [planStatus, setPlanStatus] = useState<
    'idle' | 'loading' | 'switching' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);

  // Services
  const planService = useRef<PlanService | null>(null);

  const handleError = useCallback(
    (
      error: Error | string,
      code: (typeof ChatErrorCodes)[keyof typeof ChatErrorCodes],
    ) => {
      const chatError = new ChatError(error.toString(), code, 'error');
      setError(chatError.message);
      onError?.(chatError);
    },
    [onError],
  );

  const transformBusinessHours = useCallback(
    (hours: PlanInfo['businessHours']): BusinessHours => ({
      isOpen24x7: hours.isOpen24x7,
      days: hours.days,
      timezone: hours.timezone || 'America/New_York',
      isCurrentlyOpen: hours.isCurrentlyOpen || false,
      lastUpdated: hours.lastUpdated || Date.now(),
      source: hours.source || 'default',
    }),
    [],
  );

  const checkBusinessHours = useCallback(() => {
    if (!selectedPlan?.businessHours) return;

    const hours = transformBusinessHours(selectedPlan.businessHours);
    if (hours.isOpen24x7) {
      setIsWithinBusinessHours(true);
      return;
    }

    const now = new Date();
    const currentDay = hours.days.find(
      (day) => day.day === now.toLocaleDateString('en-US', { weekday: 'long' }),
    );

    if (!currentDay) {
      setIsWithinBusinessHours(false);
      return;
    }

    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
    setIsWithinBusinessHours(
      currentTime >= currentDay.openTime && currentTime <= currentDay.closeTime,
    );
  }, [selectedPlan, transformBusinessHours]);

  const checkEligibility = useCallback(() => {
    if (!selectedPlan || !userData) {
      setIsEligible(false);
      return;
    }

    const isEligible =
      planService.current?.isPlanChatEligible(selectedPlan.id) ?? false;
    setIsEligible(isEligible);
  }, [selectedPlan, userData]);

  const fetchPlans = useCallback(async () => {
    if (!planService.current) return;

    try {
      setPlanStatus('loading');
      const availablePlans = planService.current.getAvailablePlans();
      setPlans(availablePlans);

      // Set initial plan if provided
      if (initialPlanId) {
        const initialPlan = availablePlans.find((p) => p.id === initialPlanId);
        if (initialPlan) {
          setSelectedPlan(initialPlan);
        }
      }

      setPlanStatus('success');
    } catch (err) {
      handleError(
        err instanceof Error ? err.message : 'Failed to fetch plans',
        ChatErrorCodes.INITIALIZATION_ERROR,
      );
      setPlanStatus('error');
    }
  }, [initialPlanId, handleError]);

  const switchPlan = useCallback(
    async (planId: string) => {
      if (!planService.current) return;

      try {
        setPlanStatus('switching');

        // End current chat if active
        if (isInChat) {
          await endChat();
        }

        const success = planService.current.switchPlan(planId);
        if (success) {
          const newPlan = plans.find((p) => p.id === planId);
          if (newPlan) {
            await switchUser(undefined, newPlan.id);
            setSelectedPlan(newPlan);

            // Reinitialize chat with new plan
            await initializeChat(newPlan);

            router.refresh();
            setPlanStatus('success');
          } else {
            throw new Error('Plan not found');
          }
        } else {
          throw new Error('Failed to switch plan');
        }
      } catch (err) {
        handleError(
          err instanceof Error ? err.message : 'Failed to switch plan',
          ChatErrorCodes.PLAN_SWITCH_ERROR,
        );
        setPlanStatus('error');
      }
    },
    [plans, isInChat, router, handleError],
  );

  const initializeChat = useCallback(
    async (plan?: ChatPlan) => {
      if (!validateEnv()) {
        handleError(
          'Missing required environment variables',
          ChatErrorCodes.INITIALIZATION_ERROR,
        );
        return;
      }

      try {
        setIsLoading(true);

        // Update user data if provided
        if (userData) {
          updateUserData({
            ...userData,
            customFields: {
              ...userData.customFields,
              planId: plan?.id || selectedPlan?.id || '',
            },
          });
        }

        // Check eligibility before initializing chat
        checkEligibility();

        // Initialize chat with config
        if (window._genesys?.widgets?.webchat) {
          chatRef.current = window._genesys.widgets.webchat;
          await chatRef.current.ready();
          setIsReady(true);
        } else {
          handleError(
            'Genesys WebChat not available',
            ChatErrorCodes.INITIALIZATION_ERROR,
          );
        }
      } catch (error) {
        handleError(
          error instanceof Error ? error : String(error),
          ChatErrorCodes.INITIALIZATION_ERROR,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, userData, checkEligibility, selectedPlan],
  );

  const startChat = useCallback(async () => {
    if (!isReady || !isEligible || !isWithinBusinessHours || !chatRef.current) {
      return;
    }

    try {
      await chatRef.current.startChat();
      setIsInChat(true);
      onChatStarted?.();
    } catch (error) {
      handleError(
        error instanceof Error ? error : String(error),
        ChatErrorCodes.CHAT_START_ERROR,
      );
    }
  }, [isReady, isEligible, isWithinBusinessHours, handleError, onChatStarted]);

  const endChat = useCallback(async () => {
    if (!isInChat || !chatRef.current) {
      return;
    }

    try {
      await chatRef.current.endChat();
      setIsInChat(false);
      onChatEnded?.();
    } catch (error) {
      handleError(
        error instanceof Error ? error : String(error),
        ChatErrorCodes.CHAT_END_ERROR,
      );
    }
  }, [isInChat, handleError, onChatEnded]);

  const lockPlanSwitcher = useCallback(() => {
    store.lockPlanSwitcher();
  }, [store]);

  const unlockPlanSwitcher = useCallback(() => {
    store.unlockPlanSwitcher();
  }, [store]);

  // Initialize services and fetch plans
  useEffect(() => {
    planService.current = new PlanService();
    void fetchPlans();
  }, [fetchPlans]);

  // Initialize chat and set up event listeners
  useEffect(() => {
    if (selectedPlan) {
      initializeChat(selectedPlan);
      checkBusinessHours();
      checkEligibility();

      const messageHandler = (event: GenesysChatEvent) => {
        onMessageReceived?.(event.data);
      };

      if (chatRef.current) {
        chatRef.current.on('message', messageHandler);
      }

      return () => {
        if (chatRef.current) {
          chatRef.current.off('message', messageHandler);
        }
        void endChat();
      };
    }
  }, [
    selectedPlan,
    initializeChat,
    checkBusinessHours,
    checkEligibility,
    endChat,
    onMessageReceived,
  ]);

  return {
    // Chat state
    isReady,
    isLoading,
    isInChat,
    isEligible,
    isWithinBusinessHours,
    error,

    // Plan state
    plans,
    selectedPlan,
    planStatus,

    // Actions
    startChat,
    endChat,
    switchPlan,
    lockPlanSwitcher,
    unlockPlanSwitcher,
  };
};
