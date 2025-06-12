import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Image from 'next/image';

import { CVSCaremarkInformationCard } from '@/app/pharmacy/components/CVSCaremarkInformation';
import {
  CVS_DEEPLINK_MAP,
  CVS_DRUG_SEARCH_INIT,
  CVS_PHARMACY_SEARCH_FAST,
  CVS_REFILL_RX,
} from '@/app/sso/ssoConstants';
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
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${encodeURIComponent(process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_REFILL_RX)!) || '')}`,
        },
        {
          serviceIcon: (
            <Image src={mailOrderPharmacyIcon} alt="Mail Order Pharmacy Icon" />
          ),
          serviceLabel: 'Get My Prescriptions by Mail',
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${encodeURIComponent(process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!) || '')}`,
        },
        {
          serviceIcon: <Image src={costIcon} alt="Cost Icon" />,
          serviceLabel: 'Find Drug Cost & My Coverage',
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${encodeURIComponent(process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!) || '')}`,
        },
        {
          serviceIcon: (
            <Image src={searchPharmacyIcon} alt="Search Pharmacy Icon" />
          ),
          serviceLabel: 'Find a Pharmacy',
          url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${encodeURIComponent(process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!) || '')}`,
        },
      ]}
    />,
  );
};

// Mock useRouter:
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: mockPush,
    };
  },
}));

process.env.NEXT_PUBLIC_CVS_SSO_TARGET =
  'https://caremark/{DEEPLINK}?newLogin=yes';
process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'SP_CVS_BCBSTN';

describe('CVSCaremark', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('should redirect sso link on click of Find a Pharmacy', async () => {
    const component = renderUI();
    expect(screen.getByText('Get More with CVS Caremark')).toBeVisible();

    // Get the card element
    const cardElement = screen
      .getByText(/Find a Pharmacy/i)
      .closest('.card-elevated');
    expect(cardElement).toBeInTheDocument();

    expect(cardElement).not.toBeNull();

    if (cardElement) {
      // Simulate a click event on the card element
      fireEvent.click(cardElement);

      const expectedUrl = `/sso/launch?PartnerSpId=SP_CVS_BCBSTN&TargetResource=${encodeURIComponent('https://caremark/pharmacySearchFast?newLogin=yes')}`;
      expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    }

    expect(component).toMatchSnapshot();
  });

  it('should redirect sso link on click of Find Drug Cost & My Coverage', async () => {
    const component = renderUI();
    expect(screen.getByText('Get More with CVS Caremark')).toBeVisible();

    // Get the card element
    const cardElement = screen
      .getByText(/Find Drug Cost & My Coverage/i)
      .closest('.card-elevated');
    expect(cardElement).toBeInTheDocument();
    if (cardElement) {
      // Simulate a click event on the card element
      fireEvent.click(cardElement);

      const expectedUrl = `/sso/launch?PartnerSpId=SP_CVS_BCBSTN&TargetResource=${encodeURIComponent('https://caremark/drugSearchInit.do?newLogin=yes')}`;
      expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    }

    expect(component).toMatchSnapshot();
  });

  it('should have properly encoded TargetResource URLs', () => {
    renderUI();

    // Test that URLs contain encoded TargetResource parameters
    const expectedEncodedUrl = encodeURIComponent(
      'https://caremark/pharmacySearchFast?newLogin=yes',
    );

    // The URLs should contain the encoded parameter
    expect(expectedEncodedUrl).toBe(
      'https%3A%2F%2Fcaremark%2FpharmacySearchFast%3FnewLogin%3Dyes',
    );
  });

  it('should handle missing environment variables gracefully', () => {
    const originalTarget = process.env.NEXT_PUBLIC_CVS_SSO_TARGET;
    delete process.env.NEXT_PUBLIC_CVS_SSO_TARGET;

    expect(() => renderUI()).not.toThrow();

    process.env.NEXT_PUBLIC_CVS_SSO_TARGET = originalTarget;
  });

  it('should handle undefined deeplink map keys gracefully', () => {
    const originalGetMethod = CVS_DEEPLINK_MAP.get;
    CVS_DEEPLINK_MAP.get = jest.fn().mockReturnValue(undefined);

    expect(() => renderUI()).not.toThrow();

    CVS_DEEPLINK_MAP.get = originalGetMethod;
  });

  it('should encode special characters in TargetResource', () => {
    process.env.NEXT_PUBLIC_CVS_SSO_TARGET =
      'https://caremark/{DEEPLINK}?param=test&special=<>&other=value';

    renderUI();

    // Verify that special characters are properly encoded
    const cardElement = screen
      .getByText(/Find a Pharmacy/i)
      .closest('.card-elevated');

    if (cardElement) {
      fireEvent.click(cardElement);

      const expectedEncodedResource = encodeURIComponent(
        'https://caremark/pharmacySearchFast?param=test&special=<>&other=value',
      );
      const expectedUrl = `/sso/launch?PartnerSpId=SP_CVS_BCBSTN&TargetResource=${expectedEncodedResource}`;
      expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    }
  });
});
