'use client';

import { useEffect, useState } from 'react';
import { GenesysBus, GenesysGlobal, GenesysSDK } from '../types/genesys.types';

interface GenesysDebugProps {
  enabled?: boolean;
}

/**
 * Debug component to inspect Genesys loading status
 */
export function GenesysDebug({ enabled = true }: GenesysDebugProps) {
  const [status, setStatus] = useState<{
    genesysExists: boolean;
    cxBusExists: boolean;
    genesysJsExists: boolean;
    timestamp: string;
  }>({
    genesysExists: false,
    cxBusExists: false,
    genesysJsExists: false,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    if (!enabled) return;

    const checkInterval = setInterval(() => {
      const _genesys = (window as any)._genesys as GenesysGlobal | undefined;
      const CXBus = (window as any).CXBus as GenesysBus | undefined;
      const Genesys = (window as any).Genesys as GenesysSDK | undefined;
      const _genesysJs = (window as any)._genesysJs;

      setStatus({
        genesysExists: !!_genesys || !!Genesys,
        cxBusExists: !!CXBus,
        genesysJsExists: !!_genesysJs,
        timestamp: new Date().toISOString(),
      });
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      <div>Genesys Debug - Last Updated: {new Date(status.timestamp).toLocaleTimeString()}</div>
      <div>_genesys or Genesys exists: {status.genesysExists ? '✅' : '❌'}</div>
      <div>CXBus exists: {status.cxBusExists ? '✅' : '❌'}</div>
      <div>_genesysJs exists: {status.genesysJsExists ? '✅' : '❌'}</div>
    </div>
  );
}