'use client';

import { ReactNode } from 'react';

/**
 * Combines pre-chat UI elements including terms and conditions and initial questionnaire
 */
export function PreChatWindow({ 
  isOpen, 
  onSubmit, 
  termsAccepted,
  onTermsAccepted,
  children 
}: { 
  isOpen: boolean;
  onSubmit: () => void;
  termsAccepted: boolean;
  onTermsAccepted: (accepted: boolean) => void;
  children?: ReactNode;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="pre-chat-window">
      <div className="pre-chat-header">
        <h3>Before we begin</h3>
      </div>
      
      <div className="pre-chat-content">
        {children}
        
        <TermsAndConditions 
          accepted={termsAccepted} 
          onAcceptedChange={onTermsAccepted} 
        />
      </div>
      
      <div className="pre-chat-actions">
        <button 
          className="pre-chat-submit"
          disabled={!termsAccepted}
          onClick={onSubmit}
        >
          Start Chat
        </button>
      </div>
    </div>
  );
}

/**
 * Terms and conditions component for pre-chat
 */
export function TermsAndConditions({ 
  accepted, 
  onAcceptedChange 
}: { 
  accepted: boolean; 
  onAcceptedChange: (accepted: boolean) => void;
}) {
  return (
    <div className="terms-and-conditions">
      <label className="terms-checkbox-label">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAcceptedChange(e.target.checked)}
          className="terms-checkbox"
        />
        I accept the terms and conditions for chat support
      </label>
      
      <div className="terms-text">
        By using this chat service, you agree that your conversation may be recorded for quality and training purposes.
      </div>
    </div>
  );
}