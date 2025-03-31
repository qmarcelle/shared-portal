import MedicalPrescriptionPaymentPlanPage from '@/app/pharmacy/medicalPrescriptionPaymentPlan/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Medical Prescription Payment Plan Page', () => {
  it('should render the page correctly', () => {
    const page = MedicalPrescriptionPaymentPlanPage();
    const container = render(page);
    expect(
      screen.getByText('Medicare Prescription Payment Plan'),
    ).toBeVisible();
    expect(screen.getAllByText('Terms and Conditions')[0]).toBeInTheDocument();

    // Check for the existence of the checkbox with this label text
    const checkbox = screen.getByLabelText(
      /I read, considered, understand and agree to the contents above/,
    );
    expect(checkbox).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
