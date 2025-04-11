'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Benefits,
  FormData,
  Meta,
  PersonalInfo,
  Selections,
  SpecialEnrollment,
  TerminatePolicy,
} from '../../lib/schemas';

/**
 * IHBC Form Store
 *
 * Central store for managing the IHBC change form state and data flow.
 * Uses Zustand for state management with persistence middleware for saving draft progress.
 *
 * TODO: [CRITICAL] Implement proper data sanitization before persistence (for PII/PHI)
 * TODO: [CRITICAL] Add encryption for sensitive data stored in browser
 * TODO: [HIGH] Implement proper data versioning to handle form structure changes
 * TODO: [HIGH] Add automatic conflict resolution for concurrent edits
 * TODO: [MEDIUM] Implement analytics tracking for form progression
 */

// Generate a unique application ID
const generateApplicationId = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().substring(2); // 2-digit year
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  ); // Julian date
  const dayStr = dayOfYear.toString().padStart(3, '0');
  const counter = Math.floor(10000 + Math.random() * 90000); // 5-digit counter
  return `${year}${dayStr}-${counter}`;
};

/**
 * TODO: [HIGH] Implement more secure ID generation that:
 * 1. Avoids collisions even with high concurrent users
 * 2. Is not sequentially predictable for security
 * 3. Includes group-specific prefixing based on business rules
 */

// Store state interface
interface StoreState {
  // Form data
  meta: Meta;
  selections: Selections;
  personalInfo: PersonalInfo | null;
  dependents: {
    add: {
      addSpouse: boolean;
      spouse?: any;
      addDependents: boolean;
      dependents: any[];
    } | null;
    remove: {
      removeSpouse: boolean;
      spouse?: any;
      removeDependents: boolean;
      dependents: any[];
    } | null;
  } | null;
  benefits: Benefits | null;
  specialEnrollment: SpecialEnrollment | null;
  terminatePolicy: TerminatePolicy | null;
  validationErrors: Record<string, string> | null;

  // Actions
  initializeApplication: (groupNumber: string, subscriberId: string) => void;
  updateMeta: (data: Partial<Meta>) => void;
  updateSelections: (data: Partial<Selections>) => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateDependents: (type: 'add' | 'remove', data: any) => void;
  addDependent: (dependent: any) => void;
  removeDependent: (id: string) => void;
  updateBenefits: (data: Partial<Benefits>) => void;
  updateSpecialEnrollment: (data: Partial<SpecialEnrollment>) => void;
  updateTerminatePolicy: (data: Partial<TerminatePolicy>) => void;
  updateLastSaved: () => void;
  setSubmitted: () => void;
  resetForm: () => void;

  // Utility methods
  getFormData: () => FormData;
  setValidationErrors: (errors: Record<string, string> | null) => void;
}

// Create store with persistence
export const useFormStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      meta: {
        applicationId: '',
        groupNumber: '',
        subscriberId: '',
        status: 'In Progress',
        lastSaved: new Date().toISOString(),
      },
      selections: {
        changePersonalInfo: false,
        addDependents: false,
        removeDependents: false,
        changeBenefits: false,
        terminatePolicy: false,
      },
      personalInfo: null,
      dependents: null,
      benefits: null,
      specialEnrollment: null,
      terminatePolicy: null,
      validationErrors: null,

      // Actions
      initializeApplication: (groupNumber, subscriberId) =>
        set({
          meta: {
            applicationId: generateApplicationId(),
            groupNumber,
            subscriberId,
            status: 'In Progress',
            lastSaved: new Date().toISOString(),
          },
        }),

      updateMeta: (data) =>
        set((state) => ({
          meta: { ...state.meta, ...data },
        })),

      updateSelections: (data) =>
        set((state) => {
          const newSelections = { ...state.selections, ...data };

          // Handle exclusivity rules
          if (newSelections.terminatePolicy) {
            newSelections.addDependents = false;
            newSelections.removeDependents = false;
            newSelections.changeBenefits = false;
          }

          if (
            newSelections.addDependents ||
            newSelections.removeDependents ||
            newSelections.changeBenefits
          ) {
            newSelections.terminatePolicy = false;
          }

          return { selections: newSelections };
        }),

      /**
       * TODO: [HIGH] Implement the following selection rule enhancements:
       * 1. Group-specific selection options and constraints
       * 2. Automatic selection of required sections based on qualifying events
       * 3. Special enrollment period validation and tracking
       * 4. Selection restriction based on subscriber status and previous changes
       */

      updatePersonalInfo: (data) =>
        set((state) => ({
          personalInfo: state.personalInfo
            ? { ...state.personalInfo, ...data }
            : (data as PersonalInfo),
        })),

      updateDependents: (type, data) =>
        set((state) => {
          const dependents = state.dependents || { add: null, remove: null };

          if (type === 'add') {
            return {
              dependents: {
                ...dependents,
                add: dependents.add ? { ...dependents.add, ...data } : data,
              },
            };
          } else {
            return {
              dependents: {
                ...dependents,
                remove: dependents.remove
                  ? { ...dependents.remove, ...data }
                  : data,
              },
            };
          }
        }),

      addDependent: (dependent) =>
        set((state) => {
          const dependents = state.dependents || {
            add: { addSpouse: false, addDependents: true, dependents: [] },
            remove: null,
          };
          const add = dependents.add || {
            addSpouse: false,
            addDependents: true,
            dependents: [],
          };

          // Generate ID if not provided
          const newDependent = {
            ...dependent,
            id: dependent.id || `dep-${Date.now()}`,
          };

          return {
            dependents: {
              ...dependents,
              add: {
                ...add,
                addDependents: true,
                dependents: [...add.dependents, newDependent],
              },
            },
          };
        }),

      removeDependent: (id) =>
        set((state) => {
          if (!state.dependents?.add?.dependents)
            return { dependents: state.dependents };

          const updatedDependents = state.dependents.add.dependents.filter(
            (dep) => dep.id !== id,
          );

          return {
            dependents: {
              ...state.dependents,
              add: {
                ...state.dependents.add,
                dependents: updatedDependents,
              },
            },
          };
        }),

      /**
       * TODO: [HIGH] Implement the following dependent management enhancements:
       * 1. Support for dependent eligibility verification workflow
       * 2. Special handling for dependents with active claims
       * 3. Integration with premium calculation based on dependent count
       * 4. Proper validation for adding/removing dependents mid-benefit period
       */

      updateBenefits: (data) =>
        set((state) => ({
          benefits: state.benefits
            ? { ...state.benefits, ...data }
            : (data as Benefits),
        })),

      updateSpecialEnrollment: (data) =>
        set((state) => ({
          specialEnrollment: state.specialEnrollment
            ? { ...state.specialEnrollment, ...data }
            : (data as SpecialEnrollment),
        })),

      updateTerminatePolicy: (data) =>
        set((state) => ({
          terminatePolicy: state.terminatePolicy
            ? { ...state.terminatePolicy, ...data }
            : (data as TerminatePolicy),
        })),

      updateLastSaved: () =>
        set((state) => ({
          meta: { ...state.meta, lastSaved: new Date().toISOString() },
        })),

      setSubmitted: () =>
        set((state) => ({
          meta: {
            ...state.meta,
            status: 'Submitted',
            submittedDate: new Date().toISOString(),
            lastSaved: new Date().toISOString(),
          },
        })),

      resetForm: () =>
        set({
          meta: {
            applicationId: '',
            groupNumber: '',
            subscriberId: '',
            status: 'In Progress',
            lastSaved: new Date().toISOString(),
          },
          selections: {
            changePersonalInfo: false,
            addDependents: false,
            removeDependents: false,
            changeBenefits: false,
            terminatePolicy: false,
          },
          personalInfo: null,
          dependents: null,
          benefits: null,
          specialEnrollment: null,
          terminatePolicy: null,
          validationErrors: null,
        }),

      getFormData: () => {
        const state = get();
        return {
          meta: state.meta,
          selections: state.selections,
          personalInfo: state.personalInfo || undefined,
          dependents: state.dependents || undefined,
          benefits: state.benefits || undefined,
          specialEnrollment: state.specialEnrollment || undefined,
          terminatePolicy: state.terminatePolicy || undefined,
        };
      },

      setValidationErrors: (errors) => set({ validationErrors: errors }),
    }),
    {
      name: 'insurance-form-storage',
      // Exclude sensitive data from localStorage
      partialize: (state) => ({
        ...state,
        dependents: state.dependents
          ? {
              add: state.dependents.add
                ? {
                    ...state.dependents.add,
                    spouse: state.dependents.add.spouse
                      ? {
                          ...state.dependents.add.spouse,
                          ssn: undefined, // Omit SSN from local storage
                        }
                      : undefined,
                    dependents:
                      state.dependents.add.dependents?.map((d) => ({
                        ...d,
                        ssn: undefined, // Omit SSN from local storage
                      })) || [],
                  }
                : null,
              remove: state.dependents.remove || null,
            }
          : null,
      }),
    },
  ),
);

/**
 * TODO: [CRITICAL] Enhance data security:
 * 1. Implement proper encryption for all persisted data
 * 2. Add data masking for all PII/PHI in local storage
 * 3. Implement storage timeout and automatic purging of sensitive data
 * 4. Add audit logging for all data access and modifications
 */

// Helper function to check if a form section is completed
export function isSectionComplete(section: string): boolean {
  const state = useFormStore.getState();

  switch (section) {
    case 'selections':
      return Object.values(state.selections).some(Boolean);

    case 'personal-info':
      if (!state.selections.changePersonalInfo) return true;
      return !!state.personalInfo;

    case 'dependents':
      if (!state.selections.addDependents && !state.selections.removeDependents)
        return true;
      return !!state.dependents;

    case 'benefits':
      if (!state.selections.changeBenefits) return true;
      return !!state.benefits;

    case 'special-enrollment':
      if (
        state.meta.groupNumber !== '129800' ||
        (!state.selections.addDependents && !state.selections.changeBenefits)
      ) {
        return true;
      }
      return !!state.specialEnrollment;

    case 'terminate-policy':
      if (!state.selections.terminatePolicy) return true;
      return !!state.terminatePolicy;

    default:
      return false;
  }
}

/**
 * TODO: [HIGH] Implement additional section validation:
 * 1. Deep validation of each section's required fields
 * 2. Cross-section validation for interdependent data
 * 3. Group-specific section completion rules
 * 4. Special validation for conditional fields
 */
