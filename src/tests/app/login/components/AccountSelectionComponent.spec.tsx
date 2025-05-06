import { AccountSelectionComponent } from '@/app/(protected)/(common)/member/login/components/AccountSelectionComponent';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const setupUI = () => {
  return render(<AccountSelectionComponent userName="chall123" />);
};

describe('Account selection Component', () => {
  it('should render all the required details', async () => {
    const component = setupUI();

    expect(
      screen.getByText(
        /You'll be able to access all of your plans in one place./,
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'You have more than one account login. To make switching between your plans easier, we are going to prioritize one login over others. The username you confirm on this page will become your only username and password for all your BlueCross BlueShield of Tennessee registered accounts moving forward. Your login can be used for both the BlueCross website and mobile apps.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Username:')).toBeVisible();
    expect(screen.getByText('chall123')).toBeVisible();
    expect(screen.getByText('Want to use a different username?')).toBeVisible();

    expect(screen.getByText('Need help?')).toBeVisible();
    expect(
      screen.getByRole('button', { name: /Continue With This Username/i }),
    ).toBeVisible();

    expect(
      screen.getByText(
        'Give us a call using the number listed on the back of your Member ID card or',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
