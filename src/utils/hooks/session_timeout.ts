import { useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

type SessionTimeoutProps = {
  idleTime: number;
  onTimeout: () => void;
};

export default function useSessionTimeout({
  idleTime,
  onTimeout,
}: SessionTimeoutProps) {
  const [isIdle, setIsIdle] = useState<boolean>();
  const handleTimeout = () => {
    setIsIdle(true);
    onTimeout();
  };
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * idleTime,
    onIdle: handleTimeout,
    debounce: 500,
  });
  return {
    getRemainingTime,
    getLastActiveTime,
    isIdle,
  };
}
