import PlanContactInformation from '@/app/myPlan/planContactInformation';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <PlanContactInformation />
    </>,
  );
};

describe('PlanContactInformation', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Plan Contact Information' });

    expect(screen.getByText('Chris Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/1978')).toBeInTheDocument();
    expect(screen.getAllByText('(123) 456-7890'));
    expect(screen.getAllByText('123 Street Address Road City Town, TN 12345'));
    expect(
      screen.getByText(
        'Below is the mailing address and phone number associated with your plan.',
      ),
    );
    expect(
      screen.getByRole('heading', { name: 'About Plan Contact Information' }),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
