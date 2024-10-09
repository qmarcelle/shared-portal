import NonMemberDashboard from '@/app/dashboard/components/NonMemberDashboard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<NonMemberDashboard />);
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
