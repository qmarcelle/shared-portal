import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';

import { CVSCaremarkInformationCard } from '@/app/(protected)/(common)/member/pharmacy/components/CVSCaremarkInformation';
import {
  costIcon,
  cvsCaremarkIcon,
  externalIcon,
  mailOrderPharmacyIcon,
  prescriptionIcon,
  searchPharmacyIcon,
} from '@/components/foundation/Icons';

const renderUI = () => {
  return render(
    <CVSCaremarkInformationCard
      title="Get More with CVS Caremark"
      description="A caremark.com account will let you get prescriptions by mail, price a medication and more."
      icon={<Image src={cvsCaremarkIcon} alt="download form" />}
      linkText="Visit CVS Caremark"
      linkIcon={<Image src={externalIcon} alt="download form" />}
      services={[
        {
          serviceIcon: <Image src={prescriptionIcon} alt="Prescription Icon" />,
          serviceLabel: 'View or Refill My Prescriptions',
        },
        {
          serviceIcon: (
            <Image src={mailOrderPharmacyIcon} alt="Mail Order Pharmacy Icon" />
          ),
          serviceLabel: 'Get My Prescriptions by Mail',
        },
        {
          serviceIcon: <Image src={costIcon} alt="Cost Icon" />,
          serviceLabel: 'Find Drug Cost & My Coverage',
        },
        {
          serviceIcon: (
            <Image src={searchPharmacyIcon} alt="Search Pharmacy Icon" />
          ),
          serviceLabel: 'Find a Pharmacy',
        },
      ]}
    />,
  );
};

describe('CVSCaremark', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Get More with CVS Caremark')).toBeVisible();
    expect(
      screen.getByText(
        'A caremark.com account will let you get prescriptions by mail, price a medication and more.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Visit CVS Caremark')).toBeVisible();
    expect(screen.getByText('View or Refill My Prescriptions')).toBeVisible();
    expect(screen.getByText('Get My Prescriptions by Mail')).toBeVisible();
    expect(screen.getByText('Find Drug Cost & My Coverage')).toBeVisible();
    expect(screen.getByText('Find a Pharmacy')).toBeVisible();
    expect(screen.getByAltText('Prescription Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Mail Order Pharmacy Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Cost Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Search Pharmacy Icon')).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
