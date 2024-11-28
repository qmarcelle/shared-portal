import { ManageMyPlan } from '@/app/myPlan/components/ManageMyPlan';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const vRules: VisibilityRules = {};
const renderUI = (vRules: VisibilityRules) => {
  return render(<ManageMyPlan visibilityRules={vRules} />);
};

function setVisibilityRules(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.wellnessOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}

describe('ManageMyPlan', () => {
  it('should render UI correctly for other groups', () => {
    vRules.blueCare = false;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    screen.getAllByRole('heading', { name: 'Manage My Plan' });
    screen.getByText('Report Other Health Insurance');
    screen.findByAltText(/link/i);
    screen.getByText('Update Social Security Number');
    screen.findByAltText(/link/i);
    screen.getByText('Enroll in a Health Plan');
    screen.findByAltText(/link/i);
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for Blue Care groups', () => {
    vRules.blueCare = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    screen.getAllByRole('heading', { name: 'Manage My Plan' });
    screen.getByText('Katie Beckett Banking Info');
    screen.findByAltText(/link/i);
    expect(component.baseElement).toMatchSnapshot();
  });
});
