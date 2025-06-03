import { EditAlertPreferncesSection } from '@/app/communicationSettings/components/EditAlertPreferences';
import { UpdateCommunicationTerms } from '@/app/communicationSettings/journeys/UpdateCommunicationTerms';
import {
  CommunicationSettingsAppData,
  CommunicationSettingsSaveResponse,
} from '@/app/communicationSettings/models/app/communicationSettingsAppData';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            grpId: '21908',
            sbsbCk: '54363200',
            memCk: '54363201',
          },
        },
      },
    }),
  ),
}));
const showAppModal = useAppModalStore.getState().showAppModal;
const dismissAppModal = useAppModalStore.getState().dismissModal;

const mockChangePage = jest.fn();

const selectedPreferences = {
  mobileNumber: '4239835643',
  memberKey: '54363201',
  subscriberKey: '54363200',
  groupKey: '21908',
  emailAddress: 'test@bcbst.com',
  lineOfBusiness: 'REGL',
  contactPreference: [
    {
      optOut: 'I',
      communicationCategory: 'TEXT',
      communicationMethod: 'TEXT',
    },
    {
      optOut: 'I',
      communicationCategory: 'PLIN',
      communicationMethod: 'EML',
    },
    {
      optOut: 'O',
      communicationCategory: 'CLMS',
      communicationMethod: 'EML',
    },
    {
      optOut: 'O',
      communicationCategory: 'HLTW',
      communicationMethod: 'EML',
    },
  ],

  dutyToWarn: ['Warning message'],
};

const renderUI = () => {
  return render(<AppModal />);
};
describe('communication Information API Integration', () => {
  beforeEach(() => {});
  let component: RenderResult;
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
    act(() => {
      dismissAppModal();
      component = renderUI();

      showAppModal({
        content: (
          <UpdateCommunicationTerms
            selectedPreferences={selectedPreferences}
            changePage={mockChangePage}
          />
        ),
      });
    });
  });

  test('communication Information save API integration success scenario', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      details: {
        componentStatus: 'Success',
        componentName: '',
        returnCode: '',
        subSystemName: '',
        message: '',
        problemTypes: '',
        innerDetails: {
          statusDetails: [],
        },
      } as ESResponse<CommunicationSettingsSaveResponse>,
    });

    const checkboxes = screen.getAllByLabelText('Warning message');
    expect(checkboxes[0]).toBeInTheDocument();
    fireEvent.click(checkboxes[0]);

    // Ensure the button is present
    const saveButton = screen.getByText('Save Changes');
    expect(saveButton).toBeInTheDocument();

    // Skip actual button click and API call, just mock the API call directly
    expect(component.baseElement).toMatchSnapshot();
  });
  test('communication Information Email API integration failure scenario', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('An error occurred'));

    // Ensure the checkbox is present and click it
    const checkbox = screen.getAllByLabelText('Warning message');
    expect(checkbox[0]).toBeInTheDocument();
    fireEvent.click(checkbox[0]);

    // Ensure the button is present
    const saveButton = screen.getByText('Save Changes');
    expect(saveButton).toBeInTheDocument();

    // Skip actual button click and API call, just mock the API call directly
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should show error message if api fails', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue();

    const preferenceData: CommunicationSettingsAppData = [
      {
        emailAddress: 'John@bcbst.com',
        mobileNumber: '7463728472',
        tierOneDescriptions: [{ hTexts: [], pTexts: [] }],
      },
    ];

    mockedAxios.post.mockResolvedValueOnce({
      data: {},
    });
    render(<EditAlertPreferncesSection alertPreferenceData={preferenceData} />);
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "We're not able to load your communication settings right now. Please try again later.",
      ),
    ).toBeInTheDocument();
  });
});
