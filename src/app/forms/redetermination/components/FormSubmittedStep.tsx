'use client';
import { Button } from '@/components/foundation/Button';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { submitRedetermination } from '../actions/submitRedetermination';
import { RedeterminationFormStore } from '../stores/RedeterminationFormStore';

const FormSubmittedStep = () => {
  const [status, setStatus] = useState<'submitting' | 'submitted' | 'error'>(
    'submitting',
  );
  const formData = useStore(
    RedeterminationFormStore,
    (state) => state.formData,
  );

  const submitForm = useCallback(async () => {
    try {
      setStatus('submitting');
      await submitRedetermination(formData);
      setStatus('submitted');
    } catch (error) {
      setStatus('error');
    }
  }, [formData]);

  const handleRetry = () => {
    submitForm();
  };

  // Trigger form submission on component mount
  useEffect(() => {
    submitForm();
  }, [submitForm]);

  return (
    <>
      {status === 'submitting' && <h1>Submitting Form...</h1>}
      {status === 'submitted' && <h1>Form Submitted Successfully!</h1>}
      {status === 'error' && (
        <>
          <h1>Error Submitting Form</h1>
          <Button label="Try Again" type="primary" callback={handleRetry} />
        </>
      )}
    </>
  );
};

export default FormSubmittedStep;
