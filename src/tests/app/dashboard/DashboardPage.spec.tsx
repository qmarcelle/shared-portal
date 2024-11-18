import Dashboard from '@/app/dashboard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <Dashboard
      visibilityRules={undefined}
      data={{
        username: 'James Kilney',
      }}
    />,
  );
};

describe('Dashboard Page', () => {
  it('should render Welcome Banner UI correctly', () => {
    const component = renderUI();
    expect(screen.getByText('Plan:')).toBeVisible();
    expect(screen.getByText('BlueCross BlueShield of Tennessee')).toBeVisible();
    expect(screen.getByText('Policies:')).toBeVisible();
    expect(screen.getByText('Medical, Dental, Vision')).toBeVisible();
    expect(screen.getByText('View Plan Details')).toBeVisible();
    expect(screen.getByText('View Claims')).toBeVisible();
    expect(screen.getByText('View Prior Authorizations')).toBeVisible();
    expect(screen.getByText('View Balances')).toBeVisible();
    expect(screen.getByText('View Benefits & Coverage')).toBeVisible();
    expect(screen.getByText('View Employer Provided Benefits')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
