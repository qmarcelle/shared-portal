import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DependentsSection } from '../components/dependents-section';
import { useFormStore } from '../stores/stores';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock form wrapper
function FormWrapper({ children }: { children: ReactNode }) {
  const methods = useForm({
    defaultValues: {
      dependents: {
        add: {
          addSpouse: false,
          spouse: null,
          addDependents: false,
          dependents: [],
        },
        remove: {
          removeSpouse: false,
          spouse: null,
          removeDependents: false,
          dependents: [],
        },
      },
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('DependentsSection', () => {
  beforeEach(() => {
    useFormStore.getState().resetForm();
  });

  describe('Add Dependents', () => {
    it('should render add spouse and dependent options', () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      expect(screen.getByText(/Add Spouse/i)).toBeInTheDocument();
      expect(screen.getByText(/Add Dependent/i)).toBeInTheDocument();
    });

    it('should show spouse form when add spouse is selected', async () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      fireEvent.click(screen.getByText(/Add Spouse/i));

      await waitFor(() => {
        expect(screen.getByText(/Spouse Information/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
      });
    });

    it('should show dependent form when add dependent is selected', async () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      fireEvent.click(screen.getByText(/Add Dependent/i));

      await waitFor(() => {
        expect(screen.getByText(/Dependent Information/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Relationship/i)).toBeInTheDocument();
      });
    });
  });

  describe('Remove Dependents', () => {
    it('should render remove spouse and dependent options', () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      expect(screen.getByText(/Remove Spouse/i)).toBeInTheDocument();
      expect(screen.getByText(/Remove Dependent/i)).toBeInTheDocument();
    });

    it('should show spouse selection when remove spouse is selected', async () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      fireEvent.click(screen.getByText(/Remove Spouse/i));

      await waitFor(() => {
        expect(
          screen.getByText(/Select Spouse to Remove/i),
        ).toBeInTheDocument();
      });
    });

    it('should show dependent selection when remove dependent is selected', async () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      fireEvent.click(screen.getByText(/Remove Dependent/i));

      await waitFor(() => {
        expect(
          screen.getByText(/Select Dependents to Remove/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields for spouse', async () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      fireEvent.click(screen.getByText(/Add Spouse/i));
      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => {
        expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Date of birth is required/i),
        ).toBeInTheDocument();
      });
    });

    it('should validate required fields for dependent', async () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      fireEvent.click(screen.getByText(/Add Dependent/i));
      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => {
        expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Date of birth is required/i),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Relationship is required/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Store Integration', () => {
    it('should update store when spouse is added', async () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      fireEvent.click(screen.getByText(/Add Spouse/i));

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const dobInput = screen.getByLabelText(/Date of Birth/i);

      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });

      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => {
        const state = useFormStore.getState();
        expect(state.dependents?.add?.spouse).toEqual({
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels and roles', () => {
      render(
        <FormWrapper>
          <DependentsSection />
        </FormWrapper>,
      );

      expect(screen.getByRole('form')).toHaveAttribute(
        'aria-label',
        'Dependents Information',
      );
      expect(
        screen.getByRole('group', { name: /Add Dependents/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('group', { name: /Remove Dependents/i }),
      ).toBeInTheDocument();
    });
  });
});
