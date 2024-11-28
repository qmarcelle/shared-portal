import { render, screen } from '@testing-library/react';
import { PlanDetailsSection } from '../../../app/myPlan/components/PlanDetailsSection';
import { VisibilityRules } from '@/visibilityEngine/rules';

const vRules: VisibilityRules = {};
const renderUI = (vRules: VisibilityRules) => {
  render(<PlanDetailsSection svgData={null} visibilityRules={vRules} />);
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
    screen.getByText('Plan Type:');
    screen.getByText(
      'High Deductible Health Plan with Health Savings Account (HDHP-HSA)',
    );
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
