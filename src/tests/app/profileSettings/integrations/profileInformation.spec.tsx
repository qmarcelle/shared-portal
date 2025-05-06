import ProfileSettingsPage from '@/app/(protected)/(common)/member/profileSettings/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const result = await ProfileSettingsPage();
  render(result);
};

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            grpId: '100000',
            sbsbCk: '91722400',
            memCk: '91722407',
          },
        },
      },
    }),
  ),
}));

describe('Profile Information API Integration', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
  });
  test('Profile Information Email API integration  success scenario', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        isEmailVerified: false,
        isPeobExcluded: true,
        mobileNumber: '',
        emailAddress: 'navya_cs@bcbst.com',
        lineOfBusiness: 'REGL',
        links: {
          contactUs: 'https://www.bcbst.com/contact-us.page?nav=header',
          learnMore:
            'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security/browser-security.page',
        },
        dutyToWarn: [
          {
            type: 'p',
            texts: [
              'By checking this box I agree to enroll in email and/or mobile text communication service, and that I&apos;m a member 18 or older, or the legal guardian or personal representative of a member. BlueCross, its affiliates and its service providers may send me email and/or text communications that also go out to other members at the same time. Unencrypted email or text messages may possibly be intercepted and read by people other than those it&apos;s addressed to. Message and data rates may apply.',
            ],
          },
        ],
        contactPreferences: [],
        tierOne: [
          {
            communicationCategory: 'TEXT',
            communicationMethod: 'TEXT',
            hasTierTwo: false,
            description: [
              {
                type: 'p',
                texts: ['Get available communications via text'],
              },
            ],
          },
          {
            communicationCategory: 'PLIN',
            communicationMethod: 'EML',
            hasTierTwo: false,
            description: [
              {
                type: 'h',
                texts: ['Important Plan Information'],
              },
              {
                type: 'p',
                texts: [
                  'We&apos;ll send you details about your coverage including updates to your network, benefits and appeals.',
                ],
              },
            ],
          },
          {
            communicationCategory: 'CLMS',
            communicationMethod: 'EML',
            hasTierTwo: false,
            description: [
              {
                type: 'h',
                texts: ['Claims Information'],
              },
              {
                type: 'p',
                texts: ['Get notifications about your share of care costs.'],
              },
            ],
          },
          {
            communicationCategory: 'HLTW',
            communicationMethod: 'EML',
            hasTierTwo: false,
            description: [
              {
                type: 'h',
                texts: ['Health &amp; Wellness'],
              },
              {
                type: 'p',
                texts: [
                  'We&apos;ll send you tips and reminders to help you get the care you need and stay well.',
                ],
              },
            ],
          },
        ],
      },
    });

    setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberContactPreference?memberKey=91722407&subscriberKey=91722400&getMemberPreferenceBy=memberKeySubscriberKey&extendedOptions=true',
      );
    });
  });

  test('Profile Information Email API integration null scenario', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });

    setupUI();

    await waitFor(() => {
      const response = expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberContactPreference?memberKey=91722407&subscriberKey=91722400&getMemberPreferenceBy=memberKeySubscriberKey&extendedOptions=true',
      );
      expect(response).toBeNull;
    });
  });

  test('Profile Information Phone number API integration success scenario', async () => {
    const effectiveDetials = new Date().toLocaleDateString(); // current date
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
    mockedAxios.get.mockResolvedValueOnce({
      links: [
        {
          link: 'https://gtest.js.gdc.bcbst.com/PortalServices/IDCardService/OperationHours',
          rel: 'Self',
        },
        {
          link: 'https://gtest.js.gdc.bcbst.com/PortalServices/IDCardService/Data',
          rel: 'Data',
        },
        {
          link: 'https://gtest.js.gdc.bcbst.com/PortalServices/IDCardService/Details',
          rel: 'Details',
        },
        {
          link: 'https://gtest.js.gdc.bcbst.com/PortalServices/IDCardService/PDF',
          rel: 'PDF',
        },
        {
          link: 'https://gtest.js.gdc.bcbst.com/PortalServices/IDCardService/Image',
          rel: 'Image',
        },
        {
          link: 'https://gtest.js.gdc.bcbst.com/PortalServices/IDCardService/Order',
          rel: 'Order',
        },
      ],
      operationHours: 'M-F 8AM-6PM (EST)',
      memberServicePhoneNumber: '1-800-565-9140',
    });

    setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/OperationHours?groupId=100000&subscriberCk=91722400&effectiveDetials=${effectiveDetials}`,
      );
    });
  });

  test('Profile Information Phone number API integration null scenario', async () => {
    const effectiveDetials = new Date().toLocaleDateString(); // current date

    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });

    setupUI();

    await waitFor(() => {
      const response = expect(mockedAxios.get).toHaveBeenCalledWith(
        `/OperationHours?groupId=100000&subscriberCk=91722400&effectiveDetials=${effectiveDetials}`,
      );
      expect(response).toBeNull;
    });
  });
});
