import { FaqTopics } from '@/app/(protected)/(common)/member/support/faqTopics/components/FaqTopics';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<FaqTopics />);
};

describe('Pharmacy FAQ', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    const benefits = screen.getByRole('button', {
      name: 'Pharmacy',
    });

    fireEvent.click(benefits);
    screen.getByText('Pharmacy FAQ');
    screen.getByText(
      'How to find pharmacies, find prescription drug coverage and more',
    );

    screen.getByRole('heading', {
      name: 'Help with Prescription Drugs',
    });
    screen.getByText('How do I get a prior authorization?');

    screen.getByText('What is a specialty medication?');

    screen.getByText('How do I know if a drug is a specialty drug?');

    screen.getByRole('heading', {
      name: 'Help with Pharmacies & Mail Order',
    });
    screen.getByText('Do I have to use a CVS pharmacy?');

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
