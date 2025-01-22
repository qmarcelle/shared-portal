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
    expect(container.baseElement)
      .toContainHTML(`<p>I read, considered, understand and agree to the contents above. I
                  understand that, by clicking on the "I AGREE" button, below, I am
                  confirming my authorization for the use, disclosure of information about
                  me and redirection to WIPRO, LLC, as described herein.</p>`);
    expect(container).toMatchSnapshot();
  });
});
