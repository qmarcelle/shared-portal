import { AmplifyHealthAdvisorBanner } from '@/app/(protected)/(common)/member/dashboard/components/AmplifyHealthAdvisorBanner';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<AmplifyHealthAdvisorBanner />);
};

describe('AmplifyHealthAdvisorBanner', () => {
  it('should render UI correctly', () => {
    const component = renderUI();
    expect(
      screen.getByRole('heading', { name: 'My AmplifyHealth Advisor' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Have a question or need advice? Your AmplifyHealth Advisor is here for you 24/7. You can start a chat or call us at [1-866-258-3267].',
      ),
    ).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
