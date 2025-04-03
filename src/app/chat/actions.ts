'use server';

import { auth, SERVER_ACTION_NO_SESSION_ERROR } from '@/auth';
import { ChatSessionJWT } from '@/models/chat/session';
import {
  endChatSession,
  sendChatMessage,
  startChatSession,
} from '@/utils/chatAPI';
import { logger } from '@/utils/logger';
import { getServerSideUserId } from '@/utils/server_session';

export async function initializeChatSession(planId: string) {
  try {
    const userId = await getServerSideUserId();
    const session = await auth();
    if (!session?.user) {
      throw SERVER_ACTION_NO_SESSION_ERROR;
    }

    const jwt: ChatSessionJWT = {
      userID: userId,
      planId,
      userRole: session.user.currUsr?.role,
      groupId: session.user.currUsr?.plan?.grpId,
      subscriberId: session.user.currUsr?.plan?.subId,
    };

    const chatSession = await startChatSession(planId, {
      email: session.user.email,
      firstName: session.user.currUsr?.umpi || '',
      lastName: session.user.currUsr?.umpi || '', // Using UMPI as fallback since firstName/lastName aren't available
    });

    logger.info('Chat session initialized', { userId, planId });
    return {
      success: true,
      session: chatSession,
      jwt,
    };
  } catch (error) {
    logger.error('Error initializing chat session:', error);
    return {
      success: false,
      error: 'Failed to initialize chat session',
    };
  }
}

export async function sendMessage(sessionId: string, message: string) {
  try {
    const userId = await getServerSideUserId();
    const session = await auth();
    if (!session?.user) {
      throw SERVER_ACTION_NO_SESSION_ERROR;
    }

    const jwt: ChatSessionJWT = {
      userId,
      planId: session.user.currUsr?.plan?.memCk || '',
      userRole: session.user.currUsr?.role,
      groupId: session.user.currUsr?.plan?.grpId,
      subscriberId: session.user.currUsr?.plan?.subId,
    };

    const response = await sendChatMessage(sessionId, message, jwt);
    logger.info('Message sent successfully', { userId, sessionId });
    return {
      success: true,
      message: response,
    };
  } catch (error) {
    logger.error('Error sending message:', error);
    return {
      success: false,
      error: 'Failed to send message',
    };
  }
}

export async function closeChatSession(sessionId: string) {
  try {
    const userId = await getServerSideUserId();
    await endChatSession(sessionId);
    logger.info('Chat session closed', { userId, sessionId });
    return {
      success: true,
    };
  } catch (error) {
    logger.error('Error closing chat session:', error);
    return {
      success: false,
      error: 'Failed to close chat session',
    };
  }
}
