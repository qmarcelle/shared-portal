import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { PersonalInfoSection } from '../components/personal-info-section';
import { useFormStore } from '../stores/stores';

// Wrapper component to provide form context
function FormWrapper({ children }: { children: ReactNode }) {
  const methods = useForm({
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        relationship: '',
        gender: '',
        email: '',
        phone: '',
      },
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('PersonalInfoSection', () => {
  beforeEach(() => {
    useFormStore.getState().resetForm();
  });

  it('renders all form fields', () => {
    render(
      <FormWrapper>
        <PersonalInfoSection
          formData={{
            firstName: '',
            lastName: '',
            relationship: '',
            gender: '',
            email: '',
            phone: '',
          }}
          onChange={() => {}}
          onValidate={() => {}}
        />
      </FormWrapper>,
    );

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  });

  it('validates email format', () => {
    render(
      <FormWrapper>
        <PersonalInfoSection
          formData={{
            firstName: '',
            lastName: '',
            relationship: '',
            gender: '',
            email: '',
            phone: '',
          }}
          onChange={() => {}}
          onValidate={() => {}}
        />
      </FormWrapper>,
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    expect(
      screen.getByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
  });

  it('validates phone number format', () => {
    render(
      <FormWrapper>
        <PersonalInfoSection
          formData={{
            firstName: '',
            lastName: '',
            relationship: '',
            gender: '',
            email: '',
            phone: '',
          }}
          onChange={() => {}}
          onValidate={() => {}}
        />
      </FormWrapper>,
    );

    const phoneInput = screen.getByLabelText(/Phone/i);
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.blur(phoneInput);

    expect(
      screen.getByText(/Please enter a valid 10-digit phone number/i),
    ).toBeInTheDocument();
  });

  it('calls onChange when fields are updated', () => {
    const handleChange = jest.fn();
    render(
      <FormWrapper>
        <PersonalInfoSection
          formData={{
            firstName: '',
            lastName: '',
            relationship: '',
            gender: '',
            email: '',
            phone: '',
          }}
          onChange={handleChange}
          onValidate={() => {}}
        />
      </FormWrapper>,
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    expect(handleChange).toHaveBeenCalledWith('firstName', 'John');
  });

  it('shows relationship options in dropdown', () => {
    render(
      <FormWrapper>
        <PersonalInfoSection
          formData={{
            firstName: '',
            lastName: '',
            relationship: '',
            gender: '',
            email: '',
            phone: '',
          }}
          onChange={() => {}}
          onValidate={() => {}}
        />
      </FormWrapper>,
    );

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();

    // Check if all relationship options are present
    expect(screen.getByText(/Self/i)).toBeInTheDocument();
    expect(screen.getByText(/Spouse/i)).toBeInTheDocument();
    expect(screen.getByText(/Dependent/i)).toBeInTheDocument();
  });

  it('shows gender options as radio buttons', () => {
    render(
      <FormWrapper>
        <PersonalInfoSection
          formData={{
            firstName: '',
            lastName: '',
            relationship: '',
            gender: '',
            email: '',
            phone: '',
          }}
          onChange={() => {}}
          onValidate={() => {}}
        />
      </FormWrapper>,
    );

    expect(screen.getByLabelText(/Male/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Female/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Other/i)).toBeInTheDocument();
  });
});
