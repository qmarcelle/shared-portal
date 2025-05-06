// src/stores/chatStore.ts
import { create } from 'zustand';
import { memberService } from '../../../utils/api/memberService';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
import { ChatError, ChatInfoResponse } from '../types/index';
import { calculateIsBusinessHoursOpen, formatBusinessHours } from '../utils/businessHours';

export interface ChatState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  newMessageCount: number;

  // Chat state
  isChatActive: boolean;
  isLoading: boolean;
  error: ChatError | null;
  messages: Array<{ id: string; content: string; sender: 'user' | 'agent' }>;

  // API response
  eligibility: ChatInfoResponse | null;

  // Derived flags
  isEligible: boolean;
  chatMode: 'legacy' | 'cloud';
  isOOO: boolean;
  chatGroup?: string;
  businessHoursText: string;
  routingInteractionId?: string;
  userData: Record<string, string>;
  formInputs: { id: string; value: string }[];

  // Zod-validated config
  config?: ChatConfig;

  // Plan switching
  isPlanSwitcherLocked: boolean;
  planSwitcherTooltip: string;

  // Actions
  setOpen: (isOpen: boolean) => void;
  setMinimized: (min: boolean) => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  setError: (err: ChatError | null) => void;
  addMessage: (m: { content: string; sender: 'user' | 'agent' }) => void;
  clearMessages: () => void;
  setChatActive: (active: boolean) => void;
  setLoading: (loading: boolean) => void;
  incrementMessageCount: () => void;
  resetMessageCount: () => void;
  setEligibility: (info: ChatInfoResponse | null) => void;
  setPlanSwitcherLocked: (locked: boolean) => void;
  updateConfig: (cfg: Partial<ChatConfig>) => void;
  closeAndRedirect: () => void;

  // New actions
  loadChatConfiguration: (memberId: number, planId: string) => Promise<void>;
  startChat: () => void;
  endChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // UI state
  isOpen: false,
  isMinimized: false,
  newMessageCount: 0,

  // Chat state
  isChatActive: false,
  isLoading: true,
  error: null,
  messages: [],

  // API response
  eligibility: null,

  // Derived flags
  isEligible: false,
  chatMode: 'legacy',
  isOOO: true,
  chatGroup: undefined,
  businessHoursText: '',
  routingInteractionId: undefined,
  userData: {},
  formInputs: [],

  // Config slice
  config: undefined,

  // Plan switching
  isPlanSwitcherLocked: false,
  planSwitcherTooltip: '',

  // Actions
  setOpen: (isOpen) => set({ isOpen }),
  setMinimized: (min) => set({ isMinimized: min }),
  minimizeChat: () => set({ isMinimized: true }),
  maximizeChat: () => set({ isMinimized: false }),
  setError: (error) => set({ error }),
  addMessage: (message) =>
    set((s) => ({
      messages: [...s.messages, { id: Date.now().toString(), ...message }],
    })),
  clearMessages: () => set({ messages: [] }),
  setChatActive: (active) => set({ isChatActive: active }),
  setLoading: (loading) => set({ isLoading: loading }),
  incrementMessageCount: () =>
    set((s) => ({ newMessageCount: s.newMessageCount + 1 })),
  resetMessageCount: () => set({ newMessageCount: 0 }),
  setEligibility: (eligibility) => set({ eligibility }),

  setPlanSwitcherLocked: (locked) =>
    set({
      isPlanSwitcherLocked: locked,
      planSwitcherTooltip: locked
        ? 'You cannot switch plans during an active chat session.'
        : '',
    }),

  updateConfig: (cfg) => {
    try {
      const validated = ChatConfigSchema.parse(cfg);
      set({ config: validated });
    } catch (err) {
      console.error('Invalid chat configuration:', err);
      set({
        error: new ChatError(
          'Invalid chat configuration',
          'CONFIGURATION_ERROR',
        ),
      });
    }
  },

  closeAndRedirect: () =>
    set({
      isOpen: false,
      isChatActive: false,
      messages: [],
      isPlanSwitcherLocked: false,
    }),

  // New actions
  loadChatConfiguration: async (memberId, planId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use memberService directly instead of the removed getChatInfo function
      const response = await memberService.get('/chat/info', {
        params: { memberId, planId }
      });
      const info = response.data as ChatInfoResponse;
      
      // Map the member service response to chat configuration
      const selectedPlan = info.plans?.find(plan => plan.planId === planId) || info.plans?.[0];
      
      if (!selectedPlan) {
        throw new ChatError('Plan information not available', 'CONFIGURATION_ERROR');
      }
      
      // Parse business hours to determine if currently in operating hours
      // Format examples: "M_F_8_6" (Mon-Fri 8AM-6PM) or "S_S_24" (24/7)
      const businessHoursStr = selectedPlan.businessHours || '';
      const is24x7 = businessHoursStr?.includes('24');
      const isOpen = is24x7 || calculateIsBusinessHoursOpen(businessHoursStr);
      
      // Determine chat mode based on plan type criteria
      const cloudChatEligible = selectedPlan.cloudChatEligible === true;
      
      // Extract fields with safe fallbacks
      const firstName = info.firstName || '';
      const lastName = info.lastName || '';
      
      // Format member ID to match the expected format in click_to_chat.js: subscriberId-sfx
      const formattedMemberId = info.subscriberId && info.sfx 
        ? `${info.subscriberId}-${info.sfx}`
        : String(memberId);
      
      // Get client ID
      const clientId = getClientId(selectedPlan);
      
      set({
        // Set eligibility with chatAvailable flag required by the type
        eligibility: {
          ...info,
          chatAvailable: true
        },
        isEligible: !!selectedPlan.isEligibleForChat,
        chatMode: cloudChatEligible ? 'cloud' : 'legacy',
        chatGroup: selectedPlan.groupId,
        isOOO: !isOpen,
        businessHoursText: formatBusinessHours(businessHoursStr),
        routingInteractionId: info.routingChatbotInteractionId || '',
        userData: {
          MEMBER_ID: formattedMemberId,
          GROUP_ID: selectedPlan.groupId || '',
          PLAN_ID: planId,
          firstname: firstName,
          lastname: lastName,
          LOB: clientId,
          IDCardBotName: info.idCardBotName || '',
          IsMedicalEligible: String(!!selectedPlan.isMedicalEligible),
          IsDentalEligible: String(!!selectedPlan.isDentalEligible),
          IsVisionEligible: String(!!selectedPlan.isVisionEligible),
          MEMBER_DOB: info.dob || '',
          INQ_TYPE: determineInquiryType(clientId),
        },
        formInputs: [
          { id: 'MEMBER_ID', value: formattedMemberId },
          { id: 'GROUP_ID', value: selectedPlan.groupId || '' },
          { id: 'PLAN_ID', value: planId },
          { id: 'firstname', value: firstName },
          { id: 'lastname', value: lastName },
          { id: 'LOB', value: clientId },
          { id: 'MEMBER_DOB', value: info.dob || '' },
          // If routing chatbot is eligible, add its configuration
          ...(info.routingChatbotEligible ? [
            { id: 'ChatBotID', value: 'RoutingChatbot' },
            { id: 'SERV_TYPE', value: '' }
          ] : [
            { id: 'SERV_TYPE', value: '' }
          ])
        ],
        isLoading: false
      });
    } catch (err) {
      console.error('Error loading chat configuration:', err);
      set({ 
        error: err instanceof ChatError ? err : new ChatError('Failed to load chat configuration', 'API_ERROR'),
        isLoading: false,
        isEligible: false
      });
    }
  },

  startChat: () => set({ isChatActive: true }),
  endChat: () => set({ isChatActive: false }),
}));

/**
 * Determines the inquiry type based on client ID, matching the logic in click_to_chat.js
 */
function determineInquiryType(clientId: string): string {
  const ClientIdConst = {
    BlueCare: 'BC',
    BlueCarePlus: 'DS',
    CoverTN: 'CT',
    CoverKids: 'CK',
    SeniorCare: 'BA',
    Individual: 'INDV',
    BlueElite: 'INDVMX',
  };
  
  const ChatTypeConst = {
    BlueCareChat: 'BlueCare_Chat',
    SeniorCareChat: 'SCD_Chat',
    DefaultChat: 'MBAChat',
  };

  switch (clientId) {
    case ClientIdConst.BlueCare:
    case ClientIdConst.BlueCarePlus:
    case ClientIdConst.CoverTN:
    case ClientIdConst.CoverKids:
      return ChatTypeConst.BlueCareChat;
    case ClientIdConst.SeniorCare:
    case ClientIdConst.BlueElite:
      return ChatTypeConst.SeniorCareChat;
    case ClientIdConst.Individual:
    default:
      return ChatTypeConst.DefaultChat;
  }
}

/**
 * Determines the client ID based on plan details, matching the logic in click_to_chat.js
 */
function getClientId(plan: unknown): string {
  const ClientIdConst = {
    BlueCare: 'BC',
    BlueCarePlus: 'DS',
    CoverTN: 'CT',
    CoverKids: 'CK',
    SeniorCare: 'BA',
    Individual: 'INDV',
    BlueElite: 'INDVMX',
  };

  // Type guard to safely access properties on the unknown plan object
  const typedPlan = plan as Record<string, any>;
  
  // Following the pattern in click_to_chat.js for client ID determination
  if (typedPlan && typedPlan.isBlueElite) {
    return ClientIdConst.BlueElite;
  }
  
  if (typedPlan && typedPlan.groupType === 'INDV') {
    return ClientIdConst.Individual;
  }
  
  // Default to memberClientID or 'Default' if not available
  return (typedPlan && typedPlan.memberClientID) || 'Default';
}
