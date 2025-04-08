'use client';

import { useEffect } from 'react';
import { useChatState } from '../../../stores/chatStore';

interface BusinessHoursDisplayProps {
  onOutsideHours?: () => void;
}

export const BusinessHoursDisplay: React.FC<BusinessHoursDisplayProps> = ({
  onOutsideHours,
}) => {
  const { businessHours } = useChatState();

  useEffect(() => {
    if (
      businessHours &&
      !businessHours.isCurrentlyOpen &&
      !businessHours.isOpen24x7
    ) {
      onOutsideHours?.();
    }
  }, [businessHours, onOutsideHours]);

  if (!businessHours) return null;

  if (businessHours.isOpen24x7) {
    return (
      <div className="business-hours text-sm text-gray-600">Available 24/7</div>
    );
  }

  const currentDay = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
  });
  const todayHours = businessHours.days.find((day) => day.day === currentDay);

  if (!todayHours) {
    return (
      <div className="business-hours text-sm text-gray-600">
        Hours not available
      </div>
    );
  }

  return (
    <div className="business-hours text-sm">
      {businessHours.isCurrentlyOpen ? (
        <span className="text-green-600">
          Open now - Closes at {todayHours.closeTime}
        </span>
      ) : (
        <span className="text-red-600">
          Closed - Opens {todayHours.openTime} {businessHours.timezone}
        </span>
      )}
    </div>
  );
};
