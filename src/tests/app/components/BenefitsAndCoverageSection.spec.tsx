import { render, screen } from '@testing-library/react';
import { BenefitsAndCoverageSection } from '../../../app/dashboard/components/BenefitsAndCoverageSection';

const renderUI = () => {
  return render(
    <BenefitsAndCoverageSection
      className="large-section"
      benefits={[
        {
          benefitName: 'Medical Benefits',
          benefitURL: '#',
        },
        {
          benefitName: 'Pharmacy Benefits',
          benefitURL: '#',
        },
        { benefitName: 'Dental Benefits', benefitURL: '#' },
        { benefitName: 'Vision Benefits', benefitURL: '#' },
        { benefitName: 'Other Benefits', benefitURL: '#' },
      ]}
    />,
  );
};

describe('BenefitsAndCoverageSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Benefits & Coverage' });
    screen.getByText('Browse your benefits by category:');
    screen.getByText('Medical Benefits');
    screen.getByText('Pharmacy Benefits');
    screen.getByText('Dental Benefits');
    screen.getByText('Vision Benefits');
    screen.getByText('Other Benefits');
    screen.getByText('View Benefits & Coverage');

    expect(component).toMatchSnapshot();
  });
});
