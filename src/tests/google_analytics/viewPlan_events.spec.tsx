import { PlanSwitcher } from '@/components/composite/PlanSwitcherComponent';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <PlanSwitcher
      className="mx-4 w-[268px] hidden md:block"
      plans={[
        {
          subscriberName: 'Chris Hall',
          policies: 'Medical, Vision, Dental',
          planName: 'BlueCross BlueShield of Tennessee',
          id: 'ABC1234567890',
          memeCk: '67654543',
          termedPlan: false,
        },
        {
          subscriberName: 'Maddison Hall',
          policies: 'Dental',
          planName: 'Tennessee Valley Authority',
          id: 'ABC000000000',
          memeCk: '565434987',
          termedPlan: false,
        },
        {
          subscriberName: 'Chris Hall',
          policies: 'Medical, Vision, Dental',
          planName: 'Dollar General',
          id: 'ABC1234567891',
          endedOn: '2023',
          memeCk: '652398677',
          termedPlan: true,
        },
      ]}
      selectedPlan={{
        subscriberName: 'Chris Hall',
        policies: 'Medical, Vision, Dental',
        planName: 'BlueCross BlueShield of Tennessee',
        id: 'ABC1234567890',
        memeCk: '67654543',
        termedPlan: false,
      }}
      onSelectionChange={() => {}}
    />,
  );
};

describe('PlanSwitcher Component - Google Analytics', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });
  it('View Plan - Google Analytics', async () => {
    // Should Render a Plan Dropdown with Selected Plan Value
    const component = renderUI();
    screen.getByText('View Plan:');
    screen.getByText('BlueCross BlueShield of Tennessee');
    expect(component).toMatchSnapshot();
    fireEvent.click(screen.getByText('BlueCross BlueShield of Tennessee'));
    expect(
      screen.getAllByText('BlueCross BlueShield of Tennessee').length,
    ).toBe(2);
    screen.getByText('Tennessee Valley Authority');

    //On Click of another plan, it should close the dropdown and update the selected plan.
    fireEvent.click(screen.getByText('Tennessee Valley Authority'));
    expect(window.dataLayer).toContainEqual({
      event: 'select_content',
      click_text: 'View Plan',
      click_url: undefined,
      page_section: undefined,
      selection_type: 'dropdown',
      element_category: 'Account Switching',
      action: 'click',
    });

    expect(component).toMatchSnapshot();
  });
});
