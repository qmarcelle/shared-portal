import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { OnMyPlanComponent } from '@/components/composite/OnMyPlanComponent';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <AccordionListCard
      header=""
      information={[
        {
          title: 'View Who&apos;s Covered',
          body: (
            <OnMyPlanComponent
              infoIcon={true}
              onMyPlanDetails={[
                {
                  memberName: 'Chris Hall',
                  DOB: '01/01/1978',
                  sharingType: 'Medical / Dental / Vision',
                  isMinor: false,
                },
                {
                  memberName: 'Maddison Hall',
                  DOB: '01/01/2021',
                  sharingType: 'Medical / Dental / Vision',
                  isMinor: false,
                },
                {
                  memberName: 'Forest Hall',
                  DOB: '01/01/2001',
                  sharingType: 'Medical',
                  isMinor: false,
                },
                {
                  memberName: 'Corey Hall',
                  DOB: '01/01/2002',
                  sharingType: 'Medical',
                  isMinor: false,
                },
                {
                  memberName: 'Telly Hall',
                  DOB: '01/01/2008',
                  sharingType: 'Medical',
                  isMinor: false,
                },
              ]}
            />
          ),
        },
      ]}
    ></AccordionListCard>,
  );
};

describe('OnMyPlanComponent', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByText('View Who&apos;s Covered');
    let planContactInformationContent = screen.queryByText('Chris Hall');
    expect(planContactInformationContent).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('View Who&apos;s Covered')); //check that body text is visible after clicking
    planContactInformationContent = screen.getByText('Chris Hall');
    expect(planContactInformationContent).toBeInTheDocument();

    fireEvent.click(screen.getByText('View Who&apos;s Covered')); //check that it is not visible after clicking again
    planContactInformationContent = screen.queryByText('Chris Hall');
    expect(planContactInformationContent).not.toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
