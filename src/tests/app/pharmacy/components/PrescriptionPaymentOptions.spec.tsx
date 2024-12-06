import { PrescriptionPaymentsOptions } from '@/app/pharmacy/components/PrescriptionPaymentOptions';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <PrescriptionPaymentsOptions isMedicare={true} isBlueCarePlus={false} />,
  );
};

describe('PrescriptionPaymentsOptions', () => {
  it('should render the Biometric UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Medicare Prescription Payment Plan Sign-up');
    screen.getByText(
      'If you need help paying for your prescriptions, Social Security’s Extra Help program could lower your costs.',
    );
    expect(component).toMatchSnapshot();
  });
});
