// Mock models for chat tests

// Client type enum
export enum ClientType {
  BlueCare = 'BC',
  BlueCarePlus = 'DS',
  CoverTN = 'CT',
  CoverKids = 'CK',
  SeniorCare = 'BA',
  Individual = 'INDV',
  BlueElite = 'INDVMX',
  Default = 'Default',
}

// Chat type enum
export enum ChatType {
  BlueCareChat = 'BlueCare_Chat',
  SeniorCareChat = 'SCD_Chat',
  DefaultChat = 'MBAChat',
}

// Basic chat message type
export interface ChatMessage {
  id?: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp?: number;
}

// Chat session information
export interface ChatSession {
  id: string;
  active: boolean;
  agentName?: string;
  messages: ChatMessage[];
}

// Plan information
export interface PlanInfo {
  planId: string;
  planName: string;
  lineOfBusiness: string; // Maps to ClientType
  isEligibleForChat: boolean;
  businessHours?: string;
}
