import HealthyMaternity from '@/app/healthyMaternity/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<HealthyMaternity />);
};

describe('Healthy Maternity Page', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('About Enrollment')).toBeVisible();
    expect(
      screen.getByText(
        'Complete the enrollment form to get your access code to the CareTN app.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'After enrollment, a nurse will call to welcome you and provide more details on program benefits such as the free breast pump or customized resources.',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});