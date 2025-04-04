'use server';

import { auth, SERVER_ACTION_NO_SESSION_ERROR, unstable_update } from '@/auth';
import { logger } from '@/utils/logger';
import { getServerSideUserId } from '@/utils/server_session';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { ChatService } from './services/ChatService';
import { ChatSessionJWT, UserEligibility } from './types';

export async function initializeChatSession(planId: string) {
  try {
    const userId = await getServerSideUserId();
    const session = await auth();
    if (!session?.user) {
      logger.error('Chat Session Initialization Failed - No Session', {
        userId,
        planId,
      });
      throw SERVER_ACTION_NO_SESSION_ERROR;
    }

    logger.info('Initializing Chat Session', {
      userId,
      planId,
      userRole: session.user.currUsr?.role,
    });

    const jwt: ChatSessionJWT = {
      userID: userId,
      planId,
      userRole: session.user.currUsr?.role,
      groupId: session.user.currUsr?.plan?.grpId,
      subscriberId: session.user.currUsr?.plan?.subId,
      currUsr: {
        umpi: session.user.currUsr?.umpi || '',
        role: session.user.currUsr?.role || '',
        plan: session.user.currUsr?.plan,
      },
    };

    // Create a new chat service instance
    const chatService = new ChatService({
      token: '', // These would be filled with actual values
      endPoint: '',
      opsPhone: '',
      memberFirstname: session.user.currUsr?.umpi || '',
      memberLastname: session.user.currUsr?.umpi || '',
      memberId: session.user.currUsr?.plan?.subId || '',
      groupId: session.user.currUsr?.plan?.grpId || '',
      planId,
      planName: '',
      businessHours: {
        isOpen24x7: false,
        days: [],
      },
    });

    const chatSession = await chatService.startChatSession(
      planId,
      {
        firstName: session.user.currUsr?.umpi || '',
        lastName: session.user.currUsr?.umpi || '',
        email: session.user.email,
      },
      jwt,
    );

    logger.info('Chat Session Initialized Successfully', {
      userId,
      planId,
      sessionId: chatSession.id,
      agentName: chatSession.agentName,
    });

    return {
      success: true,
      session: chatSession,
      jwt,
    };
  } catch (error) {
    logger.error('Chat Session Initialization Failed', error, {
      userId: await getServerSideUserId(),
      planId,
    });
    return {
      success: false,
      error: 'Failed to initialize chat session',
    };
  }
}

export async function handlePlanSwitch(newPlanId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      logger.error('Plan Switch Failed - No Session', { newPlanId });
      throw SERVER_ACTION_NO_SESSION_ERROR;
    }

    const currentPlan = session.user.currUsr?.plan;
    if (!currentPlan) {
      logger.error('Plan Switch Failed - No Current Plan', { newPlanId });
      throw new Error('No current plan found');
    }

    logger.info('Initiating Plan Switch', {
      currentPlanId: currentPlan.memCk,
      newPlanId,
      userId: session.user.currUsr?.umpi,
    });

    // Update JWT with new plan
    await unstable_update({
      user: {
        ...session.user,
        currUsr: {
          ...session.user.currUsr,
          plan: {
            ...currentPlan,
            memCk: newPlanId,
          },
        },
      },
    });

    logger.info('JWT Updated for Plan Switch', {
      newPlanId,
      userId: session.user.currUsr?.umpi,
    });

    // Initialize new chat session with updated JWT
    return await initializeChatSession(newPlanId);
  } catch (error) {
    const currentSession = await auth();
    logger.error('Plan Switch Failed', error, {
      newPlanId,
      userId: currentSession?.user?.currUsr?.umpi,
    });
    return {
      success: false,
      error: 'Failed to switch plan',
    };
  }
}

export async function endCurrentChatSession() {
  let session;
  try {
    session = await auth();
    if (!session?.user) {
      logger.error('End Chat Session Failed - No Session');
      throw SERVER_ACTION_NO_SESSION_ERROR;
    }

    const planId = session.user.currUsr?.plan?.memCk;
    if (!planId) {
      logger.error('End Chat Session Failed - No Active Plan');
      throw new Error('No active plan found');
    }

    logger.info('Ending Chat Session', {
      planId,
      userId: session.user.currUsr?.umpi,
    });

    const chatService = new ChatService({
      token: '',
      endPoint: '',
      opsPhone: '',
      memberFirstname: '',
      memberLastname: '',
      memberId: '',
      groupId: '',
      planId,
      planName: '',
      businessHours: {
        isOpen24x7: false,
        days: [],
      },
    });

    await chatService.disconnect();

    logger.info('Chat Session Ended Successfully', {
      planId,
      userId: session.user.currUsr?.umpi,
    });

    return { success: true };
  } catch (error) {
    logger.error('End Chat Session Failed', error, {
      userId: session?.user?.currUsr?.umpi,
    });
    return {
      success: false,
      error: 'Failed to end chat session',
    };
  }
}

export async function sendMessage(message: string) {
  let session;
  try {
    session = await auth();
    if (!session?.user) {
      logger.error('Send Message Failed - No Session', { message });
      throw SERVER_ACTION_NO_SESSION_ERROR;
    }

    const planId = session.user.currUsr?.plan?.memCk;
    if (!planId) {
      logger.error('Send Message Failed - No Active Plan', { message });
      throw new Error('No active plan found');
    }

    logger.info('Sending Chat Message', {
      planId,
      userId: session.user.currUsr?.umpi,
      messageLength: message.length,
    });

    const chatService = new ChatService({
      token: '',
      endPoint: '',
      opsPhone: '',
      memberFirstname: '',
      memberLastname: '',
      memberId: '',
      groupId: '',
      planId,
      planName: '',
      businessHours: {
        isOpen24x7: false,
        days: [],
      },
    });

    await chatService.sendMessage(message);

    logger.info('Chat Message Sent Successfully', {
      planId,
      userId: session.user.currUsr?.umpi,
    });

    return { success: true };
  } catch (error) {
    logger.error('Send Message Failed', error, {
      message,
      userId: session?.user?.currUsr?.umpi,
    });
    return {
      success: false,
      error: 'Failed to send message',
    };
  }
}

/**
 * Fetch the chat eligibility information for a specific plan
 * @param planId The plan ID to check eligibility for
 */
export async function fetchChatEligibility(
  planId: string,
): Promise<UserEligibility> {
  try {
    // Get the member CK from cookies
    const memberCk = cookies().get('memberCk')?.value;

    if (!memberCk) {
      throw new Error('Member information not found');
    }

    // Call the API to get chat info
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/member/v1/members/byMemberCk/${memberCk}/chat/getChatInfo?planId=${planId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch chat eligibility: ${response.statusText}`,
      );
    }

    // Parse the response
    const data = await response.json();

    // Map the API response to our UserEligibility type
    return {
      isChatEligibleMember: data.cloudChatEligible,
      isDemoMember: false,
      isAmplifyMem: false,
      groupId: data.groupId || '',
      memberClientID: '',
      getGroupType: '',
      isBlueEliteGroup: false,
      isMedical: false,
      isDental: false,
      isVision: false,
      isWellnessOnly: false,
      isCobraEligible: false,
      chatHours: data.workingHours || 'M_F_8_6',
      rawChatHours: data.workingHours || '',
      isChatbotEligible: data.chatBotEligibility || false,
      memberMedicalPlanID: '',
      isIDCardEligible: false,
      memberDOB: '',
      subscriberID: '',
      sfx: '',
      memberFirstname: '',
      memberLastName: '',
      userID: '',
      isChatAvailable: data.chatAvailable || false,
      routingchatbotEligible: data.routingChatBotEligibility || false,
      idCardChatBotName: data.chatIDChatBotName || '',
    };
  } catch (error) {
    console.error('Error fetching chat eligibility:', error);
    return {
      isChatEligibleMember: false,
      isDemoMember: false,
      isAmplifyMem: false,
      groupId: '',
      memberClientID: '',
      getGroupType: '',
      isBlueEliteGroup: false,
      isMedical: false,
      isDental: false,
      isVision: false,
      isWellnessOnly: false,
      isCobraEligible: false,
      chatHours: 'M_F_8_6',
      rawChatHours: '',
      isChatbotEligible: false,
      memberMedicalPlanID: '',
      isIDCardEligible: false,
      memberDOB: '',
      subscriberID: '',
      sfx: '',
      memberFirstname: '',
      memberLastName: '',
      userID: '',
      isChatAvailable: false,
      routingchatbotEligible: false,
    };
  }
}

/**
 * Initialize a chat session
 * @param planId The plan ID to start a chat session for
 */
export async function initializeChat(planId: string) {
  try {
    // Get eligibility first
    const eligibility = await fetchChatEligibility(planId);

    if (!eligibility.isChatEligibleMember || !eligibility.isChatAvailable) {
      return {
        success: false,
        error: 'Chat is not available for this plan',
        eligibility,
      };
    }

    // Return success with eligibility info
    return {
      success: true,
      eligibility,
    };
  } catch (error) {
    console.error('Error initializing chat:', error);
    return {
      success: false,
      error: 'Failed to initialize chat',
    };
  }
}

/**
 * End a chat session
 * @param sessionId The session ID to end
 */
export async function endChat() {
  try {
    // In a real implementation, you might need to call an API to end the session
    // For now, we'll just return success
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error ending chat:', error);
    return {
      success: false,
      error: 'Failed to end chat',
    };
  }
}

/**
 * Lock the plan switcher during an active chat
 */
export async function lockPlanSwitcher() {
  try {
    // Update the user's session to indicate plan switching is locked
    // This might be a cookie or session update in a real implementation

    // Revalidate the path to ensure UI updates
    revalidatePath('/');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error locking plan switcher:', error);
    return {
      success: false,
      error: 'Failed to lock plan switcher',
    };
  }
}

/**
 * Unlock the plan switcher after a chat ends
 */
export async function unlockPlanSwitcher() {
  try {
    // Update the user's session to indicate plan switching is unlocked
    // This might be a cookie or session update in a real implementation

    // Revalidate the path to ensure UI updates
    revalidatePath('/');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error unlocking plan switcher:', error);
    return {
      success: false,
      error: 'Failed to unlock plan switcher',
    };
  }
}

/**
 * Generates a unique interaction ID for the chat session
 * @returns A unique interaction ID
 */
export function generateInteractionId(): string {
  return `MP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
