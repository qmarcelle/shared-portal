// Base services
export { ChatService } from './ChatService';
export { CobrowseService } from './CobrowseService';
export { GenesysChatService } from './GenesysChatService';

// API functions
export {
  checkChatEligibility,
  endChatSession,
  endCobrowseSession,
  getBusinessHours,
  sendChatMessage,
  startChatSession,
  startCobrowseSession,
} from './chatAPI';

// Utility functions
export {
  checkChatHours,
  formatLegacyChatHours,
  getBusinessHoursMessage,
  parseLegacyChatHours,
} from './utils/chatHours';

export {
  formatBusinessHours as formatLegacyBusinessHours,
  generateInteractionId,
  getChatAvailabilityMessage,
  interpretWorkingHours,
} from './utils/chatUtils';
