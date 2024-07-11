import { PriorAuthSection } from '../../../app/dashboard/components/PriorAuthSection';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  render(
    <PriorAuthSection
      className="large-section"
      priorauth={[
        {
          priorAuthStatus: 'Processed',
          priorAuthType: 'Medical',
          member: 'Chris Hall',
          priorAuthName: 'John Doe',
          dateOfVisit: '02/06/2024',
        },
      ]}
    />,
  );
};

describe('PriorAuthSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Prior Authorization' });
    screen.getByText('Processed');
    screen.getByText('Visited on 02/06/2024, For Chris Hall');
    screen.getByText('View All Prior Authorization');

    expect(component).toMatchSnapshot();
  });
});
