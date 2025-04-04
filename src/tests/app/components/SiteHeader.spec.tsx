process.env.NEXT_PUBLIC_BLUECARE_FIND_FORM_URL =
  'https://bluecare.bcbst.com/get-care/documents-forms';

import { SideBarModal } from '@/components/foundation/SideBarModal';
import SiteHeader from '@/components/foundation/SiteHeader';
import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
      push: () => null,
      refresh: () => null,
    };
  },
  usePathname() {
    return '/dashboard';
  },
}));

const mockUserProfiles: UserProfile[] = [
  {
    dob: '08/07/2002',
    firstName: 'Chris',
    lastName: 'Hall',
    id: '76547r664',
    personFhirId: '787655434',
    selected: true,
    type: UserRole.MEMBER,
    plans: [
      {
        memCK: '65765434',
        patientFhirId: '656543456',
        selected: true,
      },
    ],
  },
];

const plans: PlanDetails[] = [
  {
    id: '98786565',
    memeCk: '6765454347',
    planName: 'BlueCross BlueShield of Tennessee',
    policies: 'Medical, Dental, Vision',
    subscriberName: 'Chris Hall',
    termedPlan: false,
  },
];

let vRules: VisibilityRules = {};
function setVisibilityRules(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.wellnessOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}
function setisActiveAndNotFSAOnly(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}
const renderUI = (vRules: VisibilityRules) => {
  return render(
    <div>
      <SideBarModal />
      <SiteHeader
        profiles={mockUserProfiles}
        plans={plans}
        selectedPlan={plans[0]}
        selectedProfile={mockUserProfiles[0]}
        visibilityRules={vRules}
      />
    </div>,
  );
};

process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'CVS';
process.env.NEXT_PUBLIC_CVS_SSO_TARGET =
  'https://caremark/{DEEPLINK}?newLogin=yes';
process.env.NEXT_PUBLIC_IDP_ON_LIFE = 'OnLife';
process.env.NEXT_PUBLIC_IDP_EMBOLD = 'EMBOLD';

describe('SiteHeader And Navigation Menu', () => {
  beforeEach(() => {
    vRules = {};
  });

  it('should render the UI correctly', async () => {
    const component = renderUI(vRules);
    expect(screen.getByText('My Profile:')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('My Profile:'));
    await waitFor(() => {
      expect(screen.getByText('Signout')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('Signout'));
    await waitFor(() => {
      expect(screen.queryByText('Signout')).toBeNull();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should navigate the menu links correctly', async () => {
    const baseUrl = window.location.origin;

    const component = renderUI(vRules);

    /**** Nav Links For Find Care & Cost  */

    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);

    expect(screen.getByText(/Price Dental Care/i)).toBeVisible();
    expect(
      screen.getByRole('button', {
        name: /Price Dental Care/i,
      }),
    ).toBeVisible();

    expect(screen.getByText('Find a Medical Provider')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Find a Medical Provider External Link',
      }),
    ).toHaveProperty('href', `${baseUrl}/sso/launch?PartnerSpId=EMBOLD`);

    expect(
      screen.getByRole('button', {
        name: /Price Dental Care/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Price a Medication External Link' }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=CVS&TargetResource=https://caremark/drugSearchInit.do?newLogin=yes`,
    );
    expect(
      screen.getByRole('link', { name: 'Price a Medication External Link' }),
    ).toHaveProperty('target', '');

    const estimateCostsElement = screen.getByText(/Estimate Costs/i);
    expect(estimateCostsElement.tagName).toBe('P');
    /**** Nav Links For My Plan  */

    fireEvent.click(screen.getAllByText('My Plan')[0]);

    const findCareElement = screen.getByText(/Plan Details/i);
    expect(findCareElement.tagName).toBe('P');

    expect(
      screen.getByRole('button', {
        name: /Benefits & Coverage/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Plan Documents/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /View Claims/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Prior Authorizations/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Balances/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Services Used/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Spending Accounts \(HSA, FSA\)/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Spending Summary/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Report Other Health Insurance/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Manage My Policy/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'View or Pay Premium External Link' }),
    ).toHaveProperty('href', `${baseUrl}/balances`);

    /**** Nav Links For My Health  */

    fireEvent.click(screen.getAllByText('My Health')[0]);

    expect(
      screen.getByRole('link', {
        name: 'Member Wellness Center External Link',
      }),
    ).toHaveProperty('href', `${baseUrl}/sso/launch?PartnerSpId=OnLife`);

    expect(
      screen.getAllByRole('link', {
        name: 'Quick Tip Looking for a virtual care provider for mental health or physical therapy? View Virtual Care Options. Page Arrow',
      })[0],
    ).toHaveProperty('href', `${baseUrl}/virtualCareOptions`);

    /**** Nav Links For Pharmacy  */

    fireEvent.click(screen.getAllByText('Pharmacy')[0]);
    expect(
      screen.getByRole('link', { name: 'My Prescriptions External Link' }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=CVS&TargetResource=https://caremark/refillRx?newLogin=yes`,
    );

    expect(
      screen.getByRole('link', { name: 'Mail Order External Link' }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=CVS&TargetResource=https://caremark/refillRx?newLogin=yes`,
    );

    expect(
      screen.getByRole('link', { name: 'Find a Pharmacy External Link' }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=CVS&TargetResource=https://caremark/pharmacySearchFast?newLogin=yes`,
    );

    expect(
      screen.getByRole('link', { name: 'Price a Medication External Link' }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=CVS&TargetResource=https://caremark/drugSearchInit.do?newLogin=yes`,
    );

    expect(
      screen.getByRole('button', {
        name: /Pharmacy Documents & Forms/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Pharmacy FAQ/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Pharmacy Claims/i }),
    ).toHaveProperty('href', `${baseUrl}/claimSnapshotList`);

    expect(
      screen.getByRole('link', { name: /Pharmacy Spending/i }),
    ).toHaveProperty('href', `${baseUrl}/spendingSummary`);

    /**** Nav Links For Support  */

    fireEvent.click(screen.getAllByText('Support')[0]);
    expect(
      screen.getByRole('link', {
        name: 'Health Insurance Glossary External Link',
      }),
    ).toHaveProperty('href', 'https://www.healthcare.gov/glossary/');

    expect(
      screen.getByRole('button', {
        name: /Find a Form/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Frequently Asked Questions/i,
      }),
    ).toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();

    // Test that submenu dismisses on clicking child items

    fireEvent.click(
      screen.getByRole('button', {
        name: /Frequently Asked Questions/i,
      }),
    );

    expect(
      screen.queryByRole('button', {
        name: /Frequently Asked Questions/i,
      }),
    ).toBeNull();

    expect(component.container).toMatchSnapshot();
  });

  it('should navigate menu link for Blue Care', async () => {
    vRules.blueCare = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);

    /**** Nav Links For Find Care & Cost  */

    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);
    expect(screen.getByText('Find a Provider')).toBeVisible();
    expect(screen.getByText('Primary Care Options')).toBeInTheDocument();
    expect(screen.getByText('Mental Health Options')).toBeVisible();
    expect(screen.getByText('Price Medical Care')).toBeVisible();

    fireEvent.click(screen.getAllByText('My Plan')[0]);
    expect(screen.getByText('Benefits & Coverage')).toBeVisible();
    expect(screen.getByText('Member Handbook')).toBeVisible();
    expect(screen.getByText('View Claims')).toBeVisible();
    expect(screen.getByText('Prior Authorizations')).toBeVisible();
    expect(screen.getByText('Submit a Claim')).toBeVisible();

    /**** Nav Links For My Health  */
    fireEvent.click(screen.getAllByText('My Health')[0]);
    expect(screen.getByText('My Primary Care Provider')).toBeVisible();

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should navigate the primary care menu link correctly', async () => {
    vRules.primary360Eligible = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);

    /**** Nav Links For Find Care & Cost  */

    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);
    expect(screen.getByText('Primary Care Options')).toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should navigate the Mental Health Options menu link correctly for Teladoc', async () => {
    vRules.myStrengthCompleteEligible = true;
    setisActiveAndNotFSAOnly(vRules);
    const component = renderUI(vRules);

    /**** Nav Links For Find Care & Cost  */

    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);

    expect(
      screen.getByRole('button', {
        name: /Mental Health Options/i,
      }),
    ).toBeVisible();

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should navigate the Mental Health Options menu link correctly for AbleTo', async () => {
    vRules.mentalHealthSupport = true;
    vRules.commercialFull = true;
    vRules.medical = true;
    setisActiveAndNotFSAOnly(vRules);
    const component = renderUI(vRules);

    /**** Nav Links For Find Care & Cost  */

    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);

    expect(
      screen.getByRole('button', {
        name: /Mental Health Options/i,
      }),
    ).toBeVisible();

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should navigate my Plan - Manage my Plan menu link correctly Enroll eligibility members', async () => {
    vRules.commercial = true;
    vRules.subscriber = true;
    vRules.enRollEligible = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);

    /**** Nav Links For My Plan  */

    fireEvent.click(screen.getAllByText('My Plan')[0]);
    expect(screen.getByText('View or Pay Premium')).toBeVisible();
    expect(screen.getByText('Enroll in a Health Plan')).toBeInTheDocument();
    expect(screen.getByText('Manage My Policy')).toBeVisible();
    expect(screen.getByText('Report Other Health Insurance')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should navigate the price dental care menu link correctly', async () => {
    vRules.dental = true;
    vRules.dentalCostsEligible = true;
    vRules.enableCostTools = true;
    const component = renderUI(vRules);

    /**** Nav Links For Find Care & Cost  */

    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);
    expect(screen.getByText('Price Dental Care')).toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should navigate the price vision care menu link correctly', async () => {
    vRules.vision = true;
    setVisibilityRules(vRules);
    vRules.blueCare = false;
    const component = renderUI(vRules);
    /**** Nav Links For Find Care & Cost  */

    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);
    expect(screen.getByText('Price Vision Care')).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should be able to render Bimetric Screening menu ', () => {
    vRules.ohdEligible = true;
    const component = renderUI(vRules);

    fireEvent.click(screen.getByText('My Health'));
    expect(screen.getByText('Biometric Screening'));

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should navigate the Spending Accounts menu link correctly', async () => {
    vRules.subscriber = true;
    vRules.fsaOnly = true;
    vRules.fsaHraEligible = true;
    vRules.commercial = true;
    vRules.flexibleSpendingAccount = true;
    const component = renderUI(vRules);

    /**** Nav Links For My Plan  */

    fireEvent.click(screen.getAllByText('My Plan')[0]);
    expect(
      screen.getByText('Spending Accounts (HSA, FSA)'),
    ).toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should not navigate to the Spending Accounts menu link', async () => {
    vRules.subscriber = false;
    vRules.blueCare = true;
    const component = renderUI(vRules);

    /**** Nav Links For My Plan  */

    fireEvent.click(screen.getAllByText('My Plan')[0]);
    expect(
      screen.queryByText('Spending Accounts (HSA, FSA)'),
    ).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should link to BlueCare find form for BlueCare eligible users', async () => {
    vRules = {};
    vRules.blueCare = true;
    const component = renderUI(vRules);

    // Show Nav links for Support
    fireEvent.click(screen.getByText('Support'));
    const findAForm = screen.getByRole('link', {
      name: 'Find a Form External Link',
    });
    expect(findAForm).toHaveAttribute(
      'href',
      'https://bluecare.bcbst.com/get-care/documents-forms',
    );
    expect(component.container).toMatchSnapshot();
  });

  it('should not link to BlueCare find form for BlueCare ineligible users', async () => {
    vRules = {};
    vRules.blueCare = false;
    const component = renderUI(vRules);

    // Show Nav links for Support
    fireEvent.click(screen.getByText('Support'));

    expect(
      screen.queryByRole('link', { name: 'Find a Form External Link' }),
    ).toBeNull();
    expect(component.container).toMatchSnapshot();
  });
  it('should navigate the Health Programs & Resources menu link correctly', async () => {
    vRules.commercial = true;
    vRules.medicare = true;
    const component = renderUI(vRules);

    fireEvent.click(screen.getAllByText('My Health')[0]);
    expect(screen.getByText('Health Programs & Resources')).toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
  it('should not navigate to the Health Programs & Resources menu link', async () => {
    vRules.commercial = false;
    vRules.medicare = false;
    const component = renderUI(vRules);

    fireEvent.click(screen.getAllByText('My Health')[0]);
    expect(
      screen.queryByText('Health Programs & Resources'),
    ).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render Virtual Care options menu when PZN rule is true', async () => {
    vRules = {};
    vRules.blueCare = false;
    vRules.myStrengthCompleteEligible = true;
    vRules.individual = true;
    vRules.fullyInsured = true;
    vRules.medical = true;
    vRules.groupRenewalDateBeforeTodaysDate = true;
    vRules.primary360Eligible = true;
    vRules.teladocEligible = true;
    vRules.futureEffective = false;
    vRules.fsaOnly = false;
    vRules.wellnessOnly = false;
    vRules.terminated = false;
    vRules.katieBeckNoBenefitsElig = false;
    vRules.healthCoachElig = true;
    vRules.mentalHealthSupport = true;
    vRules.hingeHealthEligible = true;
    vRules.levelFunded = true;

    const component = renderUI(vRules);

    // Show Nav links for Find Care & Costs
    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);

    expect(
      screen.getByRole('button', {
        name: /Virtual Care Options/i,
      }),
    ).toBeInTheDocument();
    expect(component.container).toMatchSnapshot();
  });

  it('should render Virtual Care options menu when PZN rule is false', async () => {
    vRules = {};
    vRules.groupRenewalDateBeforeTodaysDate = false;
    vRules.fsaOnly = true;
    vRules.terminated = true;

    const component = renderUI(vRules);

    // Show Nav links for Find Care & Costs
    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);
    expect(component.container).toMatchSnapshot();
    expect(
      screen.queryByRole('link', { name: 'Virtual Care Options' }),
    ).toBeNull();

    expect(component.container).toMatchSnapshot();
  });

  it('should show  Update Katie Beckett Banking Info if group id is 155000', async () => {
    vRules.katieBeckettEligible = true;
    setVisibilityRules(vRules);
    const component = renderUI(vRules);
    fireEvent.click(screen.getAllByText('My Plan')[0]);
    expect(screen.getByText('Update Katie Beckett Banking Info')).toBeVisible();

    expect(component.baseElement).toMatchSnapshot();
  });
});
