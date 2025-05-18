/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { RedeterminationFormData } from '../types/RedeterminationFormTypes';

interface RedeterminationFormState {
  currentStep: number;
  formData: RedeterminationFormData;
  setFormData: (
    section: keyof RedeterminationFormData,
    data: Record<string, any>,
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const RedeterminationFormStore = create<RedeterminationFormState>(
  (set) => ({
    currentStep: 0,
    formData: {
      enrolleeInfo: {},
      prescriberInfo: {},
      drugInfo: {},
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
  }),
);
