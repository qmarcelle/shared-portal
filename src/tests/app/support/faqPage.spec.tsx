import FrequentlyAskedQuestions from '@/app/(protected)/(common)/member/support/faq/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Frequently Asked Question Page', () => {
  it('should render the page correctly', () => {
    const { container } = render(<FrequentlyAskedQuestions />);

    screen.getByRole('heading', { name: 'Frequently Asked Questions' });
    expect(
      screen.getByText(
        'We’ve answered some of the most common questions about health insurance.',
      ),
    ).toBeVisible();

    expect(screen.getByText('Benefits & Coverage')).toBeVisible();
    expect(
      screen.getByText(
        'Learn more about service limits, deductibles and more.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Claims')).toBeVisible();
    expect(
      screen.getByText('Learn more about claims or how to file a dispute.'),
    ).toBeVisible();
    expect(screen.getByText('ID Cards')).toBeVisible();
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "Do you have questions about your ID cards? We're here to help.",
      ),
    ).toBeVisible();
    expect(screen.getByText('My Plan Information')).toBeVisible();
    expect(
      screen.getByText('How to update your address, dependents, and more.'),
    ).toBeVisible();
    expect(screen.getByText('Pharmacy')).toBeVisible();
    expect(
      screen.getByText(
        'How to find pharmacies, find prescription drug coverage and more.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Prior Authorization')).toBeVisible();
    expect(
      screen.getByText(
        'Learn more about prior authorizations, statuses and how to make appeals.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Security')).toBeVisible();
    expect(
      screen.getByText(
        'How to share your health insurance information, represent a dependent individual and more.',
      ),
    ).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
