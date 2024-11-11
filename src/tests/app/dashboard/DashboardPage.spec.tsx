import DashboardPage from '@/app/dashboard/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await DashboardPage();
  return render(page);
};

jest.mock('../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          firstName: 'Chris',
          plan: {
            planName: 'BlueCross BlueShield of Tennessee',
            subId: '123456',
            grpId: '100000',
            memCk: '123456789',
            coverageType: ['Medical', 'Dental', 'Vision'],
          },
        },
      },
    }),
  ),
}));

describe('Dashboard Page', () => {
  it('should render Welcome Banner UI correctly', async () => {
    const component = await renderUI();
    expect(
      screen.getByText('Plan: BlueCross BlueShield of Tennessee'),
    ).toBeVisible();
    expect(screen.getByText('Policies: Medical, Dental, Vision')).toBeVisible();
    expect(screen.getByText('View Plan Details')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
