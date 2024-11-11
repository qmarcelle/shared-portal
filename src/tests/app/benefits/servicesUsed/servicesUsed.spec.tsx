import ServicesUsed from '@/app/benefits/servicesUsed';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<ServicesUsed />);
};

describe('ServicesUsed', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Services Used')).toBeVisible();
    expect(
      screen.getByText(
        /Below is a list of common services, the maximum amount covered by your plan and how many you've used./i,
      ),
    ).toBeVisible();
    expect(screen.getByText('Medical Services Used')).toBeVisible();
    expect(
      screen.getByText(
        /Some services have limits on how many are covered. You may still have a cost for them. If you reach maximum, you can still get them, but your plan won't cover them/i,
      ),
    ).toBeVisible();
    expect(
      screen.getByText('1 Visit Benefit Period - Mammogram'),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
