import { FaqTopics } from '@/app/support/faqTopics/components/FaqTopics';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<FaqTopics />);
};

describe('ID Cards FAQ', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    const idCard = screen.getByRole('button', {
      name: 'ID Cards',
    });

    fireEvent.click(idCard);
    screen.getByText(
      'Do you have questions about your ID cards? We’re here to help.',
    );

    screen.getByRole('heading', {
      name: 'Help with Member ID Cards',
    });
    screen.getByText('How do I get a new Member ID card?');

    fireEvent.click(screen.getByText('How do I get a new Member ID card?'));

    screen.getByText('How do I get a new Member ID card?');

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
