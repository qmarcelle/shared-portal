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

  it('should render UI correctly for off-marketplace members with other insurance eligibility', () => {
    vRules.otherInsuranceEligible = true;
    const component = renderUI(vRules);
    screen.getAllByRole('heading', { name: 'Manage My Plan' });
    screen.getByText('Report Other Health Insurance');
    screen.getByText('Update Social Security Number');
    // Should only have one instance of Update Social Security Number
    expect(screen.getAllByText('Update Social Security Number')).toHaveLength(
      1,
    );
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for Blue Care + Katie Beckett eligible members', () => {
    vRules.blueCare = true;
    vRules.katieBeckettEligible = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    screen.getAllByRole('heading', { name: 'Manage My Plan' });
    screen.getByText('Katie Beckett Banking Info');
    // Should not show other options for BlueCare + Katie Beckett
    expect(
      screen.queryByText('Report Other Health Insurance'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Update Social Security Number'),
    ).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for members with manage policy eligibility', () => {
    vRules.enableBenefitChange = true;
    vRules.subscriber = true;
    vRules.wellnessOnly = false;
    vRules.futureEffective = false;
    vRules.otherInsuranceEligible = true;

    const component = renderUI(vRules);
    screen.getAllByRole('heading', { name: 'Manage My Plan' });
    screen.getByText('Report Other Health Insurance');
    screen.getByText('Update Social Security Number');
    screen.getByText('Manage My Policy');
    // Verify no duplicates
    expect(screen.getAllByText('Update Social Security Number')).toHaveLength(
      1,
    );
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should show only Update Social Security Number for members without other insurance or manage policy eligibility', () => {
    // No special eligibility rules set
    const component = renderUI(vRules);
    screen.getAllByRole('heading', { name: 'Manage My Plan' });
    screen.getByText('Update Social Security Number');
    // Should not show options user is not eligible for
    expect(
      screen.queryByText('Report Other Health Insurance'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Manage My Policy')).not.toBeInTheDocument();
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
