/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { DeterminationFormData } from '../types/DeterminationFormTypes';

interface DeterminationFormState {
  currentStep: number;
  formData: DeterminationFormData;
  setFormData: (
    section: keyof DeterminationFormData,
    data: Record<string, any>,
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const DeterminationFormStore = create<DeterminationFormState>((set) => ({
  currentStep: 0,
  formData: {
    enrolleeInfo: {},
    prescriberInfo: {},
    drugInfo: {},
    requestType: {},
    additionalInfo: {},
  },
  setFormData: (section, data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [section]: { ...state.formData[section], ...data },
      },
    })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
}));
