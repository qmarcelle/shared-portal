import MyHealthPage from '@/app/myHealth/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
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
          blueCare: true,
        },
      },
    }),
  ),
}));

describe('My Health Page for BlueCare', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
  });

  it('should render My Health Page correctly for Blue Care', async () => {
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
    expect(screen.getByText('Louthan, James D.')).toBeVisible();
    expect(screen.getByText('2033 Meadowview Ln Ste 200')).toBeVisible();
    expect(screen.getByText('My Primary Care Provider')).toBeVisible();
    expect(
      screen.getByText('View or Update Primary Care Provider'),
    ).toBeVisible();
    expect(screen.getByText('Get One-on-One Health Support')).toBeVisible();
    expect(
      screen.getByText(
        'We offer a health program that’s designed just for you. Whether you need support for healthy living or help with a long- or short-term illness or injury, you can rely on us.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText('Fill-out The Health History & Needs Survey'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Help us get a clear picture of your health needs. We need this info once a year from all our members. Please take a few minutes to complete this survey.',
      ),
    ).toBeVisible();
    screen.getByText('WellTuned Blog');
    screen.getByText(
      'Visit our WellTuned blog to stay up-to-date on health and wellness news, health care developments and tips for managing your health.',
    );
    expect(screen.getByText('Health Library')).toBeVisible();
    expect(screen.getByText('Visit The Health Library')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
