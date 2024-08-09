import { MemberDiscounts } from '@/app/myHealth/components/MemberDiscounts';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
import apparelIcon from '../../../public/assets/apparel-footwear.svg';
import fitnessIcon from '../../../public/assets/fitness.svg';
import nutritionIcon from '../../../public/assets/nutrition.svg';
import personalCareIcon from '../../../public/assets/personal-care.svg';
import travelIcon from '../../../public/assets/travel.svg';
import visionWhiteIcon from '../../../public/assets/vision_white.svg';

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
          icon: (
            <Image
              alt="Apparel Icon"
              src={apparelIcon}
              width={40}
              height={40}
            />
          ),
          cardLink: 'Apparel & Footwear',
          url: '',
        },
        {
          icon: (
            <Image
              alt="Fitness Icon"
              src={fitnessIcon}
              width={40}
              height={40}
            />
          ),
          cardLink: 'Fitness',
          url: '',
        },
        {
          icon: (
            <Image
              alt="Vision Icon"
              src={visionWhiteIcon}
              width={40}
              height={40}
            />
          ),
          cardLink: 'Hearing & Vision',
          url: '',
        },
        {
          icon: (
            <Image
              alt="Nutrition Icon"
              src={nutritionIcon}
              width={40}
              height={40}
            />
          ),
          cardLink: 'Nutrition',
          url: '',
        },
        {
          icon: (
            <Image alt="Travel Icon" src={travelIcon} width={40} height={40} />
          ),
          cardLink: 'Travel',
          url: '',
        },
        {
          icon: (
            <Image
              alt="Personal Care Icon"
              src={personalCareIcon}
              width={40}
              height={40}
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
    expect(screen.getByAltText('Apparel Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Fitness Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Travel Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Personal Care Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Nutrition Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Vision Icon')).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
