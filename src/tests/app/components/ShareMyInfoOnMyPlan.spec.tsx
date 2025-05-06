import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ShareMyInformation from '../../../app/(protected)/(common)/member/shareMyInformation/page';

const renderUI = () => {
  return render(<ShareMyInformation />);
};

describe('ShareMyInfoOnMyPlan', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByRole('heading', { name: 'On My Plan' })).toBeVisible();
    expect(
      screen.getByText(
        'Set the level of access for individuals on your health plan.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Maddison Hall')).toBeVisible();
    expect(screen.getByText('DOB: 01/01/1979')).toBeVisible();
    expect(
      screen.getByText(
        'This is a minor dependent. Sharing permissions aren’t applicable with this account.',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
