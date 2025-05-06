import NonMemberDashboard from '@/app/(protected)/(common)/member/dashboard/components/NonMemberDashboard';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const mockUserProfiles: UserProfile[] = [
  {
    dob: '08/07/2002',
    firstName: 'Chris',
    lastName: 'Hall',
    id: '76547r664',
    personFhirId: '787655434',
    selected: true,
    type: UserRole.NON_MEM,
    plans: [
      {
        memCK: '65765434',
        patientFhirId: '656543456',
        selected: true,
      },
    ],
  },
  {
    dob: '01/01/1943',
    firstName: 'Robert',
    lastName: 'Hall',
    id: '76547r664',
    personFhirId: '787655434',
    selected: true,
    type: UserRole.PERSONAL_REP,
    plans: [
      {
        memCK: '65765434',
        patientFhirId: '656543456',
        selected: true,
      },
    ],
  },
];

const renderUI = () => {
  return render(<NonMemberDashboard profiles={mockUserProfiles} />);
};

describe('NonMemberDashboard', () => {
  it('should render UI correctly', () => {
    const component = renderUI();
    expect(
      screen.getByRole('heading', { name: 'Switch Account' }),
    ).toBeVisible();
    expect(screen.getByText('Select the account to switch to:')).toBeVisible();
    expect(screen.getByText('View as Personal Representative:')).toBeVisible();
    expect(screen.getByText('DOB:')).toBeVisible();
    expect(screen.getByText('01/01/1943')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Related Links' }),
    ).toBeVisible();
    expect(screen.getByText(/Access Others' Information/)).toBeVisible();
    expect(
      screen.getByText(/View or request access to others' plan information./),
    ).toBeVisible();
    expect(screen.getByText('Personal Representative Access')).toBeVisible();
    expect(
      screen.getByText(
        'A personal representative is an individual with the legal authority to make decisions for others, such as minor dependent or other dependent individual.',
      ),
    ).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
