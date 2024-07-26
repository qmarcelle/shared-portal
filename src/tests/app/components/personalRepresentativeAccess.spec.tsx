import PersonalRepresentativeAccess from '@/app/(main)/personalRepresentativeAccess/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const renderUI = () => {
  return render(<PersonalRepresentativeAccess />);
};

describe('PersonalRepresentativeAccess', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(
      screen.getByRole('heading', { name: 'Members You Represent' }),
    ).toBeVisible();
    expect(screen.getByText('Robert Hall')).toBeVisible();
    expect(screen.getByText('DOB: 01/01/1943')).toBeVisible();
    expect(screen.getAllByText('Full Access'));
    expect(screen.getAllByText('[Mature Minor]'));
    expect(screen.getByText('DOB: 01/01/2008')).toBeVisible();
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
    fireEvent.click(screen.getByText(/Request Full Access/i));
    await waitFor(() => {
      expect(screen.getAllByText('[Mature Minor]'));
    });
    expect(component).toMatchSnapshot();
  });
});
