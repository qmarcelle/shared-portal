import { MemberDiscounts } from '@/app/(protected)/(common)/member/myhealth/components/MemberDiscounts';
import {
  fitLogo,
  fitnessLogo,
  nutritionLogo,
  personalCareLogo,
  primaryVisionLogo,
  transportationLogo,
} from '@/components/foundation/Icons';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';

const renderUI = () => {
  return render(
    <MemberDiscounts
      className="section"
      title="Member Discounts"
      copy="Want access to new healthy living discounts every week? Find savings on nutrition programs, fitness accessories, medical supplies and services like hearing aids and LASIK eye surgey."
      showOffsiteIcon={true}
      linkTitle="View All Member Discounts"
      linkURL=""
      discountCards={[
        {
          id: '1',
          icon: (
            <Image src={fitnessLogo} alt="Footwear Icon" className="inline" />
          ),
          cardLink: 'Apparel & Footwear',
          url: '',
        },
        {
          id: '2',
          icon: <Image src={fitLogo} alt="Fitness Icon" className="inline" />,
          cardLink: 'Fitness',
          url: '',
        },
        {
          id: '3',
          icon: (
            <Image
              src={primaryVisionLogo}
              alt="Vision Icon"
              className="inline"
            />
          ),
          cardLink: 'Hearing & Vision',
          url: '',
        },
        {
          id: '4',
          icon: (
            <Image
              src={nutritionLogo}
              alt="Nutrition Icon"
              className="inline"
            />
          ),
          cardLink: 'Nutrition',
          url: '',
        },
        {
          id: '5',
          icon: (
            <Image
              src={transportationLogo}
              alt="Travel Icon"
              className="inline"
            />
          ),
          cardLink: 'Travel',
          url: '',
        },
        {
          id: '6',
          icon: (
            <Image
              src={personalCareLogo}
              alt="Personal Icon"
              className="inline"
            />
          ),
          cardLink: 'Personal Care',
          url: '',
        },
      ]}
    />,
  );
};

describe('MemberDiscountsSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Member Discounts')).toBeVisible();
    expect(screen.getByText('View All Member Discounts')).toBeVisible();
    expect(screen.getByText('Apparel & Footwear')).toBeVisible();
    expect(screen.getByText('Fitness')).toBeVisible();
    expect(screen.getByText('Hearing & Vision')).toBeVisible();
    expect(screen.getByText('Nutrition')).toBeVisible();
    expect(screen.getByText('Travel')).toBeVisible();
    expect(screen.getByText('Personal Care')).toBeVisible();
    expect(screen.getByAltText('Footwear Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Fitness Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Travel Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Personal Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Nutrition Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Vision Icon')).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
