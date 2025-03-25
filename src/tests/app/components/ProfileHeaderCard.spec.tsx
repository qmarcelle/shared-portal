import { ProfileHeaderCardItem } from '@/components/composite/ProfileHeaderCardItem';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <ProfileHeaderCardItem
      profileSetting="All Profile Settings"
      communicationSetting="Communication Settings"
      securitySetting="Security Settings"
      sharingAndPermissions="Sharing & Permissions"
      profiles={[
        {
          id: '456',
          name: 'Chris Hall',
          dob: '11/03/2000',
          type: 'Primary',
        },
      ]}
    />,
  );
};

describe('ProfileHeaderCard', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    // Should show selected profile with switch icon
    expect(screen.getByText('Primary Profile')).toBeVisible();
    expect(screen.getByText('Chris Hall')).toBeVisible();
    expect(screen.getByText('DOB: 11/03/2000')).toBeVisible();
    expect(screen.getByAltText('switch')).toBeVisible();
    expect(component).toMatchSnapshot();

    screen.getByText('All Profile Settings');
    screen.getByText('Communication Settings');
    screen.getByText('Security Settings');
    screen.getByText('Sharing & Permissions');
    expect(component.baseElement).toMatchSnapshot();
  });
});
