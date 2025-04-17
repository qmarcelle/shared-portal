process.env.NEXT_PUBLIC_BLUECARE_FIND_FORM_URL =
  'https://bluecare.bcbst.com/get-care/documents-forms';

import { SideBarModal } from '@/components/foundation/SideBarModal';
import SiteHeader from '@/components/foundation/SiteHeader';
import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

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

describe('SignOut Menu', () => {
  beforeEach(() => {
    vRules = {};
    window.dataLayer = [];
  });

  it('should render the Google Analtics correctly for Sign Out click event ', async () => {
    const component = renderUI(vRules);
    fireEvent.click(screen.getByText('My Profile:'));

    await waitFor(() => {
      expect(screen.getByText('Signout')).toBeVisible();
    });

    act(() => {
      fireEvent.click(screen.getByText('Signout'));
    });

    await waitFor(() => {
      expect(window.dataLayer).toMatchObject([
        {
          click_text: 'Member Name',
          click_url: undefined,
          element_category: 'profile',
          action: 'expand',
          event: 'select_content',
          content_type: 'select',
          page_section: 'header',
          selection_type: 'tile',
        },
        {
          click_text: 'Signout',
          click_url: '',
          event: 'logout',
          content_type: undefined,
          element_category: 'Link Click',
          page_section: 'header',
          element_id: 'Logout',
        },
      ]);
      expect(screen.queryByText('Signout')).toBeNull();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
