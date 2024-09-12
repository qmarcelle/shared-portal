import { SideBarModal } from '@/components/foundation/SideBarModal';
import SiteHeader from '@/components/foundation/SiteHeader';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const renderUI = () => {
  return render(
    <div>
      <SideBarModal />
      <SiteHeader />
    </div>,
  );
};

describe('SiteHeader And Navigation Menu', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Primary Profile')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('Primary Profile'));
    await waitFor(() => {
      expect(screen.getByText('Signout')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('Signout'));
    await waitFor(() => {
      expect(screen.queryByText('Signout')).toBeNull();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
