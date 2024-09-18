import WellframeSection from '@/app/healthyMaternity/components/WellframeSection';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<WellframeSection />);
};

describe('WellframeSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(
      screen.getByText(
        'Wellframe is an independent company that provides services for BlueCross BlueShield of Tennessee.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Participation is optional.')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
