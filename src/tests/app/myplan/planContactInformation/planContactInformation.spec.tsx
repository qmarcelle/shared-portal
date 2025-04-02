import { AllMyPlanData } from '@/app/myPlan/model/app/myPlanData';
import PlanContactInformation from '@/app/myPlan/planContactInformation';
import PlanContactInformationPage from '@/app/myPlan/planContactInformation/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const setupUI = async () => {
  return await PlanContactInformationPage();
};

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            memCk: '91722407',
            grpId: '100000',
            sbsbCk: '91722400',
          },
        },
      },
    }),
  ),
}));
const mockPlanData: AllMyPlanData[] = [
  {
    memberName: 'CHRISTMAS HALL',
    dob: '06/29/2009',
    planDetails: [
      {
        productCategory: 'M',
        planID: 'MBPX0806',
        effectiveDate: 1546318800000,
        planStartDate: 1514782800000,
        planClassID: 'PPOA',
        networkPlanName: 'Blue Network P',
        isMedical: true,
        isDental: false,
        isVision: false,
        isSupplemental: false,
      },
      {
        productCategory: 'S',
        planID: 'WSXM0218',
        effectiveDate: 1546318800000,
        planStartDate: 1514782800000,
        planClassID: 'PPOA',
        networkPlanName: 'Wellness Plan',
        isMedical: false,
        isDental: false,
        isVision: false,
        isSupplemental: true,
      },
      {
        productCategory: 'V',
        planID: 'VEMGN002',
        effectiveDate: 1546318800000,
        planStartDate: 1383278400000,
        planClassID: 'PPOA',
        networkPlanName: 'Vision Blue',
        isMedical: false,
        isDental: false,
        isVision: true,
        isSupplemental: false,
      },
      {
        productCategory: 'D',
        planID: 'DEHCNY02',
        effectiveDate: 1546318800000,
        planStartDate: 1383278400000,
        planClassID: 'PPOA',
        networkPlanName: 'Vision Blue',
        isMedical: false,
        isDental: true,
        isVision: false,
        isSupplemental: false,
      },
    ],
    medicalEffectiveDate: '1/1/2019',
    dentalEffectiveDate: '1/1/2019',
    visionEffectiveDate: '1/1/2019',
    address: '',
    primaryPhoneNumber: '7654387656',
    secondaryPhoneNumber: '',
    age: 15,
  },
  {
    memberName: 'KRISSY HALL',
    dob: '06/15/2009',
    planDetails: [
      {
        productCategory: 'M',
        planID: 'MBPX0806',
        effectiveDate: 1546318800000,
        planStartDate: 1514782800000,
        planClassID: 'PPOA',
        networkPlanName: 'Blue Network P',
        isMedical: true,
        isDental: false,
        isVision: false,
        isSupplemental: false,
      },
      {
        productCategory: 'S',
        planID: 'WSXM0218',
        effectiveDate: 1546318800000,
        planStartDate: 1514782800000,
        planClassID: 'PPOA',
        networkPlanName: 'Wellness Plan',
        isMedical: false,
        isDental: false,
        isVision: false,
        isSupplemental: true,
      },
      {
        productCategory: 'V',
        planID: 'VEMGN002',
        effectiveDate: 1546318800000,
        planStartDate: 1383278400000,
        planClassID: 'PPOA',
        networkPlanName: 'Vision Blue',
        isMedical: false,
        isDental: false,
        isVision: true,
        isSupplemental: false,
      },
    ],
    medicalEffectiveDate: '1/1/2019',
    dentalEffectiveDate: '',
    visionEffectiveDate: '1/1/2019',
    address: '',
    primaryPhoneNumber: '7674368634',
    secondaryPhoneNumber: '',
    age: 15,
  },
  {
    memberName: 'CHRIS HALL',
    dob: '08/06/1959',
    planDetails: [
      {
        productCategory: 'D',
        planID: 'DEHCNY02',
        effectiveDate: 1509508800000,
        planStartDate: 1451624400000,
        planClassID: 'PPOA',
        networkPlanName: 'DentalBlue Preferred Network',
        isMedical: false,
        isDental: true,
        isVision: false,
        isSupplemental: false,
      },
      {
        productCategory: 'M',
        planID: 'MBPX0806',
        effectiveDate: 1546318800000,
        planStartDate: 1514782800000,
        planClassID: 'PPOA',
        networkPlanName: 'Blue Network P',
        isMedical: true,
        isDental: false,
        isVision: false,
        isSupplemental: false,
      },
      {
        productCategory: 'S',
        planID: 'WSXM0218',
        effectiveDate: 1546318800000,
        planStartDate: 1514782800000,
        planClassID: 'PPOA',
        networkPlanName: 'Wellness Plan',
        isMedical: false,
        isDental: false,
        isVision: false,
        isSupplemental: true,
      },
      {
        productCategory: 'V',
        planID: 'VEMGN002',
        effectiveDate: 1546318800000,
        planStartDate: 1383278400000,
        planClassID: 'PPOA',
        networkPlanName: 'Vision Blue',
        isMedical: false,
        isDental: false,
        isVision: true,
        isSupplemental: false,
      },
    ],
    medicalEffectiveDate: '1/1/2019',
    dentalEffectiveDate: '11/1/2017',
    visionEffectiveDate: '1/1/2019',
    address: '',
    primaryPhoneNumber: '7654387658',
    secondaryPhoneNumber: '',
    age: 65,
  },
];

describe('PlanContactInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  it('should render the UI correctly', async () => {
    await setupUI();
    const { container } = render(
      <PlanContactInformation planData={mockPlanData} />,
    );
    expect(screen.getByText('CHRISTMAS HALL')).toBeInTheDocument();
    expect(screen.getByText('DOB: 06/29/2009')).toBeInTheDocument();
    expect(screen.getByText('7654387656')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Below is the mailing address and phone number associated with your plan.',
      ),
    );
    expect(
      screen.getByRole('heading', { name: 'About Plan Contact Information' }),
    ).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
