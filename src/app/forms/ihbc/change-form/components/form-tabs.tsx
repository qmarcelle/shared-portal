'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { AppLink } from '@/components/foundation/AppLink';
import { ProgressBar } from '@/components/foundation/ProgressBar';
import { Row } from '@/components/foundation/Row';
import { Section } from '@/components/foundation/Section';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { isSectionComplete, useFormStore } from '../stores/stores';

export type Tab = {
  id: string;
  path: string;
  label: string;
  isEnabled: () => boolean;
  section: keyof typeof CompletionStatusMap;
  validate?: () => boolean;
};

// Define a type map for completion status to ensure type safety
const CompletionStatusMap = {
  selectChanges: true,
  personalInfo: true,
  dependents: true,
  benefits: true,
  specialEnrollment: true,
  terminatePolicy: true,
} as const;

// Local implementation of useFormCompletion to replace the imported one
function useFormCompletion() {
  const { selections } = useFormStore();

  const completionStatus = useMemo(() => {
    return {
      selectChanges: isSectionComplete('selections'),
      personalInfo: isSectionComplete('personal-info'),
      dependents: isSectionComplete('dependents'),
      benefits: isSectionComplete('benefits'),
      specialEnrollment: isSectionComplete('special-enrollment'),
      terminatePolicy: isSectionComplete('terminate-policy'),
    };
  }, [selections]);

  return completionStatus;
}

interface FormTabsProps {
  tabs: Tab[];
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
}

export function FormTabs({
  tabs,
  activeTabIndex,
  setActiveTabIndex,
}: FormTabsProps) {
  const router = useRouter();
  const completionStatus = useFormCompletion();

  // Get enabled tabs only
  const enabledTabs = tabs.filter((tab) => tab.isEnabled());

  // Calculate progress for ProgressBar
  const completedSteps = Object.values(completionStatus).filter(Boolean).length;
  const totalSteps = Object.keys(completionStatus).length;
  const completePercent = (completedSteps / totalSteps) * 100;

  return (
    <Section>
      <ProgressBar height={4} completePercent={completePercent} />

      <Row className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {enabledTabs.map((tab, index) => {
            const isComplete = completionStatus[tab.section];
            const isActive = index === activeTabIndex;

            return (
              <AppLink
                key={tab.id}
                url={tab.path}
                label={tab.label}
                type="button"
                callback={() => {
                  setActiveTabIndex(index);
                  router.push(tab.path);
                }}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}
                  ${!isActive && isComplete ? 'border-green-500 text-green-600' : ''}
                `}
                icon={
                  isComplete && !isActive ? (
                    <CheckCircleIcon
                      className="mr-2 h-5 w-5 text-green-500"
                      aria-hidden="true"
                    />
                  ) : null
                }
              />
            );
          })}
        </nav>
      </Row>

      {/* Show validation errors if any */}
      {enabledTabs[activeTabIndex]?.validate?.() === false && (
        <AlertBar
          alerts={['Please complete all required fields in this section']}
        />
      )}
    </Section>
  );
}
