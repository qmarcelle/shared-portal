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
import { FormConfig } from './FormConfig';
import { useFormStore } from './stores/FormStore';

const FormTemplate = () => {
  const { currentStep, formData, setFormData, nextStep, prevStep } =
    useFormStore();
  const router = useRouter();
  const stepRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: FormConfig[currentStep].validator
      ? zodResolver(FormConfig[currentStep].validator as ZodType<any, any, any>)
      : undefined,
    defaultValues:
      formData[FormConfig[currentStep].storeKey as keyof typeof formData],
  });

  const onSubmit = (data: any) => {
    const currentKey = FormConfig[currentStep]
      .storeKey as keyof typeof formData;
    setFormData(currentKey, data);
    if (currentStep < FormConfig.length - 1) {
      nextStep();
      setTimeout(() => {
        stepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } else {
      console.log('Form submitted:', formData);
    }
  };

  const CurrentStepComponent = FormConfig[currentStep].component;

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <TextBox text="Form Template Title" type="title-1" />
      </Column>
      <Column className="app-content app-base-font-color formBoundary">
        <div ref={stepRef} style={{ padding: '32px 64px' }}>
          <TextBox text="Form Template Subtitle" type="title-2" />
          <Spacer size={16} />
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
              {FormConfig[currentStep].prevStep !== null && (
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
              {FormConfig[currentStep].prevStep !== null &&
                FormConfig[currentStep].nextStep !== null && (
                  <Spacer axis="horizontal" size={128} />
                )}
              {FormConfig[currentStep].nextStep !== null && (
                <Button
                  style="submit"
                  callback={handleSubmit(onSubmit)}
                  label={
                    FormConfig[currentStep].nextStep !== 99 ? 'Next' : 'Submit'
                  }
                />
              )}
              {FormConfig[currentStep].nextStep === null && (
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

export default FormTemplate;
