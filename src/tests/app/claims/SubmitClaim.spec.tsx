import SubmitClaim from '@/app/claims/submitAClaim/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<SubmitClaim />);
};

// snapshot testing for submitclaim
describe('Submit a claim Page UI', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    expect(
      screen.getByRole('heading', { name: 'Submit a Claim' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Fill out the appropriate form to ask us to reimburse or pay your claim.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Claim Forms')).toBeVisible();
    expect(screen.getByText('Medical Claim Form')).toBeVisible();

    expect(screen.getByText('Prescription Claim Form')).toBeVisible();
    expect(screen.getByText('Dental Claim Form')).toBeVisible();
    expect(screen.getByText('Vision Claim Form')).toBeVisible();
    expect(screen.getByText('Breast Pump Claim Form')).toBeVisible();

    expect(
      screen.getByText('Understanding Claims Reimbursement'),
    ).toBeVisible();
    expect(
      screen.getByText(
        /Follow the instructions included on the claim form. In most cases, you'll need to print the form, fill it out and then mail it to the address listed on the form./,
      ),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
