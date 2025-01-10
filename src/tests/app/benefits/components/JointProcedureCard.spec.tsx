import { JointProcedureCard } from '@/app/benefits/components/JointProcedureCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <JointProcedureCard
      className="large-section px-0 m-0 text-white"
      phoneNumber={'1800-000-000'}
    />,
  );
};

describe('JointProcedureCard Section', () => {
  it('should render the UI correctly', async () => {
    const { container } = renderUI();

    expect(
      screen.getByText('Call Before Scheduling Your Joint Procedure'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Your plan requires giving us a call before pursuing knee, hip, or spine procedures. Give us a call at',
      ),
    ).toBeVisible();
    expect(screen.getByText('[1800-000-000] or')).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
