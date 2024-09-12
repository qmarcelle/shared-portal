import { DownloadSummary } from '@/components/composite/DownloadSummary';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const renderUI = () => {
  return render(<DownloadSummary />);
};
describe('Download Summary Card', () => {
  it('Download Summary Card', async () => {
    const component = renderUI();
    expect(screen.getByText('Download Summary')).toBeVisible();
    await waitFor(() => {
      expect(
        screen.getByText(
          'You can print your claim summary from the downloaded pdf.',
        ),
      ).toBeVisible();
    });
    expect(component).toMatchSnapshot();
  });
});
