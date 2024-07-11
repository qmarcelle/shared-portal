import { EmployeeProvidedBenefitsTile } from '../../../app/dashboard/components/EmployeeProvidedBenefitsTile';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const renderUI = () => {
  return render(
    <EmployeeProvidedBenefitsTile
      className="section"
      employer="Ben Cole Co"
      benefits={[
        {
          id: '45',
          providedBy: 'Davis Vision',
          contact: '1-800-456-9876',
          url: 'https://davis-vision.com',
        },
        {
          id: '87',
          providedBy: 'Nirmal Dental',
          contact: '1-800-367-9676',
          url: 'https://nirmaldental.com',
        },
        {
          id: '25',
          providedBy: 'Low Pharm',
          contact: '1-800-834-2465',
        },
        {
          id: '289',
          providedBy: 'Quant Labs',
          contact: '1-800-834-3465',
        },
      ]}
    />,
  );
};

describe('EmployeeProvidedBenefitsTile', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    expect(
      screen.getByRole('heading', { name: 'Provided By Ben Cole Co' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Your employer offers even more programs and benefits you can explore here',
      ),
    ).toBeVisible();
    expect(
      screen.getByText('View All Employer Provided Benefits'),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
