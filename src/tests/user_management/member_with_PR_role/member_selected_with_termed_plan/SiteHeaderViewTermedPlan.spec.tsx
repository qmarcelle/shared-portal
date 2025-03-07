process.env.NEXT_PUBLIC_ALERTS =
  'There is a planned system outage on July 23-25;Another type of message that effects';

import SiteHeader from '@/components/foundation/SiteHeader';
import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

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
    termedPlan: true,
  },
];

const vRules: VisibilityRules = {
  dental: true,
  dentalCostsEligible: true,
  enableCostTools: true,
};

describe('SiteHeader', () => {
  it('should render the dashboard UI correctly with limited features for termed plan', async () => {
    const { container } = render(
      <SiteHeader
        profiles={mockUserProfiles}
        plans={plans}
        selectedPlan={plans[0]}
        selectedProfile={mockUserProfiles[0]}
        visibilityRules={vRules}
      />,
    );
    expect(screen.getByText('Inbox')).toBeVisible();
    expect(screen.queryByText('ID Card')).not.toBeInTheDocument();
    expect(screen.queryByText('My Health')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
