import { ProfileSettingsSection } from '@/app/profileSettings/components/ProfileSettingsSection';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

let vRules: VisibilityRules = {};
const renderUI = (vRules: VisibilityRules) => {
  return render(<ProfileSettingsSection visibilityRules={vRules} />);
};

describe('Profile Settings Card Component', () => {
  beforeEach(() => {
    vRules = {};
  });

  it('should render UI correctly for Active Members', () => {
    vRules.terminated = false;
    vRules.futureEffective = false;
    const component = renderUI(vRules);
    screen.getByText('Communication Settings');
    screen.getByText('Update your alert preferences.');
    screen.getByText('Security Settings');
    screen.getByText('Change your password and edit your account security.');
    screen.getByText('Sharing & Permissions');
    screen.getByText('View or edit access to plan information.');
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for Terminated and Future Effective members', () => {
    vRules.terminated = true;
    vRules.futureEffective = false;
    const component = renderUI(vRules);
    screen.getByText('Sharing & Permissions');
    screen.getByText('View or edit access to plan information.');
    expect(component.baseElement).toMatchSnapshot();
  });
});
