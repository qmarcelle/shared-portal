import { ProgramBenefits } from '@/app/healthyMaternity/components/ProgramBenefits';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
import healthSupport from '../../../public/assets/health_support.svg';
import maternity from '../../../public/assets/maternity_breast_pump.svg';
import primaryCare from '../../../public/assets/primary_care.svg';

const renderUI = () => {
  return render(
    <ProgramBenefits
      benefits={[
        {
          benefitIcon: (
            <Image src={maternity} alt="Maternity Breast Pump Icon" />
          ),
          benefitCopy:
            'Enroll within the first 20 weeks of your pregnancy to qualify for a free breast pump.',
          benefitLabel: 'Free Breast Pump',
        },
        {
          benefitIcon: <Image src={primaryCare} alt="Primary Care Icon" />,
          benefitCopy:
            'Our nurses provide expert advice for high-risk care, lactation counseling, postpartum emotional support and more.',
          benefitLabel: 'One-on-One Support',
        },
        {
          benefitIcon: <Image src={healthSupport} alt="Health Support Icon" />,
          benefitCopy:
            // eslint-disable-next-line quotes
            "We'll work with your doctors to ensure you're getting everything you need during and after your pregnancy.",
          benefitLabel: 'Part of Your Care Team',
        },
      ]}
    />,
  );
};

describe('Program Benefits Section', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(
      screen.getAllByText(
        'Enroll within the first 20 weeks of your pregnancy to qualify for a free breast pump.',
      )[0],
    ).toBeVisible();
    expect(
      screen.getAllByText(
        'Our nurses provide expert advice for high-risk care, lactation counseling, postpartum emotional support and more.',
      )[0],
    ).toBeVisible();
    expect(
      screen.getAllByText(
        // eslint-disable-next-line quotes
        "We'll work with your doctors to ensure you're getting everything you need during and after your pregnancy.",
      )[0],
    ).toBeVisible();
    expect(screen.getAllByText('Free Breast Pump')[0]).toBeVisible();
    expect(screen.getAllByText('One-on-One Support')[0]).toBeVisible();
    expect(screen.getAllByText('Part of Your Care Team')[0]).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
