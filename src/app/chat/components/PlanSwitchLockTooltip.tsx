'use client';

import { Lock } from 'lucide-react';
import type * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/chat/components/cp_ui/Tooltip';
import { cn } from '@/app/chat/lib/utils';

export interface PlanSwitcherLockTooltipProps {
  children: React.ReactNode;
  isLocked: boolean;
  tooltipMessage: string;
  className?: string;
  delayDuration?: number;
  skipDelayDuration?: number;
}

export function PlanSwitcherLockTooltip({
  children,
  isLocked,
  tooltipMessage,
  className,
  delayDuration = 300,
  skipDelayDuration = 300,
}: PlanSwitcherLockTooltipProps) {
  // If not locked, just render the children
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('cursor-not-allowed', className)}>{children}</div>
        </TooltipTrigger>
        <TooltipContent
          className="bg-[#222222] text-white border-none rounded-[4px] px-2 py-2 text-xs"
          sideOffset={5}
        >
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3" />
            <span className="leading-tight">{tooltipMessage}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
