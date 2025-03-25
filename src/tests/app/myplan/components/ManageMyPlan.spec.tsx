import { ManageMyPlan } from '@/app/myPlan/components/ManageMyPlan';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <ManageMyPlan
      managePlanItems={[
        {
          title: 'Report Other Health Insurance',
          body: 'Do you or anyone else on your plan have other insurance? Let us know so we can process your claims correctly.',
          externalLink: false,
          url: 'url',
        },
        {
          title: 'Enroll in a Health Plan',
          body: 'All our plans include a wide choice of doctors and healthy, money-saving extras. We’ll walk you through your options and help you choose the right one for your family.',
          externalLink: true,
          url: 'url',
        },
      ]}
    />,
  );
};

describe('ManageMyPlan', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getAllByRole('heading', { name: 'Manage My Plan' });

    screen.getByText('Report Other Health Insurance');
    screen.findByAltText(/link/i);

    screen.getByText('Enroll in a Health Plan');
    screen.findByAltText(/link/i);

    expect(component.baseElement).toMatchSnapshot();
  });
});
