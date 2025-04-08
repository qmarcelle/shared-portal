'use client';

import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import React from 'react';
import { useEligibility } from '../../../hooks/useEligibility';
import { UserEligibility } from '../../../types/types';

interface EligibilityCheckProps {
  eligibility: UserEligibility;
  onClose: () => void;
}

export const EligibilityCheck: React.FC<EligibilityCheckProps> = ({
  eligibility,
  onClose,
}) => {
  const { status, coverageDetails, chatHours } = useEligibility(eligibility);

  return (
    <Card className="eligibility-check">
      <>
        <div className="eligibility-header">
          <h3>Eligibility Status</h3>
          <Button type="ghost" callback={onClose} label="Close" />
        </div>

        <div className="eligibility-content">
          <div className={`status-indicator ${status.status}`}>
            <p>{status.message}</p>
          </div>

          <div className="coverage-details">
            <h4>Coverage Details</h4>
            <ul>
              <li>
                <strong>Medical:</strong>{' '}
                {coverageDetails.medical ? 'Covered' : 'Not Covered'}
              </li>
              <li>
                <strong>Dental:</strong>{' '}
                {coverageDetails.dental ? 'Covered' : 'Not Covered'}
              </li>
              <li>
                <strong>Vision:</strong>{' '}
                {coverageDetails.vision ? 'Covered' : 'Not Covered'}
              </li>
              {coverageDetails.wellnessOnly && (
                <li>
                  <strong>Wellness Only:</strong> Yes
                </li>
              )}
              {coverageDetails.cobraEligible && (
                <li>
                  <strong>COBRA Eligible:</strong> Yes
                </li>
              )}
            </ul>
          </div>

          {chatHours && (
            <div className="chat-hours">
              <h4>Chat Hours</h4>
              <p>{chatHours}</p>
            </div>
          )}
        </div>
      </>
    </Card>
  );
};
