'use client';

import type { UserRole } from '@/userManagement/models/sessionUser'; // Added for UserRole
import { logger } from '@/utils/logger';
import { SessionContextValue, useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Align with UserConfig expected by buildGenesysChatConfig
interface UserContextForChat {
  userID: string; // umpi from session.user.currUsr
  memberId: string; // umpi from session.user.currUsr (can be same as userID or specific member identifier if different)
  firstName?: string;
  lastName?: string;
  formattedFirstName?: string; // Can default to firstName
  subscriberID?: string; // subId from session.user.currUsr.plan
  sfx?: string; // suffix from session.user.currUsr
  memberType?: UserRole; // role from session.user.currUsr
}

// Reflects the populated session.user.currUsr structure
interface SessionCurrentUser {
  umpi: string;
  fhirId: string; // Available, not directly in UserContextForChat but good to acknowledge
  role: UserRole;
  firstName?: string; // From UserProfile
  lastName?: string; // From UserProfile
  // subscriberId from plan, sfx from user record. These were in original ExtendedSession, let's ensure they are sourced correctly.
  // It's better if subscriberId and sfx for UserContextForChat are directly available on currUsr if they pertain to the user.
  // For now, assuming subscriberId and sfx might come from `plan` or `currUsr` directly.
  // If subscriberID and sfx for UserContextForChat are different from those in currUsr.plan, adjust here.
  // Let's assume currUsr might have its own subscriberId and suffix if it's a dependent.
  subscriberId?: string; // Direct from currUsr if applicable, else from plan
  suffix?: string; // Direct from currUsr
  plan?: {
    // Plan details are used more in usePlanContext, but subscriberId might be here
    memCk: string; // Used for memberId if umpi is not the one
    subId?: string; // This is often the subscriber ID
    // other plan fields
  };
}

// Define ExtendedSessionData to properly type the return of useSession()
// incorporating the structure of SessionContextValue and our custom currUsr.
interface ExtendedSession {
  user?: {
    currUsr?: SessionCurrentUser;
    // Include other standard next-auth user fields if necessary, e.g., name, email, image
  };
  expires: string; // Standard next-auth session field
  // Add any other custom fields at the top level of the session data if they exist
}

// This type represents the object returned by useSession()
interface UseSessionReturn {
  data: ExtendedSession | null; // data can be null
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: SessionContextValue['update']; // Include update function if used
}

interface UserContextReturn {
  userContext: UserContextForChat | null;
  isUserContextLoading: boolean;
}

const LOG_PREFIX = '[useUserContext]';

export function useUserContext(): UserContextReturn {
  const { data: session, status } = useSession() as UseSessionReturn;

  const [context, setContext] = useState<UserContextForChat | null>(null);
  const [loading, setLoading] = useState(true);
  const retryCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RETRIES = 3;

  const extractData = useCallback(
    (currentSession: ExtendedSession | null): UserContextForChat | null => {
      const currentUser = currentSession?.user?.currUsr;

      if (!currentUser) {
        logger.info(`${LOG_PREFIX} currentUser not found in session.`);
        return null;
      }

      const {
        umpi,
        role,
        firstName,
        lastName,
        subscriberId: userSubscriberId,
        suffix: userSuffix,
        plan,
      } = currentUser;
      const finalSubscriberId = userSubscriberId || plan?.subId;
      const finalSfx = userSuffix;

      if (!umpi || !role) {
        logger.warn(
          `${LOG_PREFIX} Missing essential fields (umpi, role) in currentUser.`,
        );
        return null;
      }

      logger.info(`${LOG_PREFIX} Extracted data for UserContext:`, {
        umpi,
        role,
        firstName,
        finalSubscriberId,
      });

      return {
        userID: umpi,
        memberId: umpi,
        firstName: firstName || '',
        lastName: lastName || '',
        formattedFirstName: firstName || '',
        subscriberID: finalSubscriberId,
        sfx: finalSfx,
        memberType: role,
      };
    },
    [],
  );

  const processSessionData = useCallback(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    try {
      if (status === 'unauthenticated') {
        logger.info(`${LOG_PREFIX} Session unauthenticated.`);
        setContext(null);
        setLoading(false);
        retryCount.current = MAX_RETRIES;
        return;
      }

      if (status === 'authenticated') {
        if (!session?.user?.currUsr) {
          logger.warn(
            `${LOG_PREFIX} Session authenticated, but session.user.currUsr is not yet populated.`,
          );
        }

        const userContextData = extractData(session);

        if (userContextData) {
          logger.info(`${LOG_PREFIX} Successfully extracted user context.`);
          setContext(userContextData);
          setLoading(false);
          retryCount.current = 0;
          if (timerRef.current) clearTimeout(timerRef.current);
        } else if (retryCount.current < MAX_RETRIES) {
          const timeoutDuration = Math.pow(2, retryCount.current) * 1000;
          logger.warn(
            `${LOG_PREFIX} Data not available or incomplete in session.user.currUsr. Retrying (${retryCount.current + 1}/${MAX_RETRIES}) in ${timeoutDuration}ms.`,
          );

          if (timerRef.current) clearTimeout(timerRef.current);

          timerRef.current = setTimeout(() => {
            retryCount.current += 1;
            setLoading(true);
            processSessionData();
          }, timeoutDuration);
        } else {
          logger.error(
            `${LOG_PREFIX} Max retries reached for fetching user context from session.user.currUsr.`,
          );
          setContext(null);
          setLoading(false);
        }
      }
    } catch (error) {
      logger.error(
        `${LOG_PREFIX} Exception while processing session data:`,
        error,
      );
      setContext(null);
      setLoading(false);
    }
  }, [status, session, extractData]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Initializing or session/status changed. Status: ${status}`,
    );
    processSessionData();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        logger.info(`${LOG_PREFIX} Cleared timer on unmount/re-effect.`);
      }
    };
  }, [processSessionData]);

  const isUserContextLoading = useMemo(
    () => status === 'loading' || loading,
    [status, loading],
  );

  useEffect(() => {
    logger.info(`${LOG_PREFIX} State update:`, {
      userContext: context ? 'Available' : 'Null',
      isUserContextLoading,
      sessionStatus: status,
      internalLoading: loading,
      retryCount: retryCount.current,
    });
  }, [context, isUserContextLoading, status, loading]);

  return useMemo(
    () => ({
      userContext: context,
      isUserContextLoading,
    }),
    [context, isUserContextLoading],
  );
}
