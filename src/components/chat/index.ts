// Re-export core components
import { ChatBody } from './core/ChatBody';
import { ChatButton } from './core/ChatButton';
import { ChatHeader } from './core/ChatHeader';
import { ChatInput } from './core/ChatInput';
import { ChatWidget } from './core/ChatWidget';

// Re-export screen components
import { ChatForm, ChatUnavailable } from './screens';

// Re-export feature components
import { ChatDisclaimer, CobrowseConsent, CobrowseSession } from './features';

export {
  ChatBody,
  ChatButton,
  // Features
  ChatDisclaimer,
  // Screens
  ChatForm,
  ChatHeader,
  ChatInput,
  ChatUnavailable,
  // Core
  ChatWidget,
  CobrowseConsent,
  CobrowseSession,
};
