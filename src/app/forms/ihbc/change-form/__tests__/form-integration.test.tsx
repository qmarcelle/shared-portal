import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { submitApplication } from '../actions/actions';
import FormLayout from '../layout';
import { useFormStore } from '../stores/stores';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock server actions
jest.mock('../actions/actions', () => ({
  submitApplication: jest.fn(),
}));

// Mock form wrapper
function FormWrapper({ children }: { children: ReactNode }) {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('Form Integration', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    useFormStore.getState().resetForm();
    (submitApplication as jest.Mock).mockReset();
  });

  describe('Complete Form Submission Flow', () => {
    it('should complete full form submission successfully', async () => {
      // Mock successful submission
      (submitApplication as jest.Mock).mockResolvedValue({
        success: true,
        confirmationNumber: '240315-123456-7890',
      });

      render(
        <FormWrapper>
          <FormLayout>
            <div>Form Content</div>
          </FormLayout>
        </FormWrapper>,
      );

      // Step 1: Select Changes
      await act(async () => {
        fireEvent.click(screen.getByText(/Change Personal Info/i));
        fireEvent.click(screen.getByText(/Add Dependents/i));
        fireEvent.click(screen.getByText(/Change Benefits/i));
      });

      // Navigate to Personal Info
      fireEvent.click(screen.getByText('Continue'));
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(
          '/forms/ihbc/change-form/personal-info',
        );
      });

      // Step 2: Fill Personal Info
      await act(async () => {
        useFormStore.getState().updatePersonalInfo({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          dateOfBirth: '1980-01-01',
          tobaccoUse: false,
        });
      });

      // Step 3: Add Dependents
      await act(async () => {
        useFormStore.getState().updateDependents('add', {
          addSpouse: true,
          spouse: {
            firstName: 'Jane',
            lastName: 'Doe',
            dateOfBirth: '1982-01-01',
          },
        });
      });

      // Step 4: Select Benefits
      await act(async () => {
        useFormStore.getState().updateBenefits({
          selectedPlan: 'silver',
          coverageLevel: 'family',
          effectiveDate: '2024-05-01',
          primaryCare: 30,
          specialist: 60,
          deductible: 3000,
          outOfPocket: 8000,
        });
      });

      // Submit form
      await act(async () => {
        useFormStore.getState().setSubmitted();
      });

      // Verify submission
      const formState = useFormStore.getState();
      expect(formState.meta.status).toBe('Submitted');
      expect(submitApplication).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.any(Object),
          selections: expect.any(Object),
          personalInfo: expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
          }),
          benefits: expect.objectContaining({
            selectedPlan: 'silver',
            coverageLevel: 'family',
          }),
        }),
      );
    });

    it('should persist form state between navigation', async () => {
      render(
        <FormWrapper>
          <FormLayout>
            <div>Form Content</div>
          </FormLayout>
        </FormWrapper>,
      );

      // Fill out first step
      await act(async () => {
        fireEvent.click(screen.getByText(/Change Personal Info/i));
        useFormStore.getState().updateSelections({
          changePersonalInfo: true,
        });
      });

      // Navigate away
      fireEvent.click(screen.getByText('Continue'));

      // Verify state persists
      const state = useFormStore.getState();
      expect(state.selections.changePersonalInfo).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors during submission', async () => {
      // Mock validation error
      (submitApplication as jest.Mock).mockResolvedValue({
        success: false,
        errors: {
          personalInfo: ['Email is required'],
        },
        message: 'Please fix the errors in the form before submitting.',
      });

      render(
        <FormWrapper>
          <FormLayout>
            <div>Form Content</div>
          </FormLayout>
        </FormWrapper>,
      );

      // Submit incomplete form
      await act(async () => {
        useFormStore.getState().setSubmitted();
      });

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/Please fix the errors/i)).toBeInTheDocument();
      });
    });

    it('should handle server errors during submission', async () => {
      // Mock server error
      (submitApplication as jest.Mock).mockRejectedValue(
        new Error('Server error'),
      );

      render(
        <FormWrapper>
          <FormLayout>
            <div>Form Content</div>
          </FormLayout>
        </FormWrapper>,
      );

      // Submit form
      await act(async () => {
        useFormStore.getState().setSubmitted();
      });

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors during submission', async () => {
      // Mock network error
      (submitApplication as jest.Mock).mockRejectedValue(
        new Error('Network error'),
      );

      render(
        <FormWrapper>
          <FormLayout>
            <div>Form Content</div>
          </FormLayout>
        </FormWrapper>,
      );

      // Submit form
      await act(async () => {
        useFormStore.getState().setSubmitted();
      });

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
        expect(screen.getByText(/Try again/i)).toBeInTheDocument();
      });

      // Verify retry functionality
      fireEvent.click(screen.getByText(/Try again/i));
      expect(submitApplication).toHaveBeenCalledTimes(2);
    });
  });

  describe('Form Progress', () => {
    it('should track form completion progress', async () => {
      render(
        <FormWrapper>
          <FormLayout>
            <div>Form Content</div>
          </FormLayout>
        </FormWrapper>,
      );

      // Initial state
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '20',
      );

      // Complete first step
      await act(async () => {
        fireEvent.click(screen.getByText(/Change Personal Info/i));
        useFormStore.getState().updateSelections({
          changePersonalInfo: true,
        });
      });

      // Navigate to next step
      fireEvent.click(screen.getByText('Continue'));

      // Verify progress update
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toHaveAttribute(
          'aria-valuenow',
          '40',
        );
      });
    });

    it('should save form progress automatically', async () => {
      const mockDate = new Date('2024-03-15T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      render(
        <FormWrapper>
          <FormLayout>
            <div>Form Content</div>
          </FormLayout>
        </FormWrapper>,
      );

      // Make form changes
      await act(async () => {
        useFormStore.getState().updateSelections({
          changePersonalInfo: true,
        });
      });

      // Verify auto-save
      const state = useFormStore.getState();
      expect(state.meta.lastSaved).toBe(mockDate.toISOString());

      jest.restoreAllMocks();
    });
  });
});
