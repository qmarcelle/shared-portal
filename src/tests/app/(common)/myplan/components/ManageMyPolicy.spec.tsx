import { ManageMyPlan } from '@/app/(protected)/(common)/member/myplan/components/ManageMyPlan';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
const realLocation = window.location;
//@ts-ignore
delete window.location;
//@ts-ignore
window.location = new URL('https://localhost');
const setHref = jest
  .spyOn(window.location, 'href', 'set')
  .mockImplementation(() => {});
describe('ManageMyPolicy', () => {
  beforeEach(() => {
    vRules = {};
  });
  afterAll(() => {
    window.location = realLocation;
    jest.clearAllMocks();
  });

  it('should render manage my policy UI correctly on click of link button', async () => {
    vRules.enableBenefitChange = true;
    vRules.subscriber = true;
    vRules.wellnessOnly = false;
    vRules.futureEffective = false;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    // //@ts-ignore
    // delete window.location;
    // //@ts-ignore
    // window.location = { href: '' };
    screen.getByText('Manage My Policy');
    await userEvent.click(screen.getByText('Manage My Policy'));
    expect(setHref).toHaveBeenCalledWith('/myPlan/manageMyPolicy');
    screen.getByText(
      'Change your plan benefits, update personal information, add/remove dependents, or cancel your policy.',
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
