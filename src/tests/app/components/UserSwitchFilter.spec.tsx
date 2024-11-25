import { UserSwitchFilter } from '@/components/composite/UserSwitchFilter';
import { UserProfile, UserType } from '@/models/user_profile';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// Mock useRouter:
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderUI = (profiles: UserProfile[], selectedProfile: UserProfile) => {
  return render(
    <UserSwitchFilter
      userProfiles={profiles}
      selectedUser={{
        id: '456',
        name: 'Chris Hall',
        dob: '11/03/2000',
        type: UserType.Primary,
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
          dob: '01/01/1978',
          type: UserType.Primary,
        },
        {
          id: '457',
          name: 'Robert Hall',
          dob: '01/01/1943',
          type: UserType.PersonalRepresentative,
        },
        {
          id: '458',
          name: 'Ellie Williams',
          dob: '01/01/1943',
          type: UserType.AuthorizedUser,
        },
      ],
      {
        id: '456',
        name: 'Chris Hall',
        dob: '01/01/1978',
        type: UserType.Primary,
      },
    );

    // Should show selected profile with switch icon
    expect(screen.getByText('My Profile')).toBeVisible();
    expect(screen.getByText('Chris Hall')).toBeVisible();

    expect(container).toMatchSnapshot();

    // Should show the dropdown when clicked
    fireEvent.click(screen.getByText('My Profile'));
    expect(screen.getByText('Switch to...')).toBeVisible();

    // Should show all profiles
    expect(screen.getByText('Robert Hall')).toBeVisible();
    expect(screen.getByText('view as Personal Representative')).toBeVisible();
    expect(screen.getByText('view as Authorized User')).toBeVisible();
    expect(screen.getByText('Ellie Williams')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('should render UI correctly when click on personal representative available', () => {
    // Should show selected profile with no switch icon
    const { container } = renderUI(
      [
        {
          id: '456',
          name: 'Chris Hall',
          dob: '01/01/1978',
          type: UserType.Primary,
        },
        {
          id: '457',
          name: 'Robert Hall',
          dob: '01/01/1943',
          type: UserType.PersonalRepresentative,
        },
        {
          id: '458',
          name: 'Ellie Williams',
          dob: '01/01/1943',
          type: UserType.AuthorizedUser,
        },
      ],
      {
        id: '456',
        name: 'Chris Hall',
        dob: '01/01/1978',
        type: UserType.Primary,
      },
    );
    fireEvent.click(screen.getByText('My Profile'));
    expect(screen.getByText('view as Personal Representative')).toBeVisible();

    fireEvent.click(screen.getByText('view as Authorized User'));
    expect(screen.getByText('viewing as Authorized User')).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
