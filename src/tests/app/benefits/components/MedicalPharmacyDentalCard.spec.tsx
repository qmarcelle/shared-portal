import { MedicalPharmacyDentalCard } from '@/app/benefits/components/MedicalPharmacyDentalCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
import PrimaryCareIcon from '../../../../../public/assets/primary_care.svg';

const renderUI = () => {
  return render(
    <MedicalPharmacyDentalCard
      className="small-section w-[672px] "
      heading="Medical"
      cardIcon={<Image src={PrimaryCareIcon} alt="link" />}
      manageBenefitItems={[
        {
          title: 'Preventive Care',
          body: '',
          externalLink: false,
          url: 'url',
        },
        {
          title: 'Office Visits',
          body: '',
          externalLink: false,
          url: 'url',
        },
      ]}
    />,
  );
};

describe('Benefits&Coverage', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByText('Medical');

    screen.getByText('Preventive Care');

    screen.getByText('Office Visits');

    expect(component.baseElement).toMatchSnapshot();
  });
});
