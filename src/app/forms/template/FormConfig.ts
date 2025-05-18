import { ZodSchema } from 'zod';
import StepComponent from './components/StepComponent';

export const FormConfig = [
  {
    storeKey: 'step1',
    component: StepComponent,
    validator: null as ZodSchema | null,
    prevStep: null,
    nextStep: 1,
  },
  {
    storeKey: 'step2',
    component: StepComponent,
    validator: null as ZodSchema | null,
    prevStep: 0,
    nextStep: null,
  },
];
