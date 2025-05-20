'use client';

import { ChevronRight, MessageSquare } from 'lucide-react';

import { Button } from '@/app/chat/components/cp_ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/chat/components/cp_ui/Dialog';

export interface PreChatModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hasMultiplePlans: boolean;
  currentPlanName?: string;
  onSwitchPlanRequest: () => void;
  onStartChatConfirm: () => void;
}

export function PreChatModal({
  isOpen,
  onOpenChange,
  hasMultiplePlans,
  currentPlanName,
  onSwitchPlanRequest,
  onStartChatConfirm,
}: PreChatModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl text-primary">
              Start a Chat
            </DialogTitle>
          </div>
          <DialogDescription>
            Chat with a customer service representative about your health plan
            benefits, claims, or other questions.
          </DialogDescription>
        </DialogHeader>

        {hasMultiplePlans && currentPlanName && (
          <div className="py-4">
            <div className="mb-2 text-sm font-medium">
              You&apos;ll be chatting about:
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-[#F5F5F5] px-4 py-3 rounded-md">
                <p className="font-medium">{currentPlanName}</p>
                <p className="text-sm text-gray-500">Health Plan</p>
              </div>
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                onClick={onSwitchPlanRequest}
              >
                Switch Plan
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="py-2">
          <h4 className="text-sm font-medium mb-2">Before you begin:</h4>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Our representatives are available Monday-Friday, 8am-8pm ET.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                For security, we may need to verify your identity before
                discussing specific plan details.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                For medical emergencies, please call 911 or go to the nearest
                emergency room.
              </span>
            </li>
          </ul>
        </div>

        <DialogFooter className="mt-4 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary-600 text-white"
            onClick={onStartChatConfirm}
          >
            Start Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
