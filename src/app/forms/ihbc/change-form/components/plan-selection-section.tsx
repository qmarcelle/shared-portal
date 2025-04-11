'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { alertBlueIcon } from '@/components/foundation/Icons';
import { Radio } from '@/components/foundation/Radio';
import { Row } from '@/components/foundation/Row';
import { Section } from '@/components/foundation/Section';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormStore } from '../stores/stores';

/**
 * PlanOption interface for health insurance plan options
 */
interface PlanOption {
  id: string;
  name: string;
  type: string;
  premium: number;
  deductible: number;
  outOfPocketMax: number;
  coverage: {
    medical: string;
    prescription: string;
    dental: string;
    vision: string;
  };
}

/**
 * PlanSelectionData interface for tracking the selected plan
 */
interface PlanSelectionData {
  selectedPlanId: string;
  coverageLevel: 'individual' | 'family';
}

/**
 * PlanSelectionSection Component
 *
 * Allows users to select health insurance plans with different coverage options.
 *
 * TODO: [CRITICAL] Implement API integration to fetch actual plan options from backend
 * TODO: [CRITICAL] Implement group-specific plan filters and options
 * TODO: [HIGH] Add premium calculation based on dependent count and tobacco use
 * TODO: [HIGH] Implement plan comparison feature to compare up to 3 plans side-by-side
 * TODO: [MEDIUM] Add plan details modal with complete coverage information
 * TODO: [MEDIUM] Implement network provider search integration
 * TODO: [LOW] Add "Save for Later" functionality to bookmark plans of interest
 */
export function PlanSelectionSection() {
  const { watch, setValue } = useFormContext();
  const { benefits, meta, updateBenefits } = useFormStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Watch for plan selection changes
  const selectedPlanId = watch('planSelection.selectedPlanId');
  const coverageLevel = watch('planSelection.coverageLevel');

  // Example plan options - in real implementation, these would come from an API or store
  const planOptions: PlanOption[] = [
    {
      id: 'plan1',
      name: 'Essential Care PPO',
      type: 'PPO',
      premium: 350,
      deductible: 2500,
      outOfPocketMax: 6000,
      coverage: {
        medical: '80% after deductible',
        prescription: '$10/$30/$50 copays',
        dental: 'Included',
        vision: 'Included',
      },
    },
    {
      id: 'plan2',
      name: 'Premium Care PPO',
      type: 'PPO',
      premium: 450,
      deductible: 1500,
      outOfPocketMax: 4000,
      coverage: {
        medical: '90% after deductible',
        prescription: '$5/$25/$40 copays',
        dental: 'Enhanced Coverage',
        vision: 'Enhanced Coverage',
      },
    },
  ];

  /**
   * TODO: [HIGH] Implement the following business rules:
   * 1. Plan availability filtering based on subscriber zip code and group number
   * 2. Metal tier filtering option (Bronze, Silver, Gold, Platinum)
   * 3. Special logic for grandfathered plans and limited enrollment periods
   * 4. Different premium calculations based on group rules
   */

  // Validate plan selection
  useEffect(() => {
    const errors: string[] = [];
    if (!selectedPlanId) {
      errors.push('Please select a plan to continue');
    }
    if (!coverageLevel) {
      errors.push('Please select a coverage level');
    }
    setValidationErrors(errors);
  }, [selectedPlanId, coverageLevel]);

  // Toggle plan details
  const togglePlanDetails = (planId: string) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  return (
    <Section>
      <div className="w-full">
        <Title text="Plan Selection" />

        <Card type="elevated" className="mb-4">
          <Row>
            <Image src={alertBlueIcon} alt="info" className="size-6 mr-2" />
            <TextBox text="Please review the available plans and select the one that best meets your needs. Consider the monthly premium, deductible, and coverage details when making your selection." />
          </Row>
        </Card>

        {validationErrors.length > 0 && <AlertBar alerts={validationErrors} />}

        <div className="space-y-4">
          {/* Coverage Level Selection */}
          <div className="mb-6">
            <Title text="Select Coverage Level" />
            <Row>
              <Radio
                selected={coverageLevel === 'individual'}
                label="Individual Coverage"
                value="individual"
                callback={(value) =>
                  setValue('planSelection.coverageLevel', value)
                }
              />
              <Radio
                selected={coverageLevel === 'family'}
                label="Family Coverage"
                value="family"
                callback={(value) =>
                  setValue('planSelection.coverageLevel', value)
                }
              />
            </Row>
          </div>

          {/* Plan Options */}
          <div className="space-y-4">
            {planOptions.map((plan) => (
              <Card
                key={plan.id}
                type="elevated"
                className={`cursor-pointer transition-all ${
                  selectedPlanId === plan.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => togglePlanDetails(plan.id)}
              >
                <div className="p-4">
                  <Row className="justify-between items-center">
                    <Column>
                      <Radio
                        selected={selectedPlanId === plan.id}
                        label={plan.name}
                        value={plan.id}
                        callback={(value) =>
                          setValue('planSelection.selectedPlanId', value)
                        }
                      />
                      <TextBox text={`${plan.type} - $${plan.premium}/month`} />
                    </Column>
                  </Row>

                  {/* Expanded Plan Details */}
                  {expandedPlanId === plan.id && (
                    <div className="mt-4 border-t pt-4">
                      <Row className="space-x-8">
                        <Column>
                          <Title text="Plan Details" />
                          <div className="space-y-2">
                            <TextBox text={`Deductible: $${plan.deductible}`} />
                            <TextBox
                              text={`Out of Pocket Maximum: $${plan.outOfPocketMax}`}
                            />
                          </div>
                        </Column>
                        <Column>
                          <Title text="Coverage" />
                          <div className="space-y-2">
                            <TextBox
                              text={`Medical: ${plan.coverage.medical}`}
                            />
                            <TextBox
                              text={`Prescription: ${plan.coverage.prescription}`}
                            />
                            <TextBox text={`Dental: ${plan.coverage.dental}`} />
                            <TextBox text={`Vision: ${plan.coverage.vision}`} />
                          </div>
                        </Column>
                      </Row>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* TODO: [HIGH] Implement dental plan selection section */}
          {/* TODO: [HIGH] Implement vision plan selection section */}
          {/* TODO: [MEDIUM] Add voluntary benefits section (life, disability, etc.) */}
          {/* TODO: [MEDIUM] Implement warning for plan changes outside of enrollment period */}
        </div>
      </div>
    </Section>
  );
}
