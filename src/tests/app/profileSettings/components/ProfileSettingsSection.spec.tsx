import { ProfileSettingsSection } from '@/app/profileSettings/components/ProfileSettingsSection';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<ProfileSettingsSection />);
};

describe('Profile Settings Card Component', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByText('Communication Settings');
    screen.getByText('Update your alert preferences.');
    screen.getByText('Security Settings');
    screen.getByText('Change your password and edit your account security.');
    screen.getByText('Sharing & Permissions');
    screen.getByText('Change your password and edit your account security.');
    expect(component.baseElement).toMatchSnapshot();
  });
});
