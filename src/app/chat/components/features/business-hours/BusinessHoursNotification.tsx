'use client';

import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import React from 'react';
import { useBusinessHours } from '../../../hooks/useBusinessHours';
import { BusinessHours } from '../../../types/types';
import { LoadingSpinner } from '../../shared/LoadingStates';

interface BusinessHoursNotificationProps {
  onClose: () => void;
  businessHours: BusinessHours;
}

export const BusinessHoursNotification: React.FC<
  BusinessHoursNotificationProps
> = ({ onClose, businessHours }) => {
  const {
    isWithinHours,
    nextOpeningTime,
    availabilityMessage,
    isLoading,
    error,
    formatTime,
  } = useBusinessHours(businessHours);

  if (isLoading) {
    return (
      <Card className="business-hours-notification">
        <div className="business-hours-content">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="business-hours-notification">
        <div className="business-hours-content">
          <p className="error-message">{error.message}</p>
          <Button type="ghost" callback={onClose} label="Close" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="business-hours-notification">
      <>
        <div className="business-hours-header">
          <h3>Business Hours</h3>
          <Button type="ghost" callback={onClose} label="Close" />
        </div>

        <div className="business-hours-content">
          <p className="availability-message">{availabilityMessage}</p>

          {businessHours && (
            <>
              {businessHours.isOpen24x7 ? (
                <p>We are available 24/7 for your convenience.</p>
              ) : (
                <>
                  <p>Our current business hours are:</p>
                  <ul>
                    {businessHours.days.map((day) => (
                      <li key={day.day}>
                        {day.day}: {formatTime(day.openTime)} -{' '}
                        {formatTime(day.closeTime)}
                        {day.isHoliday && ` (${day.holidayName})`}
                      </li>
                    ))}
                  </ul>
                  {!isWithinHours && nextOpeningTime && (
                    <p className="next-opening">
                      Next available at: {formatTime(nextOpeningTime)}
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </>
    </Card>
  );
};
