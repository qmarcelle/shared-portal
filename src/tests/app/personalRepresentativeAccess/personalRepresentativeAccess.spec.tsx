import PersonalRepresentativeAccess from '@/app/personalRepresentativeAccess/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const renderUI = () => {
  return render(<PersonalRepresentativeAccess />);
};

describe('PersonalRepresentativeAccess', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Personal Representative Access')).toBeVisible();
    expect(
      screen.getByText(
        /Personal representatives have the legal authority to make health care decisions on behalf of the member/i,
      ),
    ).toBeVisible();
    expect(screen.getByText('Understanding Access')).toBeVisible();
    expect(screen.getAllByText('Full Access'));
    expect(screen.getAllByText('[Mature Minor]'));
    expect(screen.getByText('DOB: 01/01/2008')).toBeVisible();
    expect(screen.getAllByText('Update')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Basic Access as of 01/01/2024'));
    expect(
      screen.getAllByText('This member has not created an online profile.'),
    );
    fireEvent.click(screen.getByText(/Invite To Register/i));
    await waitFor(() => {
      expect(screen.getByText('Invite to Register')).toBeVisible();
    });
    expect(screen.getAllByText('[Mature Minor]'));
    expect(screen.getByText('DOB: 01/01/2009')).toBeVisible();
    expect(screen.getAllByText('Basic Access as of 01/01/2024'));

    expect(component).toMatchSnapshot();
  });
});
