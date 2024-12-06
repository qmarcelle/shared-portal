import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ViewOtherPlanInformation } from '../../../app/myPlan/components/ViewOtherPlanInformation';
import { VisibilityRules } from '@/visibilityEngine/rules';

const vRules: VisibilityRules = {};
const renderUI = (vRules: VisibilityRules) => {
  return render(<ViewOtherPlanInformation visibilityRules={vRules} />);
};

function setVisibilityRules(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.wellnessOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}

describe('Other Plan Information Component', () => {
  it('should render UI correctly for other groups', () => {
    vRules.blueCare = false;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    screen.getByText('Benefits & Coverage');
    screen.getByText('Claims');
    screen.getByText('Prior Authorizations');
    screen.getByText('Spending Accounts');
    screen.getByText('Spending Summary');
    screen.getByText('Plan Documents');

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for Blue Care groups', () => {
    vRules.blueCare = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    screen.getByText('Benefits & Coverage');
    screen.getByText('Claims');
    screen.getByText('Prior Authorizations');
    screen.getByText('Member Handbook');
    expect(component.baseElement).toMatchSnapshot();
  });
});
