import { auth } from '@/auth';
import { logger } from '@/utils/logger';
import { ChatSession, ChatSessionJWT } from '../types';

export class ChatAuthService {
  private static instance: ChatAuthService;
  private session: ChatSession | null = null;

  private constructor() {}

  public static getInstance(): ChatAuthService {
    if (!ChatAuthService.instance) {
      ChatAuthService.instance = new ChatAuthService();
    }
    return ChatAuthService.instance;
  }

  /**
   * Initialize a chat session using the current auth session
   */
  public async initializeSession(): Promise<ChatSession> {
    try {
      const session = await auth();
      if (!session?.user) {
        throw new Error('No active session found');
      }

      const jwt: ChatSessionJWT = {
        token: session.token,
        userID: session.user.id,
        userRole: session.user.currUsr?.role,
        planId: session.user.currUsr?.plan?.memCk || '',
        groupId: session.user.currUsr?.plan?.grpId,
        subscriberId: session.user.currUsr?.plan?.subId,
        currUsr: {
          umpi: session.user.currUsr?.umpi || '',
          role: session.user.currUsr?.role || '',
          plan: session.user.currUsr?.plan,
        },
      };

      const newSession: ChatSession = {
        id: session.user.id,
        active: true,
        planId: session.user.currUsr?.plan?.memCk || '',
        planName: session.user.currUsr?.plan?.memCk || '',
        isPlanSwitchingLocked: false,
        messages: [],
        jwt,
        lastUpdated: Date.now(),
      };

      this.session = newSession;
      return newSession;
    } catch (error) {
      logger.error('Failed to initialize chat session:', error);
      throw error;
    }
  }

  /**
   * Get the current chat session JWT
   */
  public async getSessionJWT(): Promise<ChatSessionJWT> {
    const session = await auth();
    if (!session?.user || !session.user.currUsr) {
      throw new Error('Missing required session data');
    }

    return {
      token: session.token,
      userID: session.user.id,
      userRole: session.user.currUsr?.role,
      planId: session.user.currUsr?.plan?.memCk || '',
      groupId: session.user.currUsr?.plan?.grpId,
      subscriberId: session.user.currUsr?.plan?.subId,
      currUsr: {
        umpi: session.user.currUsr?.umpi || '',
        role: session.user.currUsr?.role || '',
        plan: session.user.currUsr?.plan,
      },
    };
  }

  /**
   * Get the current chat session
   */
  public getCurrentSession(): ChatSession | null {
    return this.session;
  }

  /**
   * Clear the current chat session
   */
  public clearSession(): void {
    this.session = null;
  }

  /**
   * Check if the current session is valid for chat
   */
  public async isValidSession(): Promise<boolean> {
    try {
      const session = await auth();
      return !!session?.user && !!session.user.currUsr;
    } catch (error) {
      logger.error('Error checking session validity:', error);
      return false;
    }
  }
}
