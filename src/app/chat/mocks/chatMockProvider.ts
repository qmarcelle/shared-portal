import { ChatConfig, GenesysConfig } from '../schemas/genesys.schema';
import { MemberInfo } from '../types/genesys';

/**
 * Mock member info
 */
export const mockMemberInfo: MemberInfo = {
  firstName: 'John',
  lastName: 'Doe',
  memberCk: 'mock-member-123',
  subscriberCk: 'mock-subscriber-123',
  groupId: 'mock-group-123',
  networkId: 'mock-network-123',
  planFhirId: 'mock-fhir-123',
  umpi: 'mock-umpi-123',
  userFhirId: 'mock-user-fhir-123',
};

/**
 * Mock Genesys environment configuration for testing
 */
export const mockGenesysConfig: GenesysConfig = {
  deploymentId: 'mock-deployment-123',
  orgId: 'mock-org-123',
  environment: 'development',
  scriptUrl: 'https://mock-genesys-api.example.com',
  userRole: 'MEMBER',
};

/**
 * Mock chat configuration
 */
export const mockChatConfig: ChatConfig = {
  userRole: 'MEMBER',
  isAmplifyMem: false,
  isDemoMember: false,
  routingchatbotEligible: false,
  isChatAvailable: true,
  isIDCardEligible: true,
  chatbotEligible: true,
  workingHrs: 'Monday - Friday, 8 AM - 6 PM ET',
  rawChatHrs: '8_18',
  isBlueEliteGroup: false,
  calculatedCiciId: 'INDV',
  clickToChatToken: 'mock-token-123',
  memberCk: 'mock-member-123',
};

/**
 * Mock session data for the Genesys component
 */
export const mockSessionData = {
  isAmplifyMem: false,
  userRole: 'MEMBER' as const,
  memberCk: 'mock-member-ck',
  subscriberCk: 'mock-subscriber-ck',
  groupId: 'mock-group-id',
  networkId: 'mock-network-id',
  planFhirId: 'mock-plan-fhir-id',
  umpi: 'mock-umpi',
  userFhirId: 'mock-user-fhir-id',
  isBlueEliteGroup: false,
  memberInfo: {
    firstName: 'Mock',
    lastName: 'User',
    memberCk: 'mock-member-ck',
    networkId: 'mock-network-id',
    userRole: 'MEMBER' as const,
  },
  chatConfig: {
    chatbotEligible: true,
    routingchatbotEligible: true,
    isChatAvailable: true,
    isDemoMember: false,
    isDental: false,
    isMedical: true,
    isVision: false,
    isWellnessOnly: false,
    isCobraEligible: false,
    groupType: 'INDV',
    isIDCardEligible: true,
    workingHrs: 'Monday - Friday, 8 AM - 6 PM ET',
    rawChatHrs: '8_18',
    calculatedCiciId: 'mock-group-id_MEMBER',
    clientId: 'INDV',
    chatUrl: '',
    environment: 'development',
    debug: false,
    memberCk: 'mock-member-ck',
    userRole: 'MEMBER',
    isAmplifyMem: false,
  },
};

/**
 * Mock Genesys chat response
 */
export const mockGenesysResponse = {
  status: 'connected',
  messages: [],
  participants: [
    {
      id: 'user-1',
      role: 'user',
      name: 'Test User',
    },
    {
      id: 'agent-1',
      role: 'agent',
      name: 'Test Agent',
    },
  ],
  configuration: {
    features: {
      chat: true,
      cobrowse: false,
    },
    settings: {
      maxMessageLength: 10000,
      fileUpload: false,
    },
  },
};
