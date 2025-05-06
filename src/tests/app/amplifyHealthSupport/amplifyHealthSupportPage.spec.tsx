import AmplifyHealthSupport from '@/app/(protected)/(common)/member/amplifyHealthSupport/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Amplify Health Support Page', () => {
  it('should render the page correctly', () => {
    const { container } = render(<AmplifyHealthSupport />);

    // Header Section should be present
    expect(screen.getByRole('heading', { name: 'Support' })).toBeVisible();

    expect(
      screen.getByText(
        'Your advisors are here to answer your questions. Chat online or call 1-866-258-3267, anytime 24/7.',
      ),
    ).toBeInTheDocument();

    // Advisors Section should be present
    expect(
      screen.getByRole('heading', { name: 'Your AmplifyHealth Advisors can:' }),
    ).toBeVisible();

    // App Download Info Section should be present
    expect(
      screen.getByRole('heading', { name: 'Bring Your Advisors With You' }),
    ).toBeVisible();

    // Resources Section should be present
    expect(screen.getByText('Resources')).toBeVisible();
    expect(screen.getByText('Frequently Asked Questions')).toBeVisible();
    expect(screen.getByText('Health Insurance Glossary')).toBeVisible();
    expect(screen.getByText('Find a Form')).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
