import { EditAlertPreferncesSection } from '@/app/communicationSettings/components/EditAlertPreferences';
import { CommunicationSettingsAppData } from '@/app/communicationSettings/models/app/communicationSettingsAppData';
import CommunicationSettingsPage from '@/app/communicationSettings/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const result = await CommunicationSettingsPage();
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

describe('Communication Settings API Integration', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  test('Communication Settings API integration  success scenario', async () => {
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

  test('Communication Settings API integration null scenario', async () => {
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
  test('Communication Settings API Failure scenario', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });

    setupUI();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberContactPreference?memberKey=91722407&subscriberKey=91722400&getMemberPreferenceBy=memberKeySubscriberKey&extendedOptions=true',
      );
      const preferenceData: CommunicationSettingsAppData = {
        emailAddress: '',
        mobileNumber: '',
        tierOneDescriptions: [{ hTexts: [], pTexts: [] }],
      };
      render(
        <EditAlertPreferncesSection alertPreferenceData={preferenceData} />,
      );
      expect(
        screen.getByText(
          /We're not able to load your communication settings right now. Please try again later./i,
        ),
      ).toBeInTheDocument();
    });
  });
});
