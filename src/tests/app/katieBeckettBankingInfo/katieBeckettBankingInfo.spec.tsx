import KatieBeckettBankingInfoPage from '@/app/(protected)/(common)/member/myplan/katieBeckettBankingInfo/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = KatieBeckettBankingInfoPage();
  return render(page);
};

describe('Katie Beckett Banking Info Page', () => {
  it('should render the Banking form correctly', async () => {
    const component = await renderUI();
    expect(screen.getAllByText('Katie Beckett Banking Info')[0]).toBeVisible();
    expect(
      screen.getByText(
        'Below is the authorization for BlueCare Tennessee to accept bank draft payments for health insurance premiums.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Bank Draft Form')).toBeVisible();
    expect(screen.getByText('Member Information')).toBeVisible();
    expect(screen.getByText('Get Help with the Bank Draft Form')).toBeVisible();
    expect(screen.getByText('Bank Information')).toBeVisible();
    expect(
      screen.getByText(
        'By checking this box, I acknowledge that I have the authority to allow access to this account on behalf of the account holder.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Submit Form')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
