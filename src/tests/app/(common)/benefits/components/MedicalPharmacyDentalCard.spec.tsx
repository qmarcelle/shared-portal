import { MedicalPharmacyDentalCard } from '@/app/(protected)/(common)/member/myplan/benefits/components/MedicalPharmacyDentalCard';
import { externalIcon } from '@/components/foundation/Icons';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Image from 'next/image';
import PrimaryCareIcon from '/assets/primary_care.svg';
process.env.NEXT_PUBLIC_IDP_EYEMED = 'EYEMED_ITTEST';
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
        {
          title: 'Visit EyeMed',
          body: 'We work with EyeMed to provide your vision benefits. To manage your vision plan, visit EyeMed.',
          externalLink: true,
          url: '/sso/launch?PartnerSpId=EYEMED_ITTEST',
          icon: <Image src={externalIcon} alt="link" />,
        },
      ]}
    />,
  );
};
const vRules = {
  user: {
    currUsr: {
      plan: { memCk: '123456789', grpId: '127600', sbsbCk: '654567656' },
    },
    vRules: {
      dental: true,
      dentalCostsEligible: true,
      enableCostTools: true,
      vision: true,
      delinquent: false,
    },
  },
};
const mockWindow = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: mockWindow,
    };
  },
}));

describe('Benefits&Coverage', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByText('Medical');

    screen.getByText('Preventive Care');

    screen.getByText('Office Visits');

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should redirect to SSO launch page when we click on Visit Eyemed', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
    mockedAxios.get.mockResolvedValue({
      data: { planId: '', productType: '' },
    });

    const component = await renderUI();
    fireEvent.click(screen.getByText('Visit EyeMed'));
    expect(component.baseElement).toMatchSnapshot();

    expect(mockWindow).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=EYEMED_ITTEST',
    );
  });
});
