import { FaqTopics } from '@/app/support/faqTopics/components/FaqTopics';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<FaqTopics />);
};

describe('Claims FAQ', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    const claims = screen.getByRole('button', {
      name: 'Claims',
    });

    fireEvent.click(claims);
    screen.getByText('Learn more about claims or how to file a dispute.');

    screen.getByRole('heading', {
      name: 'Understanding Claims',
    });
    screen.getByText('What is a claim?');
    fireEvent.click(screen.getByText('What is a claim?'));
    screen.getByText(
      'When you get care from a doctor or other health care provider, they send us a bill called a claim. Your claim summary helps you see what the provider billed, what we paid, and what your share of the cost is.',
    );

    screen.getByRole('heading', {
      name: 'Disputing Claims',
    });
    screen.getByText('Do you think we made a mistake?');
    fireEvent.click(screen.getByText('Do you think we made a mistake?'));
    screen.getByText(
      'We do everything we can to make sure we’ve paid your claim the right way, based on your benefits. If you don’t agree with the decision we made, you have a right to tell us why and ask us to reconsider. This is called an appeal (sometimes we call it a grievance). Everyone has the right to an appeal, but the type of plan you have makes a difference in how those rights work.',
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
