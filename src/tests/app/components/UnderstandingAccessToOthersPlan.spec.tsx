import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { Column } from '@/components/foundation/Column';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <AccordionListCard
      header="Understanding Access to Others' Plans"
      information={[
        {
          title: 'How to Get Access to Others&apos; Plans',
          body: (
            <Column className="m-1">
              Access to view members&apos; plan information is by invitation
              only. You&apos;ll receive an email if you&apos;ve been given
              access to an individual&apos;s plan.
            </Column>
          ),
        },
        {
          title: 'How to View Others&apos; Plans',
          body: (
            <Column className="m-1">
              Once you&apos;ve been invited to view the information of
              another&apos;s health plan, you can switch to their plan anytime
              using the profile button in the top right corner.
            </Column>
          ),
        },
      ]}
    ></AccordionListCard>,
  );
};

describe('UnderstandingAccessToOthersPlan', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', {
      name: /Understanding Access to Others' Plans/i,
    });

    fireEvent.click(
      screen.getByText('How to Get Access to Others&apos; Plans'),
    );

    screen.queryByText(
      'Access to view members&apos; plan information is by invitation only. You&apos;ll receive an email if you&apos;ve been given access to an individual&apos;s plan.',
    );

    fireEvent.click(screen.getByText('How to View Others&apos; Plans'));
    screen.queryByText(
      'Once you&apos;ve been invited to view the information of another&apos;s health plan, you can switch to their plan anytime using the profile button in the top right corner.',
    );

    expect(component.baseElement).toMatchSnapshot();
  });
});
