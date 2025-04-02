import {
  BusinessHours,
  ChatEligibility,
  ChatMessage,
  ChatSession,
  CobrowseSession,
} from '../../models/chat';

const API_BASE = '/api/v1/chat';

/**
 * Check if the user is eligible for chat based on their plan
 */
export async function checkChatEligibility(
  planId: string,
): Promise<ChatEligibility> {
  try {
    const response = await fetch(`${API_BASE}/eligibility?planId=${planId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Eligibility check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking chat eligibility:', error);
    return {
      isEligible: false,
      reason: 'Unable to verify eligibility at this time.',
    };
  }
}

/**
 * Check the business hours for chat availability
 */
export async function getBusinessHours(): Promise<BusinessHours> {
  try {
    const response = await fetch(`${API_BASE}/business-hours`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Business hours check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking business hours:', error);
    // Default to closed if we can't get the hours
    return {
      isOpen24x7: false,
      days: [],
    };
  }
}

/**
 * Start a new chat session
 */
export async function startChatSession(
  planId: string,
  userInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    reason?: string;
  },
): Promise<ChatSession> {
  try {
    const response = await fetch(`${API_BASE}/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        userInfo,
      }),
    });

    if (!response.ok) {
      throw new Error(`Starting chat session failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting chat session:', error);
    throw new Error('Failed to start chat session. Please try again later.');
  }
}

/**
 * End the current chat session
 */
export async function endChatSession(sessionId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/session/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ending chat session failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error ending chat session:', error);
    throw new Error('Failed to end chat session. Please try again later.');
  }
}

/**
 * Send a message in the current chat session
 */
export async function sendChatMessage(
  sessionId: string,
  message: string,
): Promise<ChatMessage> {
  try {
    const response = await fetch(`${API_BASE}/session/${sessionId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Sending chat message failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send message. Please try again later.');
  }
}

/**
 * Start a cobrowse session
 */
export async function startCobrowseSession(
  sessionId: string,
): Promise<CobrowseSession> {
  try {
    const response = await fetch(`${API_BASE}/session/${sessionId}/cobrowse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Starting cobrowse session failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting cobrowse session:', error);
    throw new Error(
      'Failed to start cobrowse session. Please try again later.',
    );
  }
}

/**
 * End the current cobrowse session
 */
export async function endCobrowseSession(
  sessionId: string,
  cobrowseId: string,
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE}/session/${sessionId}/cobrowse/${cobrowseId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Ending cobrowse session failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error ending cobrowse session:', error);
    throw new Error('Failed to end cobrowse session. Please try again later.');
  }
}
