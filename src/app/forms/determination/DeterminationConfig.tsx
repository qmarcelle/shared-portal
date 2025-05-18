import AdditionalInfoStep from './components/AdditionalInfoStep';
import DrugInfoStep from './components/DrugInfoStep';
import EnrolleeInfoStep from './components/EnrolleeInfoStep';
import FormSubmittedStep from './components/FormSubmittedStep';
import PrescriberInfoStep from './components/PrescriberInfoStep';
import RequestTypeStep from './components/RequestTypeStep';
import { AdditionalInfoSchema } from './validators/AdditionalInfoSchema';
import { DrugInfoSchema } from './validators/DrugInfoSchema';
import { EnrolleeInfoSchema } from './validators/EnrolleeInfoSchema';
import { PrescriberInfoSchema } from './validators/PrescriberInfoSchema';
import { RequestTypeSchema } from './validators/RequestTypeSchema';

export const DeterminationConfig = [
  {
    component: EnrolleeInfoStep,
    storeKey: 'enrolleeInfo',
    nextStep: 1,
    prevStep: null,
    validator: EnrolleeInfoSchema,
  },
  {
    component: PrescriberInfoStep,
    storeKey: 'prescriberInfo',
    nextStep: 2,
    prevStep: 0,
    validator: PrescriberInfoSchema,
  },
  {
    component: DrugInfoStep,
    storeKey: 'drugInfo',
    nextStep: 3,
    prevStep: 1,
    validator: DrugInfoSchema,
  },
  {
    component: RequestTypeStep,
    storeKey: 'requestType',
    nextStep: 4,
    prevStep: 2,
    validator: RequestTypeSchema,
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
