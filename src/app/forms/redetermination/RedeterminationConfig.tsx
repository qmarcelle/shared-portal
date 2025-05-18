import AdditionalInfoStep from './components/AdditionalInfoStep';
import DrugInfoStep from './components/DrugInfoStep';
import EnrolleeInfoStep from './components/EnrolleeInfoStep';
import FormSubmittedStep from './components/FormSubmittedStep';
import PrescriberInfoStep from './components/PrescriberInfoStep';
import { AdditionalInfoSchema } from './validators/AdditionalInfoSchema';
import { DrugInfoSchema } from './validators/DrugInfoSchema';
import { EnrolleeInfoSchema } from './validators/EnrolleeInfoSchema';
import { PrescriberInfoSchema } from './validators/PrescriberInfoSchema';

export const RedeterminationConfig = [
  {
    component: EnrolleeInfoStep,
    storeKey: 'enrolleeInfo',
    nextStep: 1,
    prevStep: null,
    validator: EnrolleeInfoSchema,
  },
  {
    component: DrugInfoStep,
    storeKey: 'drugInfo',
    nextStep: 2,
    prevStep: 0,
    validator: DrugInfoSchema,
  },
  {
    component: PrescriberInfoStep,
    storeKey: 'prescriberInfo',
    nextStep: 3,
    prevStep: 2,
    validator: PrescriberInfoSchema,
  },
  {
    component: AdditionalInfoStep,
    storeKey: 'additionalInfo',
    nextStep: 99,
    prevStep: 3,
    validator: AdditionalInfoSchema,
  },
  {
    component: FormSubmittedStep,
    storeKey: 'formSubmit',
    nextStep: null,
    prevStep: null,
    validator: null,
  },
];
