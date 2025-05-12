'use client';

import { useChatStore } from '../stores/chatStore';

/**
 * Combined component for displaying plan information and plan switching functionality
 */
export function PlanInfo({ planName, planId }: { planName?: string; planId?: string }) {
  const { isPlanSwitcherLocked } = useChatStore();
  
  if (!planName && !planId) return null;
  
  return (
    <div className="plan-info-container">
      {planName && <div className="plan-name">{planName}</div>}
      {planId && <div className="plan-id">ID: {planId}</div>}
      
      {!isPlanSwitcherLocked && (
        <button 
          className="plan-switcher-button"
          onClick={() => window.location.href = '/plans'}
          disabled={isPlanSwitcherLocked}
          aria-label="Switch plan"
        >
          Switch Plan
        </button>
      )}
      
      {isPlanSwitcherLocked && (
        <div className="plan-switch-locked-message">
          Plan switching is disabled during an active chat
        </div>
      )}
    </div>
  );
}