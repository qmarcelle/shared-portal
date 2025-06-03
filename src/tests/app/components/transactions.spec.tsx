import Transactions from '@/app/spendingAccounts/transactions/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<Transactions />);
};

describe('Third Party Sharing Info Component', () => {
  it('should render UI correctly', () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Transactions' });
    screen.getAllByText('To manage your health spending account details');

    expect(component.baseElement).toMatchSnapshot();
  });
});
