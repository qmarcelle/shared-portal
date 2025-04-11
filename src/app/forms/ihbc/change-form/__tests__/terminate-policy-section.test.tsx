import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TerminatePolicySection } from '../components/form-sections';
import { useFormStore } from '../stores/stores';

/**
 * Terminate Policy Section Tests
 *
 * These tests verify the functionality of the policy termination section
 * including validation rules, required acknowledgments, and store integration.
 *
 * TODO: [CRITICAL] Add tests for group-specific termination rules (group 129800 has different constraints)
 * TODO: [HIGH] Add tests for COBRA eligibility notification requirements
 * TODO: [HIGH] Test PDF generation of termination forms
 * TODO: [MEDIUM] Add tests for termination with active claims
 * TODO: [MEDIUM] Test API integration for termination submission
 */

// Mock form wrapper
function FormWrapper({ children }: { children: ReactNode }) {
  const methods = useForm({
    defaultValues: {
      terminatePolicy: {
        terminationDate: '',
        reason: '',
        acknowledgments: [],
        newCoverageInfo: null,
      },
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('TerminatePolicySection', () => {
  beforeEach(() => {
    useFormStore.getState().resetForm();
  });

  describe('Termination Date Rules', () => {
    it('should not allow retroactive termination dates', async () => {
      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      const dateInput = screen.getByLabelText(/Termination Date/i);
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      fireEvent.change(dateInput, {
        target: { value: pastDate.toISOString().split('T')[0] },
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Cannot terminate coverage retroactively/i),
        ).toBeInTheDocument();
      });
    });

    it('should enforce 30-day notice period for voluntary termination', async () => {
      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      // Select voluntary termination
      fireEvent.click(screen.getByLabelText(/Voluntary Termination/i));

      const dateInput = screen.getByLabelText(/Termination Date/i);
      const tooSoonDate = new Date();
      tooSoonDate.setDate(tooSoonDate.getDate() + 15);

      fireEvent.change(dateInput, {
        target: { value: tooSoonDate.toISOString().split('T')[0] },
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Must provide at least 30 days notice/i),
        ).toBeInTheDocument();
      });
    });

    /**
     * TODO: [HIGH] Add the following date validation tests:
     * 1. Test end-of-month termination rule (terminations must be on the last day of month)
     * 2. Test special handling for mid-month termination for qualifying events
     * 3. Test prevention of termination during premium grace period
     */

    it('should allow immediate termination for qualifying events', async () => {
      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      // Select qualifying event
      fireEvent.click(screen.getByLabelText(/Other Coverage Available/i));

      const dateInput = screen.getByLabelText(/Termination Date/i);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      fireEvent.change(dateInput, {
        target: { value: tomorrow.toISOString().split('T')[0] },
      });

      // Should not show 30-day notice error
      expect(
        screen.queryByText(/Must provide at least 30 days notice/i),
      ).not.toBeInTheDocument();
    });
  });

  describe('Required Acknowledgments', () => {
    it('should require all acknowledgments before proceeding', async () => {
      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      // Try to save without acknowledgments
      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => {
        expect(
          screen.getByText(/Must acknowledge all statements/i),
        ).toBeInTheDocument();
      });

      // Check all acknowledgments
      const acknowledgments = screen.getAllByRole('checkbox');
      acknowledgments.forEach((checkbox) => {
        fireEvent.click(checkbox);
      });

      // Try to save again
      fireEvent.click(screen.getByText(/Save/i));

      // Should not show error
      expect(
        screen.queryByText(/Must acknowledge all statements/i),
      ).not.toBeInTheDocument();
    });

    /**
     * TODO: [HIGH] Add tests for the following acknowledgment scenarios:
     * 1. Test different acknowledgment requirements based on termination reason
     * 2. Test specific language requirements for different group numbers
     * 3. Test conditional acknowledgments for dependents
     */

    it('should display COBRA eligibility notice when applicable', async () => {
      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      // Select voluntary termination
      fireEvent.click(screen.getByLabelText(/Voluntary Termination/i));

      await waitFor(() => {
        expect(
          screen.getByText(/COBRA continuation coverage/i),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/You will receive COBRA election forms/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('New Coverage Information', () => {
    it('should require new coverage details for certain termination reasons', async () => {
      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      // Select other coverage available
      fireEvent.click(screen.getByLabelText(/Other Coverage Available/i));

      // Try to save without new coverage info
      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => {
        expect(
          screen.getByText(/New coverage information required/i),
        ).toBeInTheDocument();
      });

      // Fill in new coverage info
      fireEvent.change(screen.getByLabelText(/Insurance Provider/i), {
        target: { value: 'New Insurance Co' },
      });
      fireEvent.change(screen.getByLabelText(/Policy Number/i), {
        target: { value: '12345' },
      });
      fireEvent.change(screen.getByLabelText(/Effective Date/i), {
        target: { value: '2024-04-01' },
      });

      // Try to save again
      fireEvent.click(screen.getByText(/Save/i));

      // Should not show error
      expect(
        screen.queryByText(/New coverage information required/i),
      ).not.toBeInTheDocument();
    });

    /**
     * TODO: [MEDIUM] Add tests for the following new coverage scenarios:
     * 1. Test validation of coverage overlap periods
     * 2. Test special handling for Medicare transition
     * 3. Test employer information requirement for group-to-group transitions
     */
  });

  describe('Store Integration', () => {
    it('should update store with termination details', async () => {
      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      // Fill in termination details
      fireEvent.click(screen.getByLabelText(/Other Coverage Available/i));

      const terminationDate = '2024-04-01';
      fireEvent.change(screen.getByLabelText(/Termination Date/i), {
        target: { value: terminationDate },
      });

      // Fill in new coverage info
      fireEvent.change(screen.getByLabelText(/Insurance Provider/i), {
        target: { value: 'New Insurance Co' },
      });
      fireEvent.change(screen.getByLabelText(/Policy Number/i), {
        target: { value: '12345' },
      });
      fireEvent.change(screen.getByLabelText(/Effective Date/i), {
        target: { value: terminationDate },
      });

      // Check acknowledgments
      const acknowledgments = screen.getAllByRole('checkbox');
      acknowledgments.forEach((checkbox) => {
        fireEvent.click(checkbox);
      });

      // Save changes
      fireEvent.click(screen.getByText(/Save/i));

      // Verify store update
      await waitFor(() => {
        const state = useFormStore.getState();
        expect(state.terminatePolicy).toEqual({
          terminationDate,
          reason: 'OTHER_COVERAGE',
          acknowledgments: expect.arrayContaining([
            'UNDERSTAND_TERMINATION',
            'NO_CLAIMS_AFTER_DATE',
          ]),
          newCoverageInfo: {
            provider: 'New Insurance Co',
            policyNumber: '12345',
            effectiveDate: terminationDate,
          },
        });
      });
    });
  });

  describe('Business Rules', () => {
    it('should prevent termination during active claims processing', async () => {
      // Mock active claims in store
      useFormStore.setState({
        meta: {
          ...useFormStore.getState().meta,
          status: 'In Progress',
        },
      });

      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            /Cannot terminate while claims are being processed/i,
          ),
        ).toBeInTheDocument();
        expect(screen.getByText(/Save/i)).toBeDisabled();
      });
    });

    /**
     * TODO: [HIGH] Add tests for the following business rules:
     * 1. Test different termination constraints based on policy type
     * 2. Test prorated premium calculation for mid-period terminations
     * 3. Test handling of pending authorization requests during termination
     * 4. Test retention policy validation (some groups require 12-month retention)
     */

    it('should require dependent notification acknowledgment when applicable', async () => {
      // Mock dependents in store
      useFormStore.setState({
        dependents: {
          add: {
            addSpouse: true,
            spouse: {
              firstName: 'Jane',
              lastName: 'Doe',
            },
            addDependents: true,
            dependents: [
              {
                firstName: 'Child',
                lastName: 'Doe',
              },
            ],
          },
          remove: null,
        },
      });

      render(
        <FormWrapper>
          <TerminatePolicySection />
        </FormWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Acknowledge dependent notification/i),
        ).toBeInTheDocument();
      });

      // Try to save without dependent acknowledgment
      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => {
        expect(
          screen.getByText(/Must acknowledge dependent notification/i),
        ).toBeInTheDocument();
      });
    });
  });
});
