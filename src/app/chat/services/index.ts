/**
 * Chat Services Index
 *
 * This file exports all chat-related services organized by their responsibility areas:
 * - Core services (ChatService, AuthService)
 * - Feature services (BusinessHours, PlanSwitching)
 * - Integration services (Cobrowse)
 * - API services
 */

// Chat Services
export * from './chat/ChatService';
export * from './chat/LegacyOnPremProvider';
export * from './chat/WebMessagingProvider';

// Auth Services
export * from './auth/ChatAuthService';

// Plan Services
export * from './plan/PlanService';

// Business Hours Services
export * from './business-hours/BusinessHoursService';

// Integration Services
export { CobrowseService } from './cobrowse/CobrowseService';

// API Services
export * from './api/cp-chat-api';
export * from './api/index';

// Utils
export * from './utils/chatHours';
