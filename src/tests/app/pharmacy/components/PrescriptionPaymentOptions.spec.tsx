import { PrescriptionPaymentsOptions } from '@/app/pharmacy/components/PrescriptionPaymentOptions';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <PrescriptionPaymentsOptions isMedicare={true} isBlueCarePlus={false} />,
  );
};
const baseUrl = window.location.origin;
process.env.NEXT_PUBLIC_IDP_M3P =
  'https://iam-uat.medadvantage360.com/auth/realms/member-stage';
describe('PrescriptionPaymentsOptions', () => {
  it('should render the Biometric UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Medicare Prescription Payment Plan Sign-up');
    screen.getByText(
      'If you need help paying for your prescriptions, Social Security’s Extra Help program could lower your costs.',
    );
    expect(component).toMatchSnapshot();
  });

  it('should render SSO correctly', async () => {
    const component = renderUI();
    screen.getByText('Medicare Prescription Payment Plan Sign-up');
    expect(
      screen.getByRole('link', {
        name: 'Medicare Prescription Payment Plan Sign-up',
      }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=https://iam-uat.medadvantage360.com/auth/realms/member-stage`,
    );
    expect(component).toMatchSnapshot();
  });
});
