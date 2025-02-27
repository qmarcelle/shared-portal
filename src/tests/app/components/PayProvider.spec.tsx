import { PayProvider } from '@/app/claims/components/PayProvider';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<PayProvider balanceAmount={30.24} />);
};

describe('PayProvider', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Mark as Paid')).toBeVisible();
    expect(screen.getByText('$30.24')).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
