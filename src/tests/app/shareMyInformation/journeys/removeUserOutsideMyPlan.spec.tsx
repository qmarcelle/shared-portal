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

describe('RemoveAUUserShareMyPlanComponent', () => {
  it('should render the UI correctly for RemoveAUUserShareMyPlanComponent ', async () => {
    const container = await renderUI();
    expect(screen.getByText('Outside My Plan')).toBeVisible();
    expect(
      screen.getByText(
        'Share your information with individuals not on your health plan.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Jill Valentine')).toBeVisible();
    expect(screen.getByText('Full Access')).toBeVisible();
    expect(screen.getByText('Remove Access')).toBeVisible();
    expect(screen.getByText('Add an Authorized User')).toBeVisible();
    fireEvent.click(screen.getByText('Remove Access'));
    expect(screen.getByText("You're removig access for:")).toBeVisible();
    expect(screen.getByText('Remove Authorized Access')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Remove Access/i }));
    expect(screen.getByText('Access Removed')).toBeVisible();
    expect(
      screen.getByText(
        'Access to your account information has beed successfully removed for:',
      ),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Done/i }));
    expect(container).toMatchSnapshot();
  });
});
