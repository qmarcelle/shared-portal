// src/app/forms/ihbc/change-form/components/welcome-message.tsx
'use client';

import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { TextBox } from '@/components/foundation/TextBox';
import { useSubscriberData } from '../hooks/hooks';
import { useFormStore } from '../stores/stores';

export function WelcomeMessage() {
  const { meta } = useFormStore();
  const { data: subscriber } = useSubscriberData();

  if (!subscriber) {
    return null;
  }

  // Create welcome message body based on group number
  const welcomeBody = (
    <>
      <TextBox
        className="text-white mb-2"
        text="You can make benefit changes, update personal information such as name, address, phone number, or e-mail address. You can also add or remove dependents or terminate benefits."
      />
      {meta.groupNumber === '129800' ? (
        <>
          <TextBox
            className="text-white mb-2"
            text="Plan changes related to qualifying events will be effective based on the event date. Termination and/or cancellation requests will be effective on the requested effective date."
          />
          <TextBox
            className="text-white"
            text="If you have questions, please contact 1-800-845-2738."
          />
        </>
      ) : (
        <TextBox
          className="text-white"
          text="Plan changes will be effective on the 1st day of the following month in which the application is submitted. Termination and/or Cancellation requests will be effective on the requested effective date."
        />
      )}
    </>
  );

  return (
    <WelcomeBanner
      name={`${subscriber.firstName} ${subscriber.lastName}`}
      titleText="Welcome,"
      body={welcomeBody}
      className="mb-6 rounded-md"
    />
  );
}
