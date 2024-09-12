import ProfileSettings from '@/app/inbox/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const renderUI = () => {
  return render(<ProfileSettings />);
};

describe('Display Notification Filter', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Inbox' });
    fireEvent.click(screen.getByText(/Read & Unread/i));
    await waitFor(() => {
      expect(screen.getByText('Read & Unread')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
