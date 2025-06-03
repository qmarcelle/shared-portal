process.env.NEXT_PUBLIC_BLUECARE_FIND_FORM_URL =
  'https://bluecare.bcbst.com/get-care/documents-forms';

import SiteHeader from '@/components/foundation/SiteHeader';
import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
//import { UserRole } from '@/userManagement/models/sessionUser';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
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
    memeCk: '65765434',
    planName: 'BlueCross BlueShield of Tennessee',
    policies: 'Medical, Dental, Vision',
    subscriberName: 'Chris Hall',
    termedPlan: true,
  },
];
const mockSelectedPlan = plans[0];
const vRules: VisibilityRules = {};
function setVisibilityRules(vRules: VisibilityRules) {
  //vRules.katieBeckNoBenefitsElig = true;
  vRules.isBlueCareEligible = true;
}

const renderUI = (vRules: VisibilityRules) => {
  return render(
    <div>
      <SiteHeader
        profiles={mockUserProfiles}
        plans={plans}
        selectedPlan={mockSelectedPlan}
        selectedProfile={mockUserProfiles[0]}
        visibilityRules={vRules}
        isLoggedIn={true}
      />
    </div>,
  );
};

describe('SiteHeader And Navigation Menu', () => {
  beforeEach(() => {
    vRules.blueCare = true;
    setVisibilityRules(vRules);

    isBlueCareEligible(vRules);
  });

  it('should navigate menu for BlueCare members', async () => {
    renderUI(vRules);

    /**** Nav For Find Care & Cost  */

    fireEvent.click(screen.getAllByText('Find Care & Costs')[0]);
    expect(screen.getByText('Find Care')).toBeVisible();
    expect(screen.getByText('Find a Provider')).toBeVisible();

    /***Nav for My plan */
    fireEvent.click(screen.getAllByText('My Plan')[0]);
    expect(screen.getByText('Benefits & Coverage')).toBeVisible();
    expect(screen.getByText('Member Handbook')).toBeVisible();

    /**** Nav For My Health  */
    fireEvent.click(screen.getAllByText('My Health')[0]);
    expect(screen.getByText('My Primary Care Provider')).toBeVisible();
    expect(screen.getByText('Health History & Needs Survey')).toBeVisible();
    expect(screen.getByText('One-on-One Help')).toBeVisible();
    expect(screen.getByText('Health Library')).toBeVisible();

    /*** Nav for Support */

    fireEvent.click(screen.getAllByText('Support')[0]);
    expect(screen.getByText('Frequently Asked Questions')).toBeVisible();
    expect(screen.getByText('Health Insurance Glossary')).toBeVisible();
    expect(screen.getByText('Find a Form')).toBeVisible();
    expect(screen.getByText('Share Website Feedback')).toBeVisible();
  });
  it('should navigate the sub menu correctly', async () => {
    const component = renderUI(vRules);

    /****  My Plan  */

    fireEvent.click(screen.getAllByText('My Plan')[0]);
    const MyPlanElement = screen.getByText('Plan Details');
    expect(MyPlanElement.tagName).toBe('P');

    expect(
      screen.getByRole('button', {
        name: /Benefits & Coverage/i,
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

    /****  Pharmacy  */

    fireEvent.click(
      screen.getByRole('button', {
        name: /Pharmacy/i,
      }),
    );

    /****  Support  */

    fireEvent.click(screen.getAllByText('Support')[0]);
    expect(
      screen.getByRole('link', {
        name: 'Health Insurance Glossary External Link',
      }),
    ).toHaveProperty('href', 'https://www.healthcare.gov/glossary/');

    expect(component.baseElement).toMatchSnapshot();
  });
});
