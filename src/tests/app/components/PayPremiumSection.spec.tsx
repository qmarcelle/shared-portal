import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PayPremiumSection } from '../../../app/dashboard/components/PayPremium';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { ViewPayPremium } from '@/app/dashboard/components/viewPayPremium';

let vRules: VisibilityRules = {};

const renderUI = (vRules: VisibilityRules) => {
  return render(
    <>
      <AppModal />
      <PayPremiumSection
      className="large-section"
      dueDate="08/10/2023"
      amountDue={1000.46}
      visibilityRules={vRules}
    />
    </>,

  );
};
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('PayPremiumSection', () => {  
const showAppModal = useAppModalStore.getState().showAppModal;
const dismissAppModal = useAppModalStore.getState().dismissModal;
  beforeEach(() => {
    vRules = {};
     act(() => {
    dismissAppModal();
        
          showAppModal({
            content: (
              <ViewPayPremium
                key="first"
                label="Open External Website"
                subLabelOne="Use this service as an easy and secure way to pay your premium with a debit card or electronic check. Setup recurring bank drafts, manage future payments, and view payment history."
                subLabelTwo="By continuing, you agree to leave the BlueCross website and view the content of an external website. If you choose not to leave the BlueCross website, simply cancel."
                primaryButtonLabel="Cancel"
                secondaryButtonLabel="Continue"
                primaryButtonCallback={dismissAppModal}
                secondaryButtonCallback={dismissAppModal}
              />
            ),
          });
        });
  });
  it('should render the UI correctly', async () => {
    
    vRules.payMyPremiumMedicareEligible = true;
    vRules.active = true;
    const component = renderUI(vRules);
    expect(screen.getByText('Pay Premium')).toBeVisible();
    expect(screen.getByText('Payment Due Date')).toBeVisible();
    expect(screen.getByText('Amount Due')).toBeVisible();
    expect(screen.getByText('08/10/2023')).toBeVisible();
    expect(screen.getByText('$1000.46')).toBeVisible();
    expect(screen.getByText('View or Pay Premium')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /View or Pay Premium/i }));
    // expect(component.baseElement).toMatchSnapshot();
    await waitFor(() => {
      expect(
        screen.getByText('Use this service as an easy and secure way to pay your premium with a debit card or electronic check. Setup recurring bank drafts, manage future payments, and view payment history.'),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });  
});
