import FindCare from '@/app/findcare';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<FindCare />);
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
process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET =
  'https://uat.bcbst.sapphirecareselect.com/{DEEPLINK}';
process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'SP_CVS_BCBSTN';
process.env.NEXT_PUBLIC_CVS_SSO_TARGET =
  'https://www.caremark.com/{DEEPLINK}?newLogin=yes';
process.env.NEXT_PUBLIC_IDP_EYEMED = 'EYEMED_ITTEST';
process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET =
  'https://member.eyemedvisioncare.com/bcbst/en/private/{DEEPLINK}';

describe('FindCarePillBox', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', {
      name: 'Planning for a procedure? Estimate costs for:',
    });
    fireEvent.click(screen.getByLabelText('Medical'));

    expect(mockPush).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml&TargetResource=https://uat.bcbst.sapphirecareselect.com/?guided_search=wayfinding_home_findCost_header',
    );

    fireEvent.click(screen.getByLabelText('Dental'));
    expect(mockPush).toHaveBeenCalledWith('/member/findcare/dentalcosts');

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should not call sso if Pharamcybenifits visibility rule false on click of prescription drugs', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.showPharmacyTab = false;
    mockAuth.mockResolvedValueOnce(vRules);
    const component = await renderUI();
    fireEvent.click(screen.getByLabelText('Prescription Drugs'));
    expect(mockPush).not.toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=SP_CVS_BCBSTN&TargetResource=https://www.caremark.com/drugSearchInit.do?newLogin=yes',
    );
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should not call sso if visionBenefits visibility rule true on click of prescription drugs', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.vision = false;
    mockAuth.mockResolvedValueOnce(vRules);
    const component = await renderUI();
    fireEvent.click(screen.getByLabelText('Vision'));
    expect(mockPush).not.toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=EYEMED_ITTEST&TargetResource=https://member.eyemedvisioncare.com/bcbst/en/private/know-before-you-go',
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
