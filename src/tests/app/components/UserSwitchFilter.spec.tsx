import { UserSwitchFilter } from '@/components/composite/UserSwitchFilter';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
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
        firstName: 'Chris',
        lastName: 'Hall',
        dob: '11/03/2000',
        type: UserRole.MEMBER,
        personFhirId: 'jhbb',
        plans: [],
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
          firstName: 'Chris',
          lastName: 'Hall',
          dob: '01/01/1978',
          type: UserRole.MEMBER,
          personFhirId: 'bghvb',
          plans: [],
        },
        {
          id: '457',
          firstName: 'Robert',
          lastName: 'Hall',
          dob: '01/01/1943',
          type: UserRole.PERSONAL_REP,
          personFhirId: 'bhgcdsa',
          plans: [],
        },
        {
          id: '458',
          firstName: 'Ellie',
          lastName: 'Williams',
          dob: '01/01/1943',
          type: UserRole.AUTHORIZED_USER,
          personFhirId: 'mckdsca',
          plans: [],
        },
      ],
      {
        id: '456',
        firstName: 'Chris',
        lastName: 'Hall',
        dob: '01/01/1978',
        type: UserRole.MEMBER,
        personFhirId: 'nhgvbg',
        plans: [],
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
    expect(screen.getByText('View as Personal Representative')).toBeVisible();
    expect(screen.getByText('View as Authorized User')).toBeVisible();
    expect(screen.getByText('Ellie Williams')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('should render UI correctly when click on personal representative available', () => {
    // Should show selected profile with no switch icon
    const { container } = renderUI(
      [
        {
          id: '456',
          firstName: 'Chris',
          lastName: 'Hall',
          dob: '01/01/1978',
          type: UserRole.MEMBER,
          personFhirId: 'bhgvsfg',
          plans: [],
        },
        {
          id: '457',
          firstName: 'Robert',
          lastName: 'Hall',
          dob: '01/01/1943',
          type: UserRole.PERSONAL_REP,
          personFhirId: 'hcsda',
          plans: [],
        },
        {
          id: '458',
          firstName: 'Ellie',
          lastName: 'Williams',
          dob: '01/01/1943',
          type: UserRole.AUTHORIZED_USER,
          personFhirId: 'bhcgbdh',
          plans: [],
        },
      ],
      {
        id: '456',
        firstName: 'Chris',
        lastName: 'Hall',
        dob: '01/01/1978',
        type: UserRole.MEMBER,
        personFhirId: 'hgbhh',
        plans: [],
      },
    );
    fireEvent.click(screen.getByText('My Profile'));
    expect(screen.getByText('View as Personal Representative')).toBeVisible();

    fireEvent.click(screen.getByText('View as Authorized User'));
    expect(screen.getByText('Viewing as Authorized User')).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
