import Dashboard from '@/app/dashboard/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<Dashboard />);
};

describe('Dashboard Page', () => {
  it('should render Welcome Banner UI correctly', () => {
    const component = renderUI();
    expect(
      screen.getByText('Plan: BlueCross BlueShield of Tennessee'),
    ).toBeVisible();
    expect(screen.getByText('Policies: Medical, Dental, Vision')).toBeVisible();
    expect(screen.getByText('View Plan Details')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
