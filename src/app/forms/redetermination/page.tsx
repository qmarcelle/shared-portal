/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType } from 'zod';
import { RedeterminationConfig } from './RedeterminationConfig';
import RedeterminationFormInfo from './RedeterminationInfo';
import { RedeterminationFormStore } from './stores/RedeterminationFormStore';

const RedeterminationForm = () => {
  const { currentStep, formData, setFormData, nextStep, prevStep } =
    RedeterminationFormStore();

  const router = useRouter();
  const stepRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: RedeterminationConfig[currentStep].validator
      ? zodResolver(
          RedeterminationConfig[currentStep].validator as ZodType<
            any,
            any,
            any
          >,
        )
      : undefined,
    defaultValues:
      formData[
        RedeterminationConfig[currentStep].storeKey as keyof typeof formData
      ],
  });

  console.log('Validator Errors:', errors); // Log the errors from the validator

  const onSubmit = (data: any) => {
    console.log('In page OnSubmit');
    console.log('Submitted Data:', data);
    console.log('Current Step Config:', RedeterminationConfig[currentStep]); // Log current step config
    const currentKey = RedeterminationConfig[currentStep]
      .storeKey as keyof typeof formData; // Explicitly type currentKey
    setFormData(currentKey, data); // Update the correct section of formData
    if (currentStep < RedeterminationConfig.length - 1) {
      nextStep();
      setTimeout(() => {
        stepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  const CurrentStepComponent = RedeterminationConfig[currentStep].component;

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <TextBox
          text="Request for Redetermination of Medicare Prescription Drug Denial"
          type="title-1"
        />
      </Column>
      <Column className="app-content app-base-font-color formBoundary">
        <div style={{ padding: '32px 64px' }}>
          {RedeterminationConfig[currentStep].nextStep !== null && (
            <RedeterminationFormInfo />
          )}
          <div ref={stepRef}>
            <Spacer size={32} />
            <form>
              <div>
                <CurrentStepComponent
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
              </div>
              <Spacer size={32} />
              <Row>
                {RedeterminationConfig[currentStep].prevStep !== null && (
                  <Button
                    callback={() => {
                      prevStep();
                      setTimeout(() => {
                        stepRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }, 0);
                    }}
                    label="Back"
                  />
                )}
                {RedeterminationConfig[currentStep].prevStep !== null &&
                  RedeterminationConfig[currentStep].nextStep !== null && (
                    <Spacer axis="horizontal" size={128} />
                  )}
                {RedeterminationConfig[currentStep].nextStep !== null && (
                  <Button
                    style="submit"
                    callback={handleSubmit(onSubmit)}
                    label={
                      RedeterminationConfig[currentStep].nextStep !== 99
                        ? 'Next'
                        : 'Submit'
                    }
                  />
                )}
                {RedeterminationConfig[currentStep].nextStep === null && (
                  <Button
                    callback={() => router.push('/dashboard')}
                    label="Return to Dashboard"
                  />
                )}
              </Row>
            </form>
          </div>
        </div>
      </Column>
    </main>
  );
};

export default RedeterminationForm;
