'use client';
/**
 * @file ChatPlanSwitch.tsx
 * @description Component responsible for rendering the plan switcher dropdown.
 * It integrates with the chat store to lock itself during active chat sessions
 * and displays a tooltip message as per requirements.
 * - ID: 31158: Plan switcher is disabled (locked) when chat is active.
 * - ID: 31159: Displays a hover message ("End your chat session to switch plan information.") when locked.
 */
import { Check, ChevronDown, Lock } from 'lucide-react';

import { PlanSwitcherLockTooltip } from '@/app/chat/components/PlanSwitchLockTooltip';
import { cn } from '@/app/chat/lib/utils';
import { usePlanSwitcherLock } from '../hooks/usePlanSwitcherLock';
import { useChatStore } from '../stores/chatStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './cp_ui/DropdownMenu';

export interface Plan {
  id: string;
  name: string;
  type?: string;
}

export interface PlanSwitcherProps {
  plans: Plan[];
  currentPlanId: string;
  isDisabled?: boolean;
  onPlanChange: (planId: string) => void;
  className?: string;
}

export function PlanSwitcher({
  plans,
  currentPlanId,
  isDisabled = false,
  onPlanChange,
  className,
}: PlanSwitcherProps) {
  // Custom hook to automatically lock/unlock based on chat store's session.isChatActive state.
  // This hook updates session.isPlanSwitcherLocked in the store.
  usePlanSwitcherLock();

  // Selects whether the plan switcher should be locked (due to active chat) from the store.
  const isChatLocked = useChatStore(
    (state) => state.session.isPlanSwitcherLocked,
  );
  // Selects the dynamic tooltip message for the locked plan switcher from the store.
  // This message is set by the setPlanSwitcherLocked action, sourced from usePlanSwitcherLock.
  const chatLockTooltipMessage = useChatStore(
    (state) => state.session.planSwitcherTooltipMessage, // Correctly uses the dynamic message
  );

  const currentPlan =
    plans.find((plan) => plan.id === currentPlanId) || plans[0];

  // Determine if the component should be effectively disabled, either by explicit prop or due to chat lock.
  const isEffectivelyDisabled = isDisabled || isChatLocked;

  // The dropdown trigger button
  const triggerButton = (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-disabled={isEffectivelyDisabled}
      className={cn(
        'flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        isEffectivelyDisabled
          ? 'opacity-70 cursor-not-allowed'
          : 'hover:bg-muted/50',
        className,
      )}
      disabled={isEffectivelyDisabled}
    >
      <div className="flex flex-col items-start">
        <span className="font-medium">{currentPlan.name}</span>
        {currentPlan.type && (
          <span className="text-xs text-muted-foreground">
            {currentPlan.type}
          </span>
        )}
      </div>
      <div className="flex items-center">
        {isChatLocked && (
          <Lock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );

  // If locked by an active chat session, wrap the trigger button in the PlanSwitcherLockTooltip.
  // The tooltip will display the chatLockTooltipMessage (ID: 31159).
  if (isChatLocked) {
    return (
      <PlanSwitcherLockTooltip
        isLocked={isChatLocked} // Prop to inform the tooltip component
        tooltipMessage={chatLockTooltipMessage} // The actual message to display
      >
        {triggerButton}
      </PlanSwitcherLockTooltip>
    );
  }

  // If explicitly disabled via props (but not locked by chat), render the button in a disabled state without the chat-specific lock tooltip.
  if (isDisabled) {
    return triggerButton;
  }

  // Normal interactive state: render the full dropdown menu.
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width]"
        align="start"
      >
        {plans.map((plan) => (
          <DropdownMenuItem
            key={plan.id}
            className={cn(
              'flex items-center justify-between',
              plan.id === currentPlanId && 'font-medium',
            )}
            onSelect={() => onPlanChange(plan.id)}
          >
            <div className="flex flex-col">
              <span>{plan.name}</span>
              {plan.type && (
                <span className="text-xs text-muted-foreground">
                  {plan.type}
                </span>
              )}
            </div>
            {plan.id === currentPlanId && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
