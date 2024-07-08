import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PharmacyClaimSSO } from '@/components/composite/PharmacyClaimSSO';

const setupUI = () => {
  return render(<PharmacyClaimSSO />);
};

describe('Pharmacy Claim SSO in My Plan Claims Page', () => {
  it('should render all the required components', () => {
    const component = setupUI();
    expect(
      screen.getByRole('heading', { name: 'Find More Details' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'CVS Caremark is your pharmacy benefit manager. You can find more information about your pharmacy claim on Caremark.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Go to Caremark')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
