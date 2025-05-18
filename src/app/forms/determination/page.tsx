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
import CoverageDeterminationInfo from './CoverageDeterminationInfo';
import { DeterminationConfig } from './DeterminationConfig';
import { DeterminationFormStore } from './stores/DeterminationFormStore';

const DeterminationForm = () => {
  const { currentStep, formData, setFormData, nextStep, prevStep } =
    DeterminationFormStore();

  const router = useRouter();
  const stepRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: DeterminationConfig[currentStep].validator
      ? zodResolver(
          DeterminationConfig[currentStep].validator as ZodType<any, any, any>,
        )
      : undefined,
    defaultValues:
      formData[
        DeterminationConfig[currentStep].storeKey as keyof typeof formData
      ],
  });

  console.log('Validator Errors:', errors); // Log the errors from the validator

  const onSubmit = (data: any) => {
    console.log('In page OnSubmit');
    console.log('Submitted Data:', data);
    console.log('Current Step Config:', DeterminationConfig[currentStep]); // Log current step config
    const currentKey = DeterminationConfig[currentStep]
      .storeKey as keyof typeof formData; // Explicitly type currentKey
    setFormData(currentKey, data); // Update the correct section of formData
    if (currentStep < DeterminationConfig.length - 1) {
      nextStep();
      setTimeout(() => {
        stepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } else {
      console.log('Form submitted:', formData);
    }
  };

  const CurrentStepComponent = DeterminationConfig[currentStep].component;

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <TextBox
          text="Request for Medicare Prescription Drug Coverage Determination"
          type="title-1"
          className="font-bold"
        />
      </Column>
      <Column className="app-content app-base-font-color formBoundary">
        <div ref={stepRef} style={{ padding: '32px 64px' }}>
          {DeterminationConfig[currentStep].nextStep !== null && (
            <CoverageDeterminationInfo />
          )}
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
              {DeterminationConfig[currentStep].prevStep !== null && (
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
              {DeterminationConfig[currentStep].prevStep !== null &&
                DeterminationConfig[currentStep].nextStep !== null && (
                  <Spacer axis="horizontal" size={128} />
                )}
              {DeterminationConfig[currentStep].nextStep !== null && (
                <Button
                  style="submit"
                  callback={handleSubmit(onSubmit)}
                  label={
                    DeterminationConfig[currentStep].nextStep !== 99
                      ? 'Next'
                      : 'Submit'
                  }
                />
              )}
              {DeterminationConfig[currentStep].nextStep === null && (
                <Button
                  callback={() => router.push('/dashboard')}
                  label="Return to Dashboard"
                />
              )}
            </Row>
          </form>
        </div>
      </Column>
    </main>
  );
};

export default DeterminationForm;
