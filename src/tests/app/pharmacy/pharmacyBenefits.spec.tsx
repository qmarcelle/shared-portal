import Pharmacy from '@/app/pharmacy';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { render, screen } from '@testing-library/react';

// Mock useRouter:
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
}));

let vRules: VisibilityRules = {};
const renderUI = (vRules: VisibilityRules) => {
  return render(<Pharmacy visibilityRules={vRules} data={''} />);
};

function setVisibilityRules(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.wellnessOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}
describe('Pharmacy Benefits', () => {
  beforeEach(() => {
    vRules = {};
  });
  it('should render the UI correctly', async () => {
    vRules.blueCare = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    screen.getByRole('heading', { name: 'Pharmacy Benefits' });
    screen.getAllByText(
      'You have a pharmacy card just for your prescription drugs. Here are some helpful things to know:',
    );
    screen.getAllByText(
      'Coverage and claims for prescriptions are managed by your pharmacy benefit manager. That’s an independent company that specializes in these services.',
    );
    expect(
      screen.getAllByRole('link', {
        name: 'visit TennCare’s site for more info external',
      })[0],
    ).toHaveProperty(
      'href',
      'https://www.tn.gov/tenncare/members-applicants/pharmacy.html',
    );
    expect(component).toMatchSnapshot();
  });
});
