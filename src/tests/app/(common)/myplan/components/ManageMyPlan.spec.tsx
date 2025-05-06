import { ManageMyPlan } from '@/app/(protected)/(common)/member/myplan/components/ManageMyPlan';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

let vRules: VisibilityRules = {};
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
  beforeEach(() => {
    vRules = {};
  });

  it('should render UI correctly for other groups', () => {
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

  it('should render UI correctly for  groups 120800,129800', () => {
    vRules.enableBenefitChange = true;
    vRules.subscriber = true;
    vRules.wellnessOnly = false;
    vRules.futureEffective = false;

    const component = renderUI(vRules);
    screen.getAllByRole('heading', { name: 'Manage My Plan' });
    screen.getByText('Report Other Health Insurance');
    screen.findByAltText(/link/i);
    screen.getByText('Update Social Security Number');
    screen.findByAltText(/link/i);
    screen.getByText('Manage My Policy');
    screen.findByAltText(/link/i);
    expect(component.baseElement).toMatchSnapshot();
  });
});
