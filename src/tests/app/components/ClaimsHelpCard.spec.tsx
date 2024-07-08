import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClaimsHelpCard } from '@/components/composite/ClaimsHelpCard';

const renderUI = () => {
  return render(<ClaimsHelpCard />);
};
describe('Claims Help Card', () => {
  it('Claims Help Card', async () => {
    const component = renderUI();
    expect(screen.getByText('Get Help with Claims')).toBeVisible();
    await waitFor(() => {
      expect(
        screen.getByText('If you need help, please reach out to us. You can'),
      ).toBeVisible();
      expect(screen.getByText('start a chat')).toBeVisible();
      expect(screen.getByText('or call us at [1-800-000-000].')).toBeVisible();
      expect(screen.getByText('You can also try our')).toBeVisible();
      expect(screen.getByText('Claims FAQ.')).toBeVisible();
    });
    expect(component).toMatchSnapshot();
  });
});
