import { logger } from '@/utils/logger';
import { DefaultSession, useSession } from 'next-auth/react';

interface UserContext {
  memberId: string;
  firstName?: string;
  lastName?: string;
  subscriberId?: string;
  suffix?: string;
}

// Extend the Session type to include our custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      memberId: string;
      firstName?: string;
      lastName?: string;
      subscriberId?: string;
      suffix?: string;
    } & DefaultSession['user'];
  }
}

export function useUserContext(): UserContext | null {
  const { data: session } = useSession();

  try {
    if (!session?.user) {
      logger.warn('[useUserContext] No session found');
      return null;
    }

    // Extract user data from session
    const context: UserContext = {
      memberId: session.user.memberId,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      subscriberId: session.user.subscriberId,
      suffix: session.user.suffix,
    };

    if (!context.memberId) {
      logger.warn('[useUserContext] No member ID found in session');
      return null;
    }

    return context;
  } catch (error) {
    logger.error('[useUserContext] Error getting user context', error);
    return null;
  }
}
