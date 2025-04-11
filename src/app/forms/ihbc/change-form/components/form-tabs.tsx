'use client';

import { useFormCompletion } from '@/lib/insurance/hooks';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type Tab = {
  id: string;
  path: string;
  label: string;
  isEnabled: () => boolean;
  section: string;
  validate?: () => boolean;
};

interface FormTabsProps {
  tabs: Tab[];
  currentPath: string;
}

export function FormTabs({ tabs, currentPath }: FormTabsProps) {
  const completionStatus = useFormCompletion();
  
  const isComplete = (tabId: string): boolean => {
    switch (tabId) {
      case 'select-changes':
        return completionStatus.selectChanges;
      case 'personal-info':
        return completionStatus.personalInfo;
      case 'dependents':
        return completionStatus.dependents;
      case 'benefits':
        return completionStatus.benefits;
      case 'special-enrollment':
        return completionStatus.specialEnrollment;
      case 'terminate-policy':
        return completionStatus.terminatePolicy;
      default:
        return false;
    }
  };
  
  return (
    <div className="mb-6">
      <nav className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const isCurrent = tab.path === currentPath;
          const complete = isComplete(tab.id);
          
          return (
            <Link
              key={tab.id}
              href={tab.isEnabled() ? tab.path : '#'}
              className={`
                group inline-flex items-center py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap
                ${isCurrent 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                ${!tab.isEnabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${complete && !isCurrent ? 'text-green-600' : ''}
              `}
              onClick={(e) => {
                if (!tab.isEnabled()) {
                  e.preventDefault();
                }
              }}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <span className="mr-2">{tab.label}</span>
              
              {complete && (
                <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}