import { FormRequestCard } from '@/app/1095BFormRequest/components/FormRequestCard';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

let vRules: VisibilityRules = {};

const renderUI = async (vRules: VisibilityRules) => {
  return render(<FormRequestCard visibilityRules={vRules} />);
};

describe('1095BFormRequest Page', () => {
  beforeEach(() => {
    vRules = {};
  });
  it('should render 1095BFormRequest Eligible UI correctly', async () => {
    vRules.prevYearMedical = true;
    vRules.prevYearFullyInsured = true;
    vRules.offMarketGrp = true;

    const component = await renderUI(vRules);

    screen.getByText('Request a 1095-B Form');
    screen.getByText(
      // eslint-disable-next-line quotes
      "Please confirm the following information. If our files show that you lived in California, Maryland, New Jersey, Rhode Island, Vermont, or Washington D.C last year, you don't have to request a 1095-B. We'll mail one to you.",
    );

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render 1095BFormRequest Ineligible UI correctly when member does not have medical in the previous year', async () => {
    vRules.prevYearMedical = false;
    vRules.prevYearFullyInsured = true;
    vRules.offMarketGrp = true;

    const component = await renderUI(vRules);

    screen.getByText('Request a 1095-B Form');
    screen.getByText(
      // eslint-disable-next-line quotes
      "We're sorry, but we don't supply a 1095-B form for the type of coverage you have.",
    );
    screen.getByText('1 Cameron Hill Circle');
    screen.getByText('Chattanooga, TN 37402');

    expect(component.baseElement).toMatchSnapshot();
  });
});
