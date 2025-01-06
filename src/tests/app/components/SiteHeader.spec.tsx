import { SideBarModal } from '@/components/foundation/SideBarModal';
import SiteHeader from '@/components/foundation/SiteHeader';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
}));

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
      <SiteHeader visibilityRules={vRules} />
    </div>,
  );
};

describe('SiteHeader And Navigation Menu', () => {
  beforeEach(() => {
    vRules = {};
  });

  it('should render the UI correctly', async () => {
    const component = renderUI(vRules);
    expect(screen.getByText('My Profile')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('My Profile'));
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
    fireEvent.click(
      screen.getByRole('button', {
        name: /Price Dental Care/i,
      }),
    );

    expect(screen.getByText('Find a Medical Provider')).toBeInTheDocument();

    expect(screen.getAllByText(/Virtual Care Options/i));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Virtual Care Options/i,
      }),
    );
    expect(screen.getByText('Virtual Care Options')).toBeInTheDocument();

    expect(screen.getByText(/Price Dental Care/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Price Dental Care/i,
      }),
    );
    expect(screen.getByText('Price Dental Care')).toBeInTheDocument();

    /**** Nav Links For My Plan  */

    fireEvent.click(screen.getAllByText('My Plan')[0]);
    expect(screen.getAllByText(/Benefits & Coverage/i));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Benefits & Coverage/i,
      }),
    );
    expect(screen.getByText('Benefits & Coverage')).toBeInTheDocument();

    expect(screen.getByText(/Plan Documents/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Plan Documents/i,
      }),
    );
    expect(screen.getByText('Plan Documents')).toBeInTheDocument();

    expect(screen.getByText(/View Claims/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /View Claims/i,
      }),
    );
    expect(screen.getByText('Claims')).toBeInTheDocument();

    expect(screen.getByText(/Prior Authorizations/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Prior Authorizations/i,
      }),
    );
    expect(screen.getByText(/Prior Authorization/i)).toBeInTheDocument();

    expect(screen.getByText(/Balances/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Balances/i,
      }),
    );
    expect(screen.getByText('Balances')).toBeInTheDocument();

    expect(screen.getByText(/Services Used/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Services Used/i,
      }),
    );
    expect(screen.getByText('Services Used')).toBeInTheDocument();

    expect(screen.getByText(/Spending Accounts \(HSA, FSA\)/i));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Spending Accounts \(HSA, FSA\)/i,
      }),
    );
    expect(screen.getByText(/Spending Accounts/i)).toBeInTheDocument();

    expect(screen.getByText(/Spending Summary/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Spending Summary/i,
      }),
    );
    expect(screen.getByText('Spending Summary')).toBeInTheDocument();

    expect(screen.getByText(/Report Other Health Insurance/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Report Other Health Insurance/i,
      }),
    );
    expect(
      screen.getByText('Report Other Health Insurance'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'View or Pay Premium External Link' }),
    ).toHaveProperty('href', `${baseUrl}/balances`);

    /**** Nav Links For My Health  */

    fireEvent.click(screen.getAllByText('My Health')[0]);
    expect(screen.getAllByText(/Health Programs & Resources/i));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Health Programs & Resources/i,
      }),
    );
    expect(screen.getByText('Health Programs & Resources')).toBeInTheDocument();

    expect(
      screen.getAllByRole('link', {
        name: 'Quick Tip Looking for a virtual care provider for mental health or physical therapy? View Virtual Care Options. Page Arrow',
      })[0],
    ).toHaveProperty('href', `${baseUrl}/virtualCareOptions`);

    /**** Nav Links For Pharmacy  */

    fireEvent.click(screen.getAllByText('Pharmacy')[0]);
    expect(
      screen.getByRole('link', { name: 'My Prescriptions External Link' }),
    ).toHaveProperty('href', 'https://www.caremark.com/refillRx?newLogin=yes');

    expect(
      screen.getByRole('link', { name: 'Mail Order External Link' }),
    ).toHaveProperty('href', 'https://www.caremark.com/refillRx?newLogin=yes');

    expect(
      screen.getByRole('link', { name: 'Find a Pharmacy External Link' }),
    ).toHaveProperty(
      'href',
      'https://www.caremark.com/pharmacySearchFast?newLogin=yes',
    );

    expect(screen.getAllByText(/Pharmacy Documents & Forms/i));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Pharmacy Documents & Forms/i,
      }),
    );
    expect(screen.getByText('Pharmacy Documents & Forms')).toBeInTheDocument();

    expect(screen.getAllByText(/Pharmacy FAQ/i));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Pharmacy FAQ/i,
      }),
    );
    expect(screen.getByText('Pharmacy FAQ')).toBeInTheDocument();

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

    expect(screen.getAllByText(/Find a Form/i));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Find a Form/i,
      }),
    );

    expect(screen.getAllByText(/Frequently Asked Questions/i));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Frequently Asked Questions/i,
      }),
    );
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should navigate to Find Care and Cost - Find Care menu link for Blue Care', async () => {
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

    expect(screen.getByText(/Mental Health Options/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Mental Health Options/i,
      }),
    );
    expect(screen.getByText('Mental Health Options')).toBeInTheDocument();

    expect(screen.getByText(/Mental Health Options/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Mental Health Options/i,
      }),
    );
    expect(screen.getByText('Mental Health Options')).toBeInTheDocument();

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

    expect(screen.getByText(/Mental Health Options/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Mental Health Options/i,
      }),
    );
    expect(screen.getByText('Mental Health Options')).toBeInTheDocument();

    expect(screen.getByText(/Mental Health Options/i)).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Mental Health Options/i,
      }),
    );
    expect(screen.getByText('Mental Health Options')).toBeInTheDocument();
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
  it('should be able to render Bimetric Screening menu ', () => {
    vRules.ohdEligible = true;
    const component = renderUI(vRules);

    fireEvent.click(screen.getByText('My Health'));
    expect(screen.getByText('Biometric Screening'));

    expect(component.baseElement).toMatchSnapshot();
  });
});
