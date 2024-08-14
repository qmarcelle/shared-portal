import { AccordionListCard } from '@/components/composite/AccordionListCard';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { PlanContactInformationSection } from '../../../app/myPlan/components/PlanContactInformationSection';

const renderUI = () => {
  return render(
    <AccordionListCard
      header=""
      information={[
        {
          title: 'View Plan Contact Information',
          body: (
            <PlanContactInformationSection
              title="Below is the phone number and mailing address associated with your plan."
              address="123 Street Address Road City Town, TN 12345"
              primaryPhoneNumber="(123) 456-7890"
              secondaryPhoneNumber="NA"
            />
          ),
        },
      ]}
    ></AccordionListCard>,
  );
};

describe('PlanContactInformation', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByText('View Plan Contact Information');
    let planContactInformationContent = screen.queryByText(
      '123 Street Address Road City Town, TN 12345',
    );
    expect(planContactInformationContent).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('View Plan Contact Information')); //check that body text is visible after clicking
    planContactInformationContent = screen.getByText(
      '123 Street Address Road City Town, TN 12345',
    );
    expect(planContactInformationContent).toBeInTheDocument();

    fireEvent.click(screen.getByText('View Plan Contact Information')); //check that it is not visible after clicking again
    planContactInformationContent = screen.queryByText(
      '123 Street Address Road City Town, TN 12345',
    );
    expect(planContactInformationContent).not.toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
