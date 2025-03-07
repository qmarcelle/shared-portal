import { ProfileHeaderCardItem } from '@/components/composite/ProfileHeaderCardItem';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <ProfileHeaderCardItem
      profiles={[
        {
          id: '456',
          firstName: 'JENNIE',
          lastName: 'RAMAGE',
          dob: '01/27/1931',
          type: UserRole.MEMBER,
          personFhirId: 'njhgg',
          plans: [],
          selected: true,
        },
        {
          id: '457',
          firstName: 'Robert',
          lastName: 'Hall',
          dob: '01/01/1943',
          type: UserRole.PERSONAL_REP,
          personFhirId: 'nhgvgd',
          plans: [],
        },
        {
          id: '458',
          firstName: 'Ellie',
          lastName: 'Williams',
          dob: '01/01/1943',
          type: UserRole.AUTHORIZED_USER,
          personFhirId: 'bhfksbkjs',
          plans: [],
        },
      ]}
    />,
  );
};

describe('ProfileHeaderCard', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    // Should show selected profile with switch icon
    expect(screen.getByText('My Profile')).toBeVisible();
    expect(screen.getByText('JENNIE RAMAGE')).toBeVisible();
    expect(screen.getByText('DOB: 01/27/1931')).toBeVisible();
    expect(screen.getByAltText('switch')).toBeVisible();

    fireEvent.click(screen.getByText('JENNIE RAMAGE'));
    expect(screen.getByText('Switch to...')).toBeVisible();
    const name = screen.queryAllByText('JENNIE RAMAGE');
    expect(name[1]).toBeInTheDocument();
    expect(screen.queryAllByText('DOB: 01/27/1931')[1]).toBeVisible();
    expect(component).toMatchSnapshot();

    screen.getByText('All Profile Settings');
    screen.getByText('Communication Settings');
    screen.getByText('Security Settings');
    expect(component.baseElement).toMatchSnapshot();
  });
});
