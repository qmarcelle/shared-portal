import { MemberDiscounts } from '@/app/myHealth/components/MemberDiscounts';
import {
  BLUE_365_DEEPLINK_MAP,
  BLUE_365_FITNESS,
  BLUE_365_FOOTWEAR,
  BLUE_365_HEARING_VISION,
  BLUE_365_NUTRITION,
  BLUE_365_PERSONAL_CARE,
  BLUE_365_TRAVEL,
} from '@/app/sso/ssoConstants';
import {
  fitLogo,
  fitnessLogo,
  nutritionLogo,
  personalCareLogo,
  primaryVisionLogo,
  transportationLogo,
} from '@/components/foundation/Icons';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Image from 'next/image';

process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET =
  'https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=';
process.env.NEXT_PUBLIC_IDP_BLUE_365 =
  'https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd';
process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET =
  'https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=';
process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE =
  'https://pie.blue365deals.com/BCBSTN/{DEEPLINK}';

// Mock useRouter:
const mockPush = jest.fn();
// Mock window.open
const mockOpen = jest.fn();
global.open = mockOpen;
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: mockPush,
    };
  },
}));

// @ts-ignore
delete window.location;
// @ts-ignore
window.location = new URL('https://localhost');
const setHref = jest
  .spyOn(window.location, 'href', 'set')
  .mockImplementation(() => {});

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
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_FOOTWEAR)!))}`,
        },
        {
          id: '2',
          icon: <Image src={fitLogo} alt="Fitness Icon" className="inline" />,
          cardLink: 'Fitness',
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_FITNESS)!))}`,
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
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_HEARING_VISION)!))}`,
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
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_NUTRITION)!))}`,
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
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_TRAVEL)!))}`,
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
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_PERSONAL_CARE)!))}`,
        },
      ]}
    />,
  );
};
const baseUrl = window.location.origin;

describe('MemberDiscountsSection', () => {
  it('should redirect SSO links correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Member Discounts')).toBeVisible();
    expect(screen.getByText('View All Member Discounts')).toBeVisible();
    fireEvent.click(screen.getByText('Apparel & Footwear'));
    expect(mockOpen).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd&TargetResource=https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=https%3A%2F%2Fpie.blue365deals.com%2FBCBSTN%2Foffer-category-apparel-footwear',
      '_blank',
    );
    fireEvent.click(screen.getByText('Fitness'));
    expect(screen.getByText('Fitness')).toBeVisible();
    expect(mockOpen).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd&TargetResource=https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=https%3A%2F%2Fpie.blue365deals.com%2FBCBSTN%2Foffer-category-fitness',
      '_blank',
    );
    expect(screen.getByText('Hearing & Vision')).toBeVisible();
    fireEvent.click(screen.getByText('Hearing & Vision'));
    expect(mockOpen).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd&TargetResource=https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=https%3A%2F%2Fpie.blue365deals.com%2FBCBSTN%2Foffer-category-hearing-vision',
      '_blank',
    );
    expect(screen.getByText('Nutrition')).toBeVisible();
    fireEvent.click(screen.getByText('Nutrition'));
    expect(mockOpen).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd&TargetResource=https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=https%3A%2F%2Fpie.blue365deals.com%2FBCBSTN%2Foffer-category-nutrition',
      '_blank',
    );
    expect(screen.getByText('Travel')).toBeVisible();
    fireEvent.click(screen.getByText('Travel'));
    expect(mockOpen).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd&TargetResource=https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=https%3A%2F%2Fpie.blue365deals.com%2FBCBSTN%2Foffer-category-travel',
      '_blank',
    );
    expect(screen.getByText('Personal Care')).toBeVisible();
    fireEvent.click(screen.getByText('Personal Care'));
    expect(mockOpen).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd&TargetResource=https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=https%3A%2F%2Fpie.blue365deals.com%2FBCBSTN%2Foffer-category-personal-care',
      '_blank',
    );

    expect(
      screen.getByRole('link', { name: 'View All Member Discounts' }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd&TargetResource=https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=`,
    );

    expect(component).toMatchSnapshot();
  });

  it('should redirect SSO link correctly when we click on View All Member Discounts', async () => {
    const mockSSOLink = jest.fn();
    const linkElement = document.querySelector('a');
    if (linkElement) {
      linkElement.onclick = mockSSOLink;

      // Check the URL set on window.location.href
      expect(setHref).toHaveBeenCalledWith(
        '/sso/launch?PartnerSpId=https://www.okta.com/saml2/service-provider/spsgovavdrzqlausfnxd&TargetResource=https://login-preview.blue365deals.com/app/blue365federation_blue365pie_1/exk9o0yn7dV1D3p9i0h7/sso/saml?RelayState=',
      );
    }
  });
});
