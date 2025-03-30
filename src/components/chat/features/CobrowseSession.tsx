import React, { useEffect, useState } from 'react';
import { CobrowseState } from '../../../models/chat';
import { CobrowseService } from '../../../utils/CobrowseService';

interface CobrowseSessionProps {
  sessionState: CobrowseState;
  cobrowseService: CobrowseService;
  onStateChange: (state: CobrowseState) => void;
}

/**
 * Component that manages and displays the screen sharing/co-browse session status
 */
const CobrowseSession: React.FC<CobrowseSessionProps> = ({
  sessionState,
  cobrowseService,
  onStateChange,
}) => {
  const [sessionCode, setSessionCode] = useState<string>('');

  useEffect(() => {
    // Initialize cobrowse when component mounts
    const initCobrowse = async () => {
      try {
        await cobrowseService.initialize();

        if (sessionState === 'pending') {
          const code = await cobrowseService.createSession();
          setSessionCode(code);
        }
      } catch (error) {
        console.error('Error initializing cobrowse:', error);
        onStateChange('inactive');
      }
    };

    initCobrowse();

    // Add custom event listeners for cobrowse status changes
    const handleSessionEvents = () => {
      // This would normally use the cobrowseIO events, but since the service
      // doesn't expose them, we'll use a polling approach in a real implementation
      // For now, we just maintain the state as provided
    };

    // Set up event listener for window events that might indicate session state
    window.addEventListener('focus', handleSessionEvents);

    return () => {
      window.removeEventListener('focus', handleSessionEvents);
      // End session on unmount if active
      if (sessionState !== 'inactive') {
        cobrowseService.endSession().catch(console.error);
      }
    };
  }, [cobrowseService, onStateChange, sessionState]);

  // Cancel the current session
  const handleEndSession = () => {
    cobrowseService.endSession().catch(console.error);
    onStateChange('inactive');
  };

  // If session is inactive, don't render anything
  if (sessionState === 'inactive') {
    return null;
  }

  // Render session indicator based on state
  return (
    <div
      className={`fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-3 ${sessionState === 'active' ? 'bg-error-light' : 'bg-warning-light'}`}
    >
      <div className="flex items-center">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${sessionState === 'active' ? 'bg-error animate-pulse' : 'bg-warning'}`}
        />

        <div className="mr-4">
          <p className="font-medium">
            {sessionState === 'active'
              ? 'Screen sharing active'
              : 'Screen sharing pending...'}
          </p>
          <p className="text-xs text-secondary">
            {sessionState === 'active'
              ? 'A representative can see your screen'
              : sessionCode
                ? `Share code: ${sessionCode}`
                : 'Initializing...'}
          </p>
        </div>

        <button
          onClick={handleEndSession}
          className="py-1 px-3 bg-secondary text-white text-sm rounded-md"
          type="button"
        >
          End
        </button>
      </div>
    </div>
  );
};

export default CobrowseSession;
