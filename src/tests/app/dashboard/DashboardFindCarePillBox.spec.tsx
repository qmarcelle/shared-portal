import MemberDashboard from '@/app/dashboard/components/MemberDashboard';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <MemberDashboard
      data={{
        memberDetails: null,
        primaryCareProvider: undefined,
        role: null,
        profiles: undefined,
        visibilityRules: undefined,
        employerProvidedBenefits: undefined,
      }}
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

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));
const vRules = {
  user: {
    currUsr: {
      plan: {
        memCk: '123456',
      },
    },
    vRules: {
      showPharmacyTab: true,
      terminated: false,
      wellnessOnly: false,
      fsaOnly: false,
      vision: true,
      futureEffective: false,
      katieBeckNoBenefitsElig: false,
    },
  },
};

process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY =
  'https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml';
process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET =
  'https://uat.bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%20distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39& locale=en';
process.env.NEXT_PUBLIC_IDP_EYEMED = 'EYEMED_ITTEST';
process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET =
  'https://member.eyemedvisioncare.com/bcbst/en/private/{DEEPLINK}';
process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'SP_CVS_BCBSTN';
process.env.NEXT_PUBLIC_CVS_SSO_TARGET =
  'https://www.caremark.com/{DEEPLINK}?newLogin=yes';
process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET =
  'https://uat.bcbst.sapphirecareselect.com/{DEEPLINK}';

describe('DashBoard - FindCare PillBox', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', {
      name: 'Looking for Care? Find A:',
    });
    fireEvent.click(screen.getByLabelText('Primary Care Provider'));

    expect(mockPush).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=https://uat.bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%20distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39& locale=en',
    );
    fireEvent.click(screen.getByLabelText('Dentist'));
    expect(mockPush).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml&TargetResource=https://uat.bcbst.sapphirecareselect.com/?guided_search=wayfinding_home_DentalCare_header',
    );
    fireEvent.click(screen.getByLabelText('Mental Health Provider'));
    expect(mockPush).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml&TargetResource=https://uat.bcbst.sapphirecareselect.com/?guided_search=wayfinding_tile_cost_behavioral_health',
    );

    fireEvent.click(screen.getByLabelText('Virtual Care'));
    expect(mockPush).toHaveBeenCalledWith('/virtualCareOptions');
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should not call sso if Pharamcybenifits visibility rule false on click of Pharmacy', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.showPharmacyTab = false;
    mockAuth.mockResolvedValueOnce(vRules);
    const component = await renderUI();
    fireEvent.click(screen.getByLabelText('Pharmacy'));
    expect(mockPush).not.toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=SP_CVS_BCBSTN&TargetResource=https://www.caremark.com/drugSearchInit.do?newLogin=yes',
    );
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should not call sso if visionBenefits visibility rule true on click of vision', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.vision = false;
    mockAuth.mockResolvedValueOnce(vRules);
    const component = await renderUI();
    fireEvent.click(screen.getByLabelText('Vision'));
    expect(mockPush).not.toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=EYEMED_ITTEST&TargetResource=https://member.eyemedvisioncare.com/bcbst/en/private/provider-locator',
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
