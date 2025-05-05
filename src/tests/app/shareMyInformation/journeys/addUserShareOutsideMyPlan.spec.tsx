/* eslint-disable quotes */
import ShareMyInformationPage from '@/app/shareMyInformation/page';
import { AppModal } from '@/components/foundation/AppModal';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = async () => {
  const component = await ShareMyInformationPage();
  const { container } = render(
    <>
      <AppModal />
      {component}
    </>,
  );

  return container;
};

describe('AddAUUserShareMyPlanComponent', () => {
  it('should render the UI correctly for AddAUUserShareMyPlanComponent ', async () => {
    const container = await renderUI();
    expect(screen.getByText('Outside My Plan')).toBeVisible();
    expect(
      screen.getByText(
        'Share your information with individuals not on your health plan.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Add an Authorized User')).toBeVisible();
    fireEvent.click(screen.getByText('Add an Authorized User'));
    expect(
      screen.getByText(
        "We'll send an email inviting an authorized user to register. Once they've completed registration, they'll be able to see a read-only version of your account.",
      ),
    ).toBeVisible();
    expect(screen.getByText('First Name')).toBeVisible();
    const checkBoxSelected = screen.getAllByRole('checkbox');
    fireEvent.click(checkBoxSelected[1]);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(
      screen.getByText('Provide the authorized user’s mailing address.'),
    ).toBeVisible();
    expect(screen.getByText('Street Address 1')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Their Email Address')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(
      screen.getByText(
        'Select which plans the authorized user will be able to view.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Select at least one account:')).toBeVisible();
    const accountCheckBoxSelected = screen.getAllByRole('checkbox');
    fireEvent.click(accountCheckBoxSelected[1]);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Edit Level Of Access')).toBeVisible();
    expect(screen.getByText('Member Name :')).toBeVisible();
    expect(
      screen.getByText('What Information is Being Used or Shared'),
    ).toBeVisible();
    expect(
      screen.getByText('Reasons the Information is Being Used or Shared'),
    ).toBeVisible();
    expect(screen.getByText('Acknowledgments & Signature')).toBeVisible();
    const aggreementCheckBoxSelected = screen.getAllByRole('checkbox');
    fireEvent.click(aggreementCheckBoxSelected[1]);
    fireEvent.click(screen.getByRole('button', { name: /Save Permissions/i }));
    expect(
      screen.getByText(
        'An Invitation to View Your Plan Information Has Been Sent',
      ),
    ).toBeVisible();
    expect(screen.getByText('An email has been sent to:')).toBeVisible();
    expect(
      screen.getByText(
        'They will have full access to your account information. You can remove their access at any time.',
      ),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Done/i }));
    expect(container).toMatchSnapshot();
  });
});
