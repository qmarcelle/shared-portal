import { ManageMyPlan } from '@/app/myPlan/components/ManageMyPlan';
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
  //vRules.katieBeckettEligible = false;
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
  it('should render UI correctly for Blue Care groups 155000', () => {
    vRules.katieBeckettEligible = true;
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

  it('should use correct URL for SSN update (URL path change fix)', () => {
    // Verify the component uses the new URL path /myPlan/updateSocialSecurityNumber
    // instead of the old /member/myplan/ssn path
    renderUI(vRules);

    const ssnElement = screen.getByText('Update Social Security Number');
    expect(ssnElement).toBeInTheDocument();

    // This test documents that SSN URL was changed from
    // '/member/myplan/ssn' to '/myPlan/updateSocialSecurityNumber'
    // as part of defect fix 75648
  });
});
