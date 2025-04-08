import DashboardPage from '@/app/dashboard/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await DashboardPage();
  return render(page);
};

const vRules = {
  user: {
    currUsr: {
      firstName: 'Chris',
      role: UserRole.MEMBER,
      plan: {
        planName: 'BlueCross BlueShield of Tennessee',
        subId: '123456',
        grpId: '100000',
        memCk: '123456789',
        coverageType: ['Medical', 'Dental', 'Vision'],
      },
    },
    vRules: {
      futureEffective: false,
      fsaOnly: false,
      wellnessOnly: false,
      terminated: false,
      katieBeckNoBenefitsElig: false,
      blueCare: false,
      myPCPElig: false,
      subscriber: true,
      payMyPremiumElig: true,
      condensedPortalExperienceGroups: false,
      isEmboldHealth: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('Dashboard Page', () => {
  it('should render Welcome Banner UI correctly', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
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
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: '45',
          providedBy: 'Davis Vision',
          contact: '1-800-456-9876',
          url: 'https://davis-vision.com',
        },
        {
          id: '87',
          providedBy: 'Nirmal Dental',
          contact: '1-800-367-9676',
          url: 'https://nirmaldental.com',
        },
        {
          id: '25',
          providedBy: 'Low Pharm',
          contact: '1-800-834-2465',
        },
        {
          id: '289',
          providedBy: 'Quant Labs',
          contact: '1-800-834-3465',
        },
      ],
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        currentPolicies: [
          {
            memberCk: '502622001',
            subscriberName: 'REBEKAH WILSON',
            groupName: 'Radio Systems Corporation',
            memberId: '90447969100',
            planTypes: ['M', 'R', 'S'],
            amplifyMember: false,
          },
        ],
        pastPolicies: [
          {
            memberCk: '846239401',
            subscriberName: 'JOHNATHAN ANDERL',
            groupName: 'Ruby Tuesday Operations LLC',
            memberId: '90865577900',
            planTypes: ['D', 'R', 'S', 'M', 'V'],
            amplifyMember: false,
          },
        ],
      },
    });
    const component = await renderUI();
    expect(mockedFetch).toHaveBeenCalledWith(
      'PORTAL_SVCS_URL/MEM_SVC_CONTEXT/api/member/v1/members/byMemberCk/123456789',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['123456789'] },
      },
    );
    expect(screen.getByText('Plan: Chris B Hall Enterprises')).toBeVisible();
    expect(
      screen.getByText('Policies: Medical, Wellness, Vision, Dental'),
    ).toBeVisible();
    expect(screen.getByText('View Plan Details')).toBeVisible();
    expect(component).toMatchSnapshot();
    expect(screen.getByText('View Claims')).toBeVisible();
    expect(screen.getByText('View Prior Authorizations')).toBeVisible();
    expect(screen.getByText('View Balances')).toBeVisible();
    expect(screen.getByText('View Benefits & Coverage')).toBeVisible();
    expect(
      screen.queryByText('Member Wellness Center'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Member Discount')).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for Pay Premium component', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;

    vRules.user.vRules.subscriber = true;
    vRules.user.vRules.wellnessOnly = false;
    vRules.user.vRules.payMyPremiumElig = true;
    mockAuth.mockResolvedValueOnce(vRules);

    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
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
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: '45',
          providedBy: 'Davis Vision',
          contact: '1-800-456-9876',
          url: 'https://davis-vision.com',
        },
        {
          id: '87',
          providedBy: 'Nirmal Dental',
          contact: '1-800-367-9676',
          url: 'https://nirmaldental.com',
        },
        {
          id: '25',
          providedBy: 'Low Pharm',
          contact: '1-800-834-2465',
        },
        {
          id: '289',
          providedBy: 'Quant Labs',
          contact: '1-800-834-3465',
        },
      ],
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        currentPolicies: [
          {
            memberCk: '502622001',
            subscriberName: 'REBEKAH WILSON',
            groupName: 'Radio Systems Corporation',
            memberId: '90447969100',
            planTypes: ['M', 'R', 'S'],
            amplifyMember: false,
          },
        ],
        pastPolicies: [
          {
            memberCk: '846239401',
            subscriberName: 'JOHNATHAN ANDERL',
            groupName: 'Ruby Tuesday Operations LLC',
            memberId: '90865577900',
            planTypes: ['D', 'R', 'S', 'M', 'V'],
            amplifyMember: false,
          },
        ],
      },
    });
    const component = await renderUI();
    expect(mockedFetch).toHaveBeenCalledWith(
      'PORTAL_SVCS_URL/MEM_SVC_CONTEXT/api/member/v1/members/byMemberCk/123456789',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['123456789'] },
      },
    );

    expect(screen.getByText('Pay Premium')).toBeVisible();
    expect(screen.getByText('Payment Due Date')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render the Find Medical Providers card if the pzn rule is true', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);

    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
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
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: '45',
          providedBy: 'Davis Vision',
          contact: '1-800-456-9876',
          url: 'https://davis-vision.com',
        },
        {
          id: '87',
          providedBy: 'Nirmal Dental',
          contact: '1-800-367-9676',
          url: 'https://nirmaldental.com',
        },
        {
          id: '25',
          providedBy: 'Low Pharm',
          contact: '1-800-834-2465',
        },
        {
          id: '289',
          providedBy: 'Quant Labs',
          contact: '1-800-834-3465',
        },
      ],
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        currentPolicies: [
          {
            memberCk: '502622001',
            subscriberName: 'REBEKAH WILSON',
            groupName: 'Radio Systems Corporation',
            memberId: '90447969100',
            planTypes: ['M', 'R', 'S'],
            amplifyMember: false,
          },
        ],
        pastPolicies: [
          {
            memberCk: '846239401',
            subscriberName: 'JOHNATHAN ANDERL',
            groupName: 'Ruby Tuesday Operations LLC',
            memberId: '90865577900',
            planTypes: ['D', 'R', 'S', 'M', 'V'],
            amplifyMember: false,
          },
        ],
      },
    });
    const component = await renderUI();
    expect(
      screen.getByText(
        'Use the employer-provided Embold Health search tool to',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });

  it('should render the Find Medical Providers card if the pzn rule is false', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.fsaOnly = true;
    vRules.user.vRules.isEmboldHealth = false;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
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
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: '45',
          providedBy: 'Davis Vision',
          contact: '1-800-456-9876',
          url: 'https://davis-vision.com',
        },
        {
          id: '87',
          providedBy: 'Nirmal Dental',
          contact: '1-800-367-9676',
          url: 'https://nirmaldental.com',
        },
        {
          id: '25',
          providedBy: 'Low Pharm',
          contact: '1-800-834-2465',
        },
        {
          id: '289',
          providedBy: 'Quant Labs',
          contact: '1-800-834-3465',
        },
      ],
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        currentPolicies: [
          {
            memberCk: '502622001',
            subscriberName: 'REBEKAH WILSON',
            groupName: 'Radio Systems Corporation',
            memberId: '90447969100',
            planTypes: ['M', 'R', 'S'],
            amplifyMember: false,
          },
        ],
        pastPolicies: [
          {
            memberCk: '846239401',
            subscriberName: 'JOHNATHAN ANDERL',
            groupName: 'Ruby Tuesday Operations LLC',
            memberId: '90865577900',
            planTypes: ['D', 'R', 'S', 'M', 'V'],
            amplifyMember: false,
          },
        ],
      },
    });
    const component = await renderUI();

    expect(screen.queryByText('Find Medical Providers')).toBeNull();
    expect(component).toMatchSnapshot();
  });
});
