import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { format } from 'date-fns';
import { FormProvider, useForm } from 'react-hook-form';
import { SpecialEnrollmentSection } from '../components/special-enrollment-section';

// Wrapper component to provide form context
function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: {
      specialEnrollment: {
        eventType: '',
        eventDate: '',
        effectiveDate: '',
      },
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SpecialEnrollmentSection', () => {
  it('renders all event type options', () => {
    render(
      <FormWrapper>
        <SpecialEnrollmentSection />
      </FormWrapper>,
    );

    // Check for all event type radio options
    expect(
      screen.getByText('Loss of Minimum Essential Health Insurance Coverage'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Birth/Adoption/Placement in Foster Care'),
    ).toBeInTheDocument();
    expect(screen.getByText('Recently Married')).toBeInTheDocument();
  });

  it('shows date field after selecting event type', async () => {
    render(
      <FormWrapper>
        <SpecialEnrollmentSection />
      </FormWrapper>,
    );

    // Initially, date field should not be visible
    expect(screen.queryByText('Event Date')).not.toBeInTheDocument();

    // Select an event type
    fireEvent.click(
      screen.getByText('Loss of Minimum Essential Health Insurance Coverage'),
    );

    // Date field should now be visible
    await waitFor(() => {
      expect(screen.getByText('Event Date')).toBeInTheDocument();
    });
  });

  it('validates date within 3-month range', async () => {
    render(
      <FormWrapper>
        <SpecialEnrollmentSection />
      </FormWrapper>,
    );

    // Select an event type
    fireEvent.click(
      screen.getByText('Loss of Minimum Essential Health Insurance Coverage'),
    );

    // Try to enter a date more than 3 months ago
    const dateInput = screen.getByLabelText('Event Date');
    const oldDate = format(
      new Date().setMonth(new Date().getMonth() - 4),
      'yyyy-MM-dd',
    );
    fireEvent.change(dateInput, { target: { value: oldDate } });

    // Should show error message
    await waitFor(() => {
      expect(
        screen.getByText('Event date must be within the last 3 months'),
      ).toBeInTheDocument();
    });
  });

  it('calculates correct effective dates for Loss of Coverage', async () => {
    render(
      <FormWrapper>
        <SpecialEnrollmentSection />
      </FormWrapper>,
    );

    // Select Loss of Coverage
    fireEvent.click(
      screen.getByText('Loss of Minimum Essential Health Insurance Coverage'),
    );

    // Enter a valid date
    const dateInput = screen.getByLabelText('Event Date');
    const validDate = format(new Date(), 'yyyy-MM-dd');
    fireEvent.change(dateInput, { target: { value: validDate } });

    // Should show effective date options
    await waitFor(() => {
      expect(
        screen.getByText(/1st day of month after event/),
      ).toBeInTheDocument();
    });
  });

  it('handles marriage event type special rules', async () => {
    render(
      <FormWrapper>
        <SpecialEnrollmentSection />
      </FormWrapper>,
    );

    // Select Marriage
    fireEvent.click(screen.getByText('Recently Married'));

    // Enter today's date
    const dateInput = screen.getByLabelText('Event Date');
    const today = format(new Date(), 'yyyy-MM-dd');
    fireEvent.change(dateInput, { target: { value: today } });

    // Should show specific marriage effective date option
    await waitFor(() => {
      expect(
        screen.getByText(/1st day of month after event/),
      ).toBeInTheDocument();
    });
  });

  it('prevents future dates', async () => {
    render(
      <FormWrapper>
        <SpecialEnrollmentSection />
      </FormWrapper>,
    );

    // Select an event type
    fireEvent.click(
      screen.getByText('Loss of Minimum Essential Health Insurance Coverage'),
    );

    // Try to enter a future date
    const dateInput = screen.getByLabelText('Event Date');
    const futureDate = format(
      new Date().setMonth(new Date().getMonth() + 1),
      'yyyy-MM-dd',
    );
    fireEvent.change(dateInput, { target: { value: futureDate } });

    // Should show error message
    await waitFor(() => {
      expect(
        screen.getByText('Event date cannot be in the future'),
      ).toBeInTheDocument();
    });
  });

  it('maintains form state when switching event types', async () => {
    render(
      <FormWrapper>
        <SpecialEnrollmentSection />
      </FormWrapper>,
    );

    // Select first event type and enter date
    fireEvent.click(
      screen.getByText('Loss of Minimum Essential Health Insurance Coverage'),
    );
    const dateInput = screen.getByLabelText('Event Date');
    const validDate = format(new Date(), 'yyyy-MM-dd');
    fireEvent.change(dateInput, { target: { value: validDate } });

    // Switch to different event type
    fireEvent.click(screen.getByText('Recently Married'));

    // Date should persist
    await waitFor(() => {
      expect(dateInput).toHaveValue(validDate);
    });
  });
});
