import MyHealthPage from '@/app/myHealth/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await MyHealthPage();
  return render(page);
};
const vRules = {
  futureEffective: false,
  fsaOnly: false,
  wellnessOnly: false,
  terminated: false,
  katieBeckNoBenefitsElig: false,
  blueCare: false,
  bluePerksElig: true,
  commercial: true,
  phaMemberEligible: true,
  medicare: true,
  individual: true,
};

function setisActiveAndNotFSAOnly(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}
jest.mock('../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          firstName: 'Chris',
          role: UserRole.MEMBER,
          plan: {
            memCk: '123456789',
          },
        },
        vRules: vRules,
      },
    }),
  ),
}));

describe('My Health Page', () => {
  it('should render My Health Page correctly', async () => {
    vRules.commercial = true;
    vRules.medicare = false;
    vRules.phaMemberEligible = true;
    setisActiveAndNotFSAOnly(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, James D.',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
      },
    });
    const component = await renderUI();
    expect(mockedAxios.get).toHaveBeenCalledWith('/pcPhysician/123456789');

    screen.getByText('WellTuned Blog');
    screen.getByText(
      'Visit our WellTuned blog to stay up-to-date on health and wellness news, health care developments and tips for managing your health.',
    );
    expect(screen.getByText('Health Library')).toBeVisible();
    expect(screen.getByText('Visit The Health Library')).toBeVisible();
    expect(screen.getByText('Member Wellness Center')).toBeVisible();
    expect(
      screen.getByText(
        'Take a free personal health assessment, track your diet and exercise, sync your fitness apps to earn wellness points and more—all in one secure place.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Visit Member Wellness Center')).toBeVisible();
    expect(screen.getByText('Member Discounts')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
