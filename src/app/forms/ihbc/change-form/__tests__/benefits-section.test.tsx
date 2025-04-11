import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BenefitsSection } from '../components/benefits-section';
import { useFormStore } from '../stores/stores';

// Mock form wrapper
function FormWrapper({ children }: { children: ReactNode }) {
  const methods = useForm({
    defaultValues: {
      benefits: {
        selectedPlan: '',
        coverageLevel: '',
        effectiveDate: '',
        primaryCare: '',
        specialist: '',
        deductible: '',
        outOfPocket: '',
      },
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('BenefitsSection', () => {
  beforeEach(() => {
    useFormStore.getState().resetForm();
  });

  describe('Plan Selection', () => {
    it('should render available plan options', () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      expect(screen.getByText(/Select a Plan/i)).toBeInTheDocument();
      expect(screen.getByText(/Bronze Plan/i)).toBeInTheDocument();
      expect(screen.getByText(/Silver Plan/i)).toBeInTheDocument();
      expect(screen.getByText(/Gold Plan/i)).toBeInTheDocument();
    });

    it('should update plan details when a plan is selected', async () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      fireEvent.click(screen.getByText(/Silver Plan/i));

      await waitFor(() => {
        expect(screen.getByText(/\$30 Primary Care/i)).toBeInTheDocument();
        expect(screen.getByText(/\$60 Specialist/i)).toBeInTheDocument();
        expect(screen.getByText(/\$3000 Deductible/i)).toBeInTheDocument();
      });
    });

    it('should calculate and display monthly premium based on coverage level', async () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      // Select a plan
      fireEvent.click(screen.getByText(/Silver Plan/i));

      // Select family coverage
      fireEvent.click(screen.getByLabelText(/Family Coverage/i));

      await waitFor(() => {
        expect(screen.getByText(/Monthly Premium: \$750/i)).toBeInTheDocument();
      });
    });
  });

  describe('Coverage Level Selection', () => {
    it('should render coverage level options', () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      expect(screen.getByLabelText(/Individual Coverage/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Family Coverage/i)).toBeInTheDocument();
    });

    it('should update premium when coverage level changes', async () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      // Select a plan first
      fireEvent.click(screen.getByText(/Silver Plan/i));

      // Check individual premium
      expect(screen.getByText(/Monthly Premium: \$350/i)).toBeInTheDocument();

      // Change to family coverage
      fireEvent.click(screen.getByLabelText(/Family Coverage/i));

      await waitFor(() => {
        expect(screen.getByText(/Monthly Premium: \$750/i)).toBeInTheDocument();
      });
    });
  });

  describe('Effective Date Selection', () => {
    it('should render effective date options', () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      expect(screen.getByLabelText(/Effective Date/i)).toBeInTheDocument();
    });

    it('should validate effective date selection', async () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      // Try to submit without selecting date
      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => {
        expect(
          screen.getByText(/Effective date is required/i),
        ).toBeInTheDocument();
      });
    });

    it('should not allow past dates', async () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      const dateInput = screen.getByLabelText(/Effective Date/i);
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);

      fireEvent.change(dateInput, {
        target: { value: pastDate.toISOString().split('T')[0] },
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Effective date cannot be in the past/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Store Integration', () => {
    it('should update store with selected benefits', async () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      // Select plan and coverage
      fireEvent.click(screen.getByText(/Silver Plan/i));
      fireEvent.click(screen.getByLabelText(/Family Coverage/i));

      // Set effective date
      const dateInput = screen.getByLabelText(/Effective Date/i);
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);

      fireEvent.change(dateInput, {
        target: { value: futureDate.toISOString().split('T')[0] },
      });

      // Save changes
      fireEvent.click(screen.getByText(/Save/i));

      await waitFor(() => {
        const state = useFormStore.getState();
        expect(state.benefits).toEqual({
          selectedPlan: 'silver',
          coverageLevel: 'family',
          effectiveDate: futureDate.toISOString().split('T')[0],
          primaryCare: 30,
          specialist: 60,
          deductible: 3000,
          outOfPocket: 8000,
        });
      });
    });
  });

  describe('Business Rules', () => {
    it('should enforce waiting period for non-qualifying events', async () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      const dateInput = screen.getByLabelText(/Effective Date/i);
      const tooSoonDate = new Date();
      tooSoonDate.setDate(tooSoonDate.getDate() + 15); // Try 15 days from now

      fireEvent.change(dateInput, {
        target: { value: tooSoonDate.toISOString().split('T')[0] },
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            /Must be at least 30 days from today unless qualifying event/i,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should calculate correct premium based on age and tobacco use', async () => {
      // Mock store with personal info including age and tobacco use
      useFormStore.setState({
        personalInfo: {
          dateOfBirth: '1980-01-01',
          tobaccoUse: true,
        },
      });

      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      // Select silver plan
      fireEvent.click(screen.getByText(/Silver Plan/i));

      await waitFor(() => {
        // Premium should be higher due to age and tobacco use
        expect(screen.getByText(/Monthly Premium: \$450/i)).toBeInTheDocument();
      });
    });

    it('should enforce maximum out-of-pocket limits based on federal guidelines', async () => {
      render(
        <FormWrapper>
          <BenefitsSection />
        </FormWrapper>,
      );

      // Select gold plan (highest coverage)
      fireEvent.click(screen.getByText(/Gold Plan/i));

      await waitFor(() => {
        const outOfPocket = screen.getByText(/Maximum Out-of-Pocket/i);
        expect(outOfPocket).toHaveTextContent(/\$8,700/); // 2024 federal limit for individual
      });
    });
  });
});
