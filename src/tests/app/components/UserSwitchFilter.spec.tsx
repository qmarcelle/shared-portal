import { UserSwitchFilter } from '@/components/composite/UserSwitchFilter';
import { UserProfile } from '@/models/user_profile';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderUI = (profiles: UserProfile[], selectedProfile: UserProfile) => {
  return render(
    <UserSwitchFilter
      userProfiles={profiles}
      selectedUser={{
        id: '456',
        name: 'Chris Hall',
        dob: '11/03/2000',
        type: 'Primary',
      }}
      onSelectionChange={() => {}}
    />,
  );
};

describe('UserSwitchFilter', () => {
  it('should render the UI correctly for more that one options', async () => {
    const { container } = renderUI(
      [
        {
          id: '456',
          name: 'Chris Hall',
          dob: '11/03/2000',
          type: 'Primary',
        },
        {
          id: '453',
          name: 'Alba Hall',
          dob: '11/08/1996',
        },
        {
          id: '434',
          name: 'Elly Hall',
          dob: '12/08/1998',
        },
        {
          id: '2345',
          name: 'Jake Hall',
          dob: '7/08/1991',
        },
        {
          id: '23452',
          name: 'Trama Hall',
          dob: '7/08/2004',
        },
      ],
      {
        id: '456',
        name: 'Chris Hall',
        dob: '11/03/2000',
        type: 'Primary',
      },
    );

    // Should show selected profile with switch icon
    expect(screen.getByText('Primary Profile')).toBeVisible();
    expect(screen.getByText('Chris Hall')).toBeVisible();
    expect(screen.getByText('DOB: 11/03/2000')).toBeVisible();
    expect(screen.getByAltText('switch')).toBeVisible();

    expect(container).toMatchSnapshot();

    // Should show the dropdown when clicked
    fireEvent.click(screen.getByText('Primary Profile'));
    expect(screen.getByText('Switch to...')).toBeVisible();
    expect(screen.getByAltText('switch')).toBeVisible();
    // Should show all profiles
    expect(screen.getByText('Elly Hall')).toBeVisible();
    expect(screen.getByText('DOB: 12/08/1998')).toBeVisible();

    expect(container).toMatchSnapshot();
  });

  it('should render UI correctly when no switch is available', () => {
    const { container } = renderUI(
      [
        {
          id: '456',
          name: 'Chris Hall',
          dob: '11/03/2000',
          type: 'Primary',
        },
      ],
      {
        id: '456',
        name: 'Chris Hall',
        dob: '11/03/2000',
        type: 'Primary',
      },
    );

    // Should show selected profile with no switch icon
    expect(screen.getByText('Primary Profile')).toBeVisible();
    expect(screen.getByText('Chris Hall')).toBeVisible();
    expect(screen.getByText('DOB: 11/03/2000')).toBeVisible();

    expect(container.firstChild).toHaveClass('disabled');

    expect(container).toMatchSnapshot();
  });
});
