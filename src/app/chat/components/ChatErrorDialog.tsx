'use client';
import { AlertTriangle } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/chat/components/cp_ui/AlertDialog';
import { cn } from '@/app/chat/lib/utils';

export interface ChatErrorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  errorMessage: string;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  className?: string;
}

export function ChatErrorDialog({
  isOpen,
  onOpenChange,
  title,
  errorMessage,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Try Again',
  className,
}: ChatErrorDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn('max-w-md rounded-lg', className)}>
        <AlertDialogHeader className="gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <AlertDialogTitle className="text-lg font-bold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-gray-600">
            {errorMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary hover:bg-primary-600 text-white focus-visible:ring-primary/70"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
