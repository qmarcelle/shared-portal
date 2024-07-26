import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ViewOtherPlanInformation } from '../../../app/(main)/myPlan/components/ViewOtherPlanInformation';

const renderUI = () => {
  return render(<ViewOtherPlanInformation />);
};

describe('Profile Settings Card Component', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByText('Benefits & Coverage');
    screen.getByText('Claims');
    screen.getByText('Prior Authorizations');
    screen.getByText('Spending Accounts');
    screen.getByText('Spending Summary');
    screen.getByText('Plan Documents');

    expect(component.baseElement).toMatchSnapshot();
  });
});
