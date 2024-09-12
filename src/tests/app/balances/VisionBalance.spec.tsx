import { VisionBalance } from '@/app/balances/components/VisionBalance';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <VisionBalance className="large-section" linkURL="/dashboard" />,
  );
};

describe('VisionBalance', () => {
  it('should render the UI correctly', async () => {
    renderUI();
    expect(screen.getByText('Vision Balance')).toBeVisible();
    expect(screen.getByText('visit EyeMed')).toBeVisible();
  });
});
