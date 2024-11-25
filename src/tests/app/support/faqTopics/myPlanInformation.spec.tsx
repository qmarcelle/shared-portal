import { FaqTopics } from '@/app/support/faqTopics/components/FaqTopics';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<FaqTopics />);
};

describe('My Plan Information FAQ', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    const benefits = screen.getByRole('button', {
      name: 'My Plan Information',
    });

    fireEvent.click(benefits);
    screen.getByText('How to update your address, dependents, and more.');

    screen.getByRole('heading', {
      name: 'Updating Plan Information',
    });
    screen.getByText(
      'How do I update personal info like my address, last name or payment information?',
    );
    screen.getByText('How do I add or remove a dependent?');
    screen.getByText(
      'How do I pay my premium or change my payment information?',
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
    screen.getByText('Sharing, Permissions & Security');

    expect(component).toMatchSnapshot();
  });
});
