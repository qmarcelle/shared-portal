import SiteHeader from '@/components/foundation/SiteHeader';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <SiteHeader />
    </>,
  );
};
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
    };
  },
}));
describe('QuciktipVirtualCareOptionLink', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    fireEvent.click(screen.getAllByText('My Health')[0]);
    const baseUrl = window.location.origin;
    expect(
      screen.getAllByRole('link', {
        name: 'Quick Tip Looking for a virtual care provider for mental health or physical therapy? View Virtual Care Options. Page Arrow',
      })[0],
    ).toHaveProperty('href', `${baseUrl}/virtualCareOptions`);
    expect(component).toMatchSnapshot();
  });
});
