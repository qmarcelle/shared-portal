import HealthyMaternityMobileApp from '@/app/healthyMaternity/components/HealthyMaternityMobileApp';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<HealthyMaternityMobileApp />);
};

describe('HealthyMaternityMobileApp Section', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(
      screen.getByText('Healthy Maternity & CareTN Mobile App'),
    ).toBeVisible();
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "Once you've enrolled, download the CareTN app. You can use the app to message a maternity nurse and access program resources.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText('Learn about eating healthy for you and your baby'),
    ).toBeVisible();
    expect(
      screen.getByText('Track doctor visits and set reminders'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Get information on immunizations and when to schedule them',
      ),
    ).toBeVisible();
    expect(screen.getByText('Connect with maternity nurse')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
