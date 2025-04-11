// components/insurance-form/welcome-message.tsx
'use client';

import { useSubscriberData } from '@/lib/insurance/hooks';
import { useMetaStore } from '@/lib/insurance/stores';

export function WelcomeMessage() {
  const { meta } = useMetaStore();
  const { data: subscriber } = useSubscriberData();
  
  if (!subscriber) {
    return null;
  }
  
  const subscriberName = `${subscriber.firstName} ${subscriber.lastName}`;
  
  return (
    <div className="bg-white p-6 mb-6 rounded-md shadow-sm">
      <h2 className="text-xl font-bold mb-4">Welcome, {subscriberName}</h2>
      
      {meta.groupNumber === '129800' ? (
        <div>
          <p className="mb-2">
            You can make benefit changes, update personal information such as name, 
            address, phone number, or e-mail address. You can also add or remove 
            dependents or terminate benefits.
          </p>
          <p className="mb-2">
            Plan changes related to qualifying events will be effective based on the 
            event date. Termination and/or cancellation requests will be effective 
            on the requested effective date.
          </p>
          <p>
            If you have questions, please contact 1-800-845-2738.
          </p>
        </div>
      ) : (
        <div>
          <p className="mb-2">
            You can make benefit changes, update personal information such as name, 
            address, phone number, or e-mail address. You can also add or remove 
            dependents or terminate benefits.
          </p>
          <p>
            Plan changes will be effective on the 1st day of the following month in 
            which the application is submitted. Termination and/or Cancellation 
            requests will be effective on the requested effective date.
          </p>
        </div>
      )}
    </div>
  );
}