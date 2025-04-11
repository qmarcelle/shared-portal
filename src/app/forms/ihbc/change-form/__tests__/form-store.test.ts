import { act } from '@testing-library/react';
import { isSectionComplete, useFormStore } from '../stores/stores';

describe('Form Store', () => {
  beforeEach(() => {
    act(() => {
      useFormStore.getState().resetForm();
    });
  });

  describe('Basic Store Operations', () => {
    it('should initialize with default values', () => {
      const state = useFormStore.getState();
      expect(state.meta).toEqual({
        applicationId: '',
        groupNumber: '',
        subscriberId: '',
        status: 'In Progress',
        lastSaved: expect.any(String),
      });
      expect(state.selections).toEqual({
        changePersonalInfo: false,
        addDependents: false,
        removeDependents: false,
        changeBenefits: false,
        terminatePolicy: false,
      });
    });

    it('should initialize application with group and subscriber numbers', () => {
      act(() => {
        useFormStore.getState().initializeApplication('12345', '67890');
      });

      const state = useFormStore.getState();
      expect(state.meta.groupNumber).toBe('12345');
      expect(state.meta.subscriberId).toBe('67890');
    });

    it('should update selections', () => {
      act(() => {
        useFormStore.getState().updateSelections({
          changePersonalInfo: true,
          addDependents: true,
        });
      });

      const state = useFormStore.getState();
      expect(state.selections.changePersonalInfo).toBe(true);
      expect(state.selections.addDependents).toBe(true);
    });
  });

  describe('Section Completion Status', () => {
    it('should mark selections section as complete when at least one selection is made', () => {
      act(() => {
        useFormStore.getState().updateSelections({
          changePersonalInfo: true,
        });
      });

      expect(isSectionComplete('selections')).toBe(true);
    });

    it('should mark personal-info as complete when not selected', () => {
      expect(isSectionComplete('personal-info')).toBe(true);
    });

    it('should require personal info when selected', () => {
      act(() => {
        useFormStore.getState().updateSelections({
          changePersonalInfo: true,
        });
      });

      expect(isSectionComplete('personal-info')).toBe(false);

      act(() => {
        useFormStore.getState().updatePersonalInfo({
          changeName: true,
          currentName: {
            firstName: 'John',
            lastName: 'Doe',
          },
        });
      });

      expect(isSectionComplete('personal-info')).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should update status and dates when submitted', () => {
      act(() => {
        useFormStore.getState().setSubmitted();
      });

      const state = useFormStore.getState();
      expect(state.meta.status).toBe('Submitted');
      expect(state.meta.submittedDate).toBeTruthy();
      expect(state.meta.lastSaved).toBeTruthy();
    });
  });
});
