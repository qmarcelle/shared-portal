import OfficeVisits from '@/app/benefits/officeVisits/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
const renderUI = () => {
  return render(<OfficeVisits />);
};
describe('Office Visits Detail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render UI correctly', () => {
    const component = renderUI();
    expect(screen.getByText('Office Visits')).toBeInTheDocument();
    expect(screen.getByText('Benefit Level 1'));
    expect(screen.queryAllByText('[Services performed by ...]')).toHaveLength(
      2,
    );
    expect(screen.getByText('Benefit Level 2')).toBeInTheDocument();

    expect(
      screen.getByText('Benefit Level 1 Office Visit, PCP In-Network:'),
    ).toBeInTheDocument();

    expect(screen.queryAllByText('$10 Copay')).toHaveLength(2);
    expect(
      screen.getByText('Benefit Level 2 Office Visit, PCP In-Network:'),
    ).toBeInTheDocument();
    expect(screen.getByText('$30 Copay')).toBeInTheDocument();
    expect(
      screen.getByText('Office Visit, PCP Out-of-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('40$ Coinsurance after you pay deductible'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 1 Office Visit, Specialist In-Network:'),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('$45 Copay')).toHaveLength(5);
    expect(
      screen.getByText('Benefit Level 2 Office Visit, Specialist In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.queryAllByText('40% Coinsurance after you pay deductible'),
    ).toHaveLength(4);
    expect(
      screen.getByText('Benefit Level 1 Office Visit, Specialist In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 2 Office Visit, Specialist In-Network:'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Office Visit, Specialist Out-of-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 1 Office Surgery, PCP In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 2 Office Visit, PCP In-Network:'),
    ).toBeInTheDocument();
    expect(screen.getByText('$30 Copay')).toBeInTheDocument();
    expect(
      screen.getByText('Office Visit, PCP Out-of-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 1 Office Visit, Specialist In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Office Visit, Specialist Out-of-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 1 Office Surgery, PCP In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 2 Office Surgery, PCP In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Office Surgery, PCP Out-of-Network:'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Benefit Level 1 Office Surgery, Specialist In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 2 Office Surgery, Specialist In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Office Surgery, Specialist Out-of-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 1 Routine Diagnostic Services, Office In-Network:',
      ),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('$0 Copay')).toHaveLength(8);
    expect(
      screen.getByText(
        'Benefit Level 2 Routine Diagnostic Services, Office In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 1 Teladoc Health General Medical In-Network:',
      ),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('$15 Copay')).toHaveLength(6);
    expect(
      screen.getByText(
        'Benefit Level 2 Teladoc Health General Medical In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 1 Teladoc Health Mental Health Care In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 2 Teladoc Health Mental Health Care In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 1 Teladoc Health Mental Health Digital Program In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 2 Teladoc Health Mental Health Digital Program In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 1 Teladoc Health Dermatology In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 2 Teladoc Health Dermatology In-Network:',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Benefit Level 1 Teladoc Health Back and Joint Care In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 2 Teladoc Health Back and Joint Care In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 1 Teladoc Health Nutrition Counseling In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 2 Teladoc Health Nutrition Counseling In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 1 Chiropractic Manipulation In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.queryAllByText('20% Coinsurance after you pay the deductible'),
    ).toHaveLength(2);
    expect(
      screen.getByText('Benefit Level 2 Chiropractic Manipulation In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Chiropractic Manipulation Out-of-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Limited to 60 visits per benefit period.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 1 Urgent Care, Facility In-Network:'),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('$50 Copay')).toHaveLength(2);
    expect(
      screen.getByText('Benefit Level 2 Urgent Care, Facility In-Network:'),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('$60 Copay')).toHaveLength(2);

    expect(
      screen.getByText('Urgent Care, Facility Out-of-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 1 Urgent Care, Physician In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 2 Urgent Care, Physician In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Urgent Care, Physician Out-of-Network:'),
    ).toBeInTheDocument();

    //Estimate Costs
    expect(screen.getByText('Estimate Costs')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Plan your upcoming care costs before you make an appointment.',
      ),
    ).toBeInTheDocument();

    //Services Used
    expect(screen.getByText('Services Used')).toBeInTheDocument();
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "View a list of common services, the maximum amount covered by your plan and how many you've used.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 2 Urgent Care, Facility In-Network:'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Benefit Level 2 Urgent Care, Facility In-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Benefit Level 2 Urgent Care, Facility In-Network:'),
    ).toBeInTheDocument();

    //get Help
    expect(screen.getByText('Get Help with Benefits')).toBeInTheDocument();
    expect(
      screen.getByText('if you need help, please help reach out to us.You can'),
    ).toBeInTheDocument();
    expect(screen.getByText('start a chat')).toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
