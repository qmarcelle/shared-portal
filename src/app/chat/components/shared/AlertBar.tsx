/**
 * Mock AlertBar component
 * This is a temporary implementation until the real AlertBar is available
 */

import React from 'react';

interface AlertBarProps {
  alerts: string[];
}

export const AlertBar: React.FC<AlertBarProps> = ({ alerts }) => {
  return (
    <div className="alert-bar">
      {alerts.map((alert, index) => (
        <div key={index} className="alert-message">
          {alert}
        </div>
      ))}
    </div>
  );
};
