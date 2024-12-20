import ProfileSettings from '@/app/inbox/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await ProfileSettings();
  return render(page);
};

describe('Display Notification Filter', () => {
  it('should render UI correctly', async () => {
    const component = await renderUI();
    screen.getByRole('heading', { name: 'Inbox' });
    expect(component.baseElement).toMatchSnapshot();
  });
});
