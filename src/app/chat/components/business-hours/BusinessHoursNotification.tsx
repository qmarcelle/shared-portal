import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import React, { useEffect, useState } from 'react';
import { BusinessHours } from '../../models/types';
import { BusinessHoursService } from '../../services/BusinessHoursService';

interface BusinessHoursNotificationProps {
  onClose: () => void;
  businessHours: BusinessHours;
}

export const BusinessHoursNotification: React.FC<
  BusinessHoursNotificationProps
> = ({ onClose, businessHours }) => {
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBusinessHours = async () => {
      try {
        const service = BusinessHoursService.getInstance();
        const message = await service.getAvailabilityMessage();
        setAvailabilityMessage(message);
      } catch (error) {
        console.error('Failed to load business hours:', error);
        setAvailabilityMessage(
          'Unable to load business hours. Please try again later.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessHours();
  }, []);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card className="business-hours-notification">
        <div className="business-hours-content">
          <p>Loading business hours...</p>
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
                </>
              )}
            </>
          )}
        </div>
      </>
    </Card>
  );
};
