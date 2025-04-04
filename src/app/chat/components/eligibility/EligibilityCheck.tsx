import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import React from 'react';
import { UserEligibility } from '../../models/types';

interface EligibilityCheckProps {
  eligibility: UserEligibility;
  onClose: () => void;
}

export const EligibilityCheck: React.FC<EligibilityCheckProps> = ({
  eligibility,
  onClose,
}) => {
  const getEligibilityStatus = () => {
    if (!eligibility.isChatEligibleMember) {
      return {
        status: 'not-eligible',
        message:
          'You are not eligible for chat services with your current plan.',
      };
    }

    if (eligibility.isDemoMember) {
      return {
        status: 'demo',
        message: 'You are using a demo account. Some features may be limited.',
      };
    }

    return {
      status: 'eligible',
      message: 'You are eligible for chat services.',
    };
  };

  const status = getEligibilityStatus();

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
                {eligibility.isMedical ? 'Covered' : 'Not Covered'}
              </li>
              <li>
                <strong>Dental:</strong>{' '}
                {eligibility.isDental ? 'Covered' : 'Not Covered'}
              </li>
              <li>
                <strong>Vision:</strong>{' '}
                {eligibility.isVision ? 'Covered' : 'Not Covered'}
              </li>
              {eligibility.isWellnessOnly && (
                <li>
                  <strong>Wellness Only:</strong> Yes
                </li>
              )}
              {eligibility.isCobraEligible && (
                <li>
                  <strong>COBRA Eligible:</strong> Yes
                </li>
              )}
            </ul>
          </div>

          {eligibility.chatHours && (
            <div className="chat-hours">
              <h4>Chat Hours</h4>
              <p>{eligibility.chatHours}</p>
            </div>
          )}
        </div>
      </>
    </Card>
  );
};
