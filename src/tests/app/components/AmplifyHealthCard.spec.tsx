import { AmplifyHealthCard } from '@/app/dashboard/components/AmplifyHealthCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => render(<AmplifyHealthCard />);

describe('AmplifyHealth Card', () => {
  it('should render the UI correctly', () => {
    const { container } = renderUI();
    expect(screen.getByText('Bring Your Advisor With You')).toBeVisible();
    expect(
      screen.getByText(
        'Use the AmplifyHealth App to connect with your health advisor and access all the benefits your plan has to offer.',
      ),
    ).toBeVisible();

    // The App Download links should be present
    expect(
      screen.getByAltText('Download Amplify App from AppStore'),
    ).toBeVisible();
    expect(
      screen.getByAltText('Download Amplify App from PlayStore'),
    ).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
