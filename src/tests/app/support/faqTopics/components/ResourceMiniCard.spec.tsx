import { ResourceMiniCard } from '@/app/support/components/ResourceMiniCard';
import { findFormIcon, questionsIcon } from '@/components/foundation/Icons';
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
type RenderUIProps = {
  label: string;
  link: string;
  openInNewWindow: boolean;
  icon: React.ReactNode;
  vRules: VisibilityRules;
};
const renderUI = ({
  label,
  link,
  vRules = {},
  icon,
  openInNewWindow = false,
}: RenderUIProps) => {
  return render(
    <ResourceMiniCard
      key={label}
      className="basis-auto sm:basis-0 shrink sm:shrink-0 grow"
      icon={icon}
      label={label}
      link={link}
      external={false}
      vRules={vRules}
      openInNewWindow={openInNewWindow}
    />,
  );
};

const baseUrl = window.location.origin;

describe('ResourceMiniCard FAQ Link Validation', () => {
  beforeEach(() => {
    vRules = {};
  });
  it('should render the UI correctly', async () => {
    const component = renderUI({
      label: 'Frequently Asked Questions',
      link: '/member/support/FAQ',
      vRules: { blueCare: false },
      icon: <Image src={questionsIcon} alt="" />,
      openInNewWindow: false,
    });
    screen.getByText('Frequently Asked Questions');
    expect(
      screen.getByRole('link', { name: /Frequently Asked Questions/i }),
    ).toHaveProperty('href', `${baseUrl}/member/support/FAQ`);
    expect(component).toMatchSnapshot();
  });

  it('should render the UI correctly - Blue Care', async () => {
    setVisibilityRules(vRules);
    const component = renderUI({
      label: 'Frequently Asked Questions',
      link: 'https://bluecare.bcbst.com/get-care/faqs',
      vRules: { blueCare: true },
      icon: <Image src={questionsIcon} alt="" />,
      openInNewWindow: true,
    });
    expect(
      screen.getByRole('link', { name: /Frequently Asked Questions/i }),
    ).toHaveProperty('href', 'https://bluecare.bcbst.com/get-care/faqs');
    expect(component).toMatchSnapshot();
  });

  describe('ResourceMiniCard Find a Form Link Validation', () => {
    it('should render the UI correctly', async () => {
      const component = renderUI({
        label: 'Find a Form',
        link: 'https://www.bcbst.com/use-insurance/documents-forms',
        vRules: { blueCare: false },
        icon: <Image src={findFormIcon} alt="" />,
        openInNewWindow: true,
      });
      screen.getByText('Find a Form');
      expect(screen.getByRole('link', { name: /Find a Form/i })).toHaveProperty(
        'href',
        'https://www.bcbst.com/use-insurance/documents-forms',
      );
      expect(component).toMatchSnapshot();
    });

    it('should render the UI correctly - Blue Care', async () => {
      setVisibilityRules(vRules);
      const component = renderUI({
        label: 'Find a Form',
        link: 'https://bluecare.bcbst.com/get-care/documents-forms',
        vRules: { blueCare: true },
        icon: <Image src={findFormIcon} alt="" />,
        openInNewWindow: true,
      });
      expect(screen.getByRole('link', { name: /Find a Form/i })).toHaveProperty(
        'href',
        'https://bluecare.bcbst.com/get-care/documents-forms',
      );
      expect(component).toMatchSnapshot();
    });
  });
});
