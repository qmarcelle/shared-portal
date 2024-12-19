import MyHealthPage from '@/app/myHealth/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await MyHealthPage();
  return render(page);
};

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
        vRules: {
          futureEffective: false,
          fsaOnly: false,
          wellnessOnly: false,
          terminated: false,
          katieBeckNoBenefitsElig: false,
          blueCare: false,
        },
      },
    }),
  ),
}));

describe('My Health Page', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  it('should render My Health Page correctly', async () => {
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
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/memberservice/PCPhysicianService/pcPhysician/123456789',
    );

    screen.getByText('WellTuned Blog');
    screen.getByText(
      'Visit our WellTuned blog to stay up-to-date on health and wellness news, health care developments and tips for managing your health.',
    );
    expect(screen.getByText('Health Library')).toBeVisible();
    expect(screen.getByText('Visit The Health Library')).toBeVisible();
    expect(screen.getByText('Schedule a Biometric Screening')).toBeVisible();
    expect(screen.getByText('Member Wellness Center')).toBeVisible();
    expect(
      screen.getByText(
        'Take a free personal health assessment, track your diet and exercise, sync your fitness apps to earn wellness points and more—all in one secure place.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Visit Member Wellness Center')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
