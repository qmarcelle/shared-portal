import { bcbstBlueLogo } from '@/components/foundation/Icons';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { EmployeeProvidedBenefitsTile } from '../../../app/dashboard/components/EmployeeProvidedBenefitsTile';

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
      employerLogo={bcbstBlueLogo}
    />,
  );
};

describe('EmployeeProvidedBenefitsTile', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    // The top logo should be visible only on mobile devices
    expect(screen.getAllByAltText('Provider logo')[0]).toHaveClass(
      'block mb-6 mt-3 sm:hidden',
    );
    // The right logo should be visible on all screens except mobile
    expect(screen.getAllByAltText('Provider logo')[1]).toHaveClass(
      'hidden sm:block',
    );

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
