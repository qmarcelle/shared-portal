import { logger } from '@/utils/logger';

interface UserContext {
  memberId: string;
  firstName?: string;
  lastName?: string;
  subscriberId?: string;
  suffix?: string;
}

interface AppSession {
  isAuthenticated: boolean;
  user: string;
  plan: {
    memCk: string;
    grpId: string;
  };
  timestamp: string;
}

declare global {
  interface Window {
    __APP_SESSION__?: AppSession;
  }
}

export function useUserContext(): UserContext | null {
  try {
    // Get session data from global state
    const session =
      typeof window !== 'undefined' ? window.__APP_SESSION__ : undefined;

    if (!session?.isAuthenticated || !session?.plan?.memCk) {
      logger.warn('[useUserContext] No valid session or member ID found', {
        session,
      });
      return null;
    }

    // Use the member check ID as the member ID
    const context: UserContext = {
      memberId: session.plan.memCk,
      // We don't have these fields in the current session, but the API might provide them
      firstName: undefined,
      lastName: undefined,
      subscriberId: undefined,
      suffix: undefined,
    };

    return context;
  } catch (error) {
    logger.error('[useUserContext] Error getting user context', error);
    return null;
  }
}
