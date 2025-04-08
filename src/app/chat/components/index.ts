/**
 * Component Exports
 * Centralizes all component exports following the new directory structure
 */

// Core Components
export { ChatContainer } from './core/ChatContainer';
export { ChatControls } from './core/ChatControls';
export { ChatWidget } from './core/ChatWidget';

// Feature Components
export { BusinessHoursDisplay } from './features/business-hours/BusinessHoursDisplay';
export { BusinessHoursNotification } from './features/business-hours/BusinessHoursNotification';
export { ActiveChatWindow, ChatStartWindow } from './features/chat-window';
export { EligibilityCheck } from './features/eligibility/EligibilityCheck';
export { PlanSwitcher } from './features/plan-switcher/PlanSwitcher';

// Dashboard Widget
export { DashboardChatWidget } from './DashboardChatWidget';

// Shared Components
export { ChatErrorBoundary } from './shared/ChatErrorBoundary';
export { LoadingState } from './shared/LoadingState';
