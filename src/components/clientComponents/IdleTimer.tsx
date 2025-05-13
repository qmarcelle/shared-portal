'use client';

import { useLoginStore } from '@/app/login/stores/loginStore';
import useSessionTimeout from '@/utils/hooks/session_timeout';
import { usePathname, useRouter } from 'next/navigation';

export const SessionIdleTimer = () => {
  const { signOut } = useLoginStore();
  const router = useRouter();
  const maxIdleTime = parseInt(
    process.env.NEXT_PUBLIC_SESSION_IDLE_TIME || '30',
  );
  const pathName = usePathname();

  const timeout = async () => {
    console.log('Session timed out due to inactivity.');
    await signOut();
    const redirectUrl: string =
      (process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URL || '/login') +
      `?TargetResource=${pathName}`;
    router.replace(redirectUrl);
  };

  const { isIdle } = useSessionTimeout({
    idleTime: maxIdleTime,
    onTimeout: timeout,
  });

  return (
    <div style={{ display: 'none' }}>
      {/* This will not show anything yet, but likely will add some UI elements to this in future */}
      {isIdle && <p>You were logged out due to inactivity.</p>}
    </div>
  );
};
