import { ResourceMiniCard } from '@/app/support/components/ResourceMiniCard';
import { questionsIcon } from '@/components/foundation/Icons';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';

let vRules: VisibilityRules = {};
function setVisibilityRules(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.wellnessOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}

const renderUI = () => {
  return render(
    <ResourceMiniCard
      key="Frequently Asked Questions"
      className="basis-auto sm:basis-0 shrink sm:shrink-0 grow"
      icon={<Image src={questionsIcon} alt="" />}
      label="Frequently Asked Questions"
      link="/member/support/FAQ"
      external={false}
      vRules={vRules}
      openInNewWindow={true}
    />,
  );
};

const baseUrl = window.location.origin;

describe('ResourceMiniCard FAQ Link Validation', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Frequently Asked Questions');
    expect(
      screen.getByRole('link', { name: /Frequently Asked Questions/i }),
    ).toHaveProperty('href', `${baseUrl}/member/support/FAQ`);
    expect(component).toMatchSnapshot();
  });

  it('should render the UI correctly - Blue Care', async () => {
    vRules.blueCare = true;
    setVisibilityRules(vRules);
    const component = renderUI();
    expect(
      screen.getByRole('link', { name: /Frequently Asked Questions/i }),
    ).toHaveProperty('href', `https://bluecare.bcbst.com/get-care/faqs`);
    expect(component).toMatchSnapshot();
  });
});
