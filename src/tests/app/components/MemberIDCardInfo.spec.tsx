import { ImageSlider } from '@/app/memberIDCard/components/ImageSlider';
import { MemberIDCardInfo } from '@/app/memberIDCard/components/MemberIDCardInfo';
import { PlanInfo } from '@/app/memberIDCard/components/PlanInfo';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <MemberIDCardInfo />
      <PlanInfo />
      <ImageSlider />
    </>,
  );
};

describe('Member ID Card Info', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Member ID Card' });
    screen.getByText('View ID Card for:');
    screen.getByText('All members of your plan use the same ID card.');
    screen.getByRole('button', { name: /Download ID Card/i });
    screen.getByRole('button', { name: /Order New ID Card/i });
    screen.getByText('My Plan Details');
    screen.getByText('Benefits & Coverage');
    expect(screen.getAllByText(/../i));
    expect(component).toMatchSnapshot();
  });
});
