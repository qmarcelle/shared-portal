import { useCallback, useEffect, useState } from 'react';
import { CobrowseState } from '../../../models/chat';
import { CobrowseService } from '../../../services/chat/CobrowseService';

interface UseCobrowseProps {
  cobrowseService: CobrowseService;
}

interface UseCobrowseResult {
  sessionState: CobrowseState;
  sessionCode: string | null;
  showConsent: boolean;
  requestCobrowse: () => void;
  acceptConsent: () => Promise<void>;
  declineConsent: () => void;
  endSession: () => Promise<void>;
}

/**
 * Hook to manage cobrowse/screen sharing functionality
 */
export const useCobrowse = ({
  cobrowseService,
}: UseCobrowseProps): UseCobrowseResult => {
  const [sessionState, setSessionState] = useState<CobrowseState>('inactive');
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      // End session if active when component unmounts
      if (sessionState !== 'inactive') {
        cobrowseService.endSession().catch(console.error);
      }
    };
  }, [cobrowseService, sessionState]);

  // Request cobrowse session
  const requestCobrowse = useCallback(() => {
    setShowConsent(true);
  }, []);

  // Accept consent and start session
  const acceptConsent = useCallback(async () => {
    setShowConsent(false);
    try {
      // Initialize cobrowse
      await cobrowseService.initialize();

      // Change state to pending
      setSessionState('pending');

      // Create session and get code
      const code = await cobrowseService.createSession();
      setSessionCode(code);
    } catch (error) {
      console.error('Error starting cobrowse session:', error);
      setSessionState('inactive');
    }
  }, [cobrowseService]);

  // Decline consent
  const declineConsent = useCallback(() => {
    setShowConsent(false);
  }, []);

  // End cobrowse session
  const endSession = useCallback(async () => {
    try {
      await cobrowseService.endSession();
      setSessionState('inactive');
      setSessionCode(null);
    } catch (error) {
      console.error('Error ending cobrowse session:', error);
    }
  }, [cobrowseService]);

  return {
    sessionState,
    sessionCode,
    showConsent,
    requestCobrowse,
    acceptConsent,
    declineConsent,
    endSession,
  };
};
