import { FaqTopics } from '@/app/support/faqTopics/components/FaqTopics';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<FaqTopics />);
};

describe('Benefits and Coverage FAQ', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    const benefits = screen.getByRole('button', {
      name: 'Benefits & Coverage',
    });

    fireEvent.click(benefits);
    screen.getByText('Learn more about finding care, coverage and more.');

    screen.getByRole('heading', {
      name: 'Understanding Coverage',
    });
    screen.getByText('What does “premium/copay/deductible/coinsurance” mean?');

    fireEvent.click(
      screen.getByText(
        'What does “premium/copay/deductible/coinsurance” mean?',
      ),
    );

    screen.getByText(
      'Here’s a quick definition for the most common terms you’ll see in insurance:',
    );

    screen.getByRole('heading', {
      name: 'Other FAQ Topics',
    });
    screen.getByText('Benefits & Coverage');
    screen.getByText('Claims');
    screen.getByText('ID Cards');
    screen.getByText('My Plan Information');
    screen.getByText('Pharmacy');
    screen.getByText('Prior Authorization');
    screen.getByText('Security');

    expect(component).toMatchSnapshot();
  });
});
