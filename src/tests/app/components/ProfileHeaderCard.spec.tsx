import { ProfileHeaderCardItem } from '@/components/composite/ProfileHeaderCardItem';
import { UserType } from '@/models/user_profile';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <ProfileHeaderCardItem
      profiles={[
        {
          id: '456',
          name: 'JENNIE RAMAGE',
          dob: '01/27/1931',
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
