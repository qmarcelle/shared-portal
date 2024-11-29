import PharmacyPage from '@/app/pharmacy/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock useRouter:
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: mockPush,
    };
  },
}));

const renderUI = async () => {
  const result = await PharmacyPage();
  return render(result);
};

describe('Pharmacy Page', () => {
  it('should render the page correctly', async () => {
    const { container } = await renderUI();
    expect(screen.getByText('My Recent Pharmacy Claims')).toBeVisible();
    expect(screen.getByText('View All Pharmacy Claims')).toBeVisible();
    fireEvent.click(screen.getByText(/View All Pharmacy Claims/i));
    expect(mockPush).toHaveBeenCalledWith('/claimSnapshotList');
    fireEvent.click(screen.getByText(/123 Pharmacy/i));
    expect(mockPush).toHaveBeenCalledWith('/pharmacy/pharmacyClaims');
    fireEvent.click(screen.getByText(/565 Pharmacy/i));
    expect(mockPush).toHaveBeenCalledWith('/pharmacy/pharmacyClaims');
    fireEvent.click(screen.getByText(/890 Pharmacy/i));
    expect(mockPush).toHaveBeenCalledWith('/pharmacy/pharmacyClaims');
    expect(container).toMatchSnapshot();
  });
});
