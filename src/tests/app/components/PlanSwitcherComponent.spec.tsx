import { PlanSwitcher } from '@/components/composite/PlanSwitcherComponent';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';

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

describe('PlanSwitcher Component', () => {
  it('should render the UI correctly', async () => {
    // Should Render a Plan Dropdown with Selected Plan Value
    const component = renderUI();
    screen.getByText('View Plan:');
    screen.getByText('BlueCross BlueShield of Tennessee');
    expect(component).toMatchSnapshot();

    //On Click of Dropdown, Should list the Current Plan as options
    fireEvent.click(screen.getByText('BlueCross BlueShield of Tennessee'));
    expect(
      screen.getAllByText('BlueCross BlueShield of Tennessee').length,
    ).toBe(2);
    screen.getByText('Tennessee Valley Authority');
    const planList = screen.getByRole('list');
    const planOptions = within(planList).getAllByRole('listitem');
    expect(planOptions.length).toBe(2);
    expect(component).toMatchSnapshot();

    //On Click of View Past Plan, dropdown should update the list with current & past plans
    fireEvent.click(screen.getByText('View Past Plans'));
    screen.getByText('Dollar General');
    const pastPlanList = screen.getByRole('list');
    const pastPlanOptions = within(pastPlanList).getAllByRole('listitem');
    expect(pastPlanOptions.length).toBe(3);
    expect(component).toMatchSnapshot();

    //On Click of another plan, it should close the dropdown and update the selected plan.
    fireEvent.click(screen.getByText('Tennessee Valley Authority'));
    const dropDownContent = screen.queryByText('Hide Past Plans');
    expect(dropDownContent).not.toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
});
