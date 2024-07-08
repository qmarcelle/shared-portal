import { AccordionListCard } from '@/components/composite/AccordionListCard';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <AccordionListCard
      header="Understanding Sharing My Information"
      information={[
        {
          title: 'Full Sharing',
          body: (
            <div className="m-1">
              The information we will disclose may reveal other sensitive health
              information about the Member, including information about
              treatment for substance use disorders (drugs/alcohol), mental or
              behavioral health disorders, HIV/AIDS, sexually transmitted
              diseases (STDs), communicable diseases, developmental or
              intellectual disabilities, genetic disorders (including genetic
              testing for such disorders and genetic history) or other sensitive
              information.
            </div>
          ),
        },
        {
          title: 'Basic Sharing',
          body: (
            <div className="m-1">
              By choosing this option, you will be sharing limited information
              from your account such as benefits and coverage, claims and doctor
              visits, pharmacy and prescriptions.
            </div>
          ),
        },
        {
          title: 'None',
          body: (
            <div className="m-1">
              No access to your claims, documents, prescriptions or account
              information.
            </div>
          ),
        },
      ]}
    ></AccordionListCard>,
  );
};

describe('UnderstandingShareInfo', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', {
      name: 'Understanding Sharing My Information',
    });
    screen.getByText('Full Sharing');
    let fullSharingBody = screen.queryByText(
      'The information we will disclose may reveal other sensitive health information about the Member, including information about treatment for substance use disorders (drugs/alcohol), mental or behavioral health disorders, HIV/AIDS, sexually transmitted diseases (STDs), communicable diseases, developmental or intellectual disabilities, genetic disorders (including genetic testing for such disorders and genetic history) or other sensitive information.',
    );
    expect(fullSharingBody).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Full Sharing')); //check that body text is visible after clicking
    fullSharingBody = screen.getByText(
      'The information we will disclose may reveal other sensitive health information about the Member, including information about treatment for substance use disorders (drugs/alcohol), mental or behavioral health disorders, HIV/AIDS, sexually transmitted diseases (STDs), communicable diseases, developmental or intellectual disabilities, genetic disorders (including genetic testing for such disorders and genetic history) or other sensitive information.',
    );
    expect(fullSharingBody).toBeInTheDocument();

    fireEvent.click(screen.getByText('Full Sharing')); //check that it is not visible after clicking again
    fullSharingBody = screen.queryByText(
      'The information we will disclose may reveal other sensitive health information about the Member, including information about treatment for substance use disorders (drugs/alcohol), mental or behavioral health disorders, HIV/AIDS, sexually transmitted diseases (STDs), communicable diseases, developmental or intellectual disabilities, genetic disorders (including genetic testing for such disorders and genetic history) or other sensitive information.',
    );
    expect(fullSharingBody).not.toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
