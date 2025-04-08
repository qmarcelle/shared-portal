import { PlanDetailsSection } from '@/app/myPlan/components/PlanDetailsSection';
import { AllMyPlanData } from '@/app/myPlan/model/app/myPlanData';
import MyPlanPage from '@/app/myPlan/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const setupUI = async () => {
  return await MyPlanPage();
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
const mockPlanData: AllMyPlanData<string>[] = [
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
    primaryPhoneNumber: '123456789',
    secondaryPhoneNumber: '',
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
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
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
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
  },
];
describe('PlanDetailsSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });

  test('renders plan details correctly', async () => {
    await setupUI();

    const { container } = render(
      <PlanDetailsSection
        className="test-class"
        svgData={null}
        planType="Test Plan Type"
        visibilityRules={undefined}
        planData={mockPlanData}
      />,
    );

    // Check for the title
    expect(screen.getByText('Plan Details')).toBeInTheDocument();

    expect(screen.getByText(/View Who's Covered/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/View Who's Covered/i));

    expect(screen.getByText('Christmas Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 6/29/2009')).toBeInTheDocument();
    const contactInfo = screen.queryAllByText(/View Plan Contact Information/i);
    fireEvent.click(contactInfo[0]);
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('renders error message when plan type is not available', () => {
    render(
      <PlanDetailsSection
        className="test-class"
        svgData={null}
        planType={null}
        visibilityRules={undefined}
        planData={mockPlanData}
      />,
    );

    // Check for the error message
    expect(
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeInTheDocument();
  });
});
