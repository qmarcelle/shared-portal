import { VisibilityRules } from '@/visibilityEngine/rules';
import { render, screen } from '@testing-library/react';
import { PlanDetailsSection } from '../../../app/myPlan/components/PlanDetailsSection';

const vRules: VisibilityRules = {};
const renderUI = (vRules: VisibilityRules) => {
  render(
    <PlanDetailsSection
      svgData={null}
      planType="BlueCare Medicaid"
      visibilityRules={vRules}
      planData={[]}
    />,
  );
};

function setVisibilityRules(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.wellnessOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}

describe('PlanDetailsSection', () => {
  it('should render the UI correctly for other groups', async () => {
    vRules.blueCare = false;
    setVisibilityRules(vRules);

    const component = renderUI(vRules);
    screen.getByRole('heading', { name: 'Plan Details' });
    screen.getByText('All members of your plan use the same ID card.');
    screen.getByText('View More ID Card Options');
    expect(component).toMatchSnapshot();
  });

  it('should render the UI correctly for Blue Care groups', async () => {
    vRules.blueCare = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    screen.getByRole('heading', { name: 'Plan Details' });
    screen.getByText('Plan Type:');
    screen.getByText('BlueCare Medicaid');
    screen.getByText('View More ID Card Options');
    expect(component).toMatchSnapshot();
  });
});
