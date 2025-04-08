import { memberHandlers } from './memberHandlers';

// Removed MSW chat handlers - they're no longer needed as we've refactored the chat implementation
export const handlers = [...memberHandlers];
