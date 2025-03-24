import { UpdateCommunicationTerms } from '@/app/communicationSettings/journeys/UpdateCommunicationTerms';
import { CommunicationSettingsSaveResponse } from '@/app/communicationSettings/models/app/communicationSettingsAppData';
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
  waitFor,
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

    // Ensure the checkbox is present and click it
    const checkbox = screen.getByLabelText('Warning message');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);

    // Ensure the button is present and clickable
    const saveButton = screen.getByText('Save Changes');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toHaveClass('opacity-50');

    // Click the button
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/memberContactPreference?memberKey=${session?.user.currUsr?.plan.memCk}&subscriberKey=${session?.user.currUsr?.plan.sbsbCk}&getMemberPreferenceBy=memberKeySubscriberKey&extendedOptions=true',
        {
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
        },
      );
      expect(component.baseElement).toMatchSnapshot();
    });
  });
  test('communication Information Email API integration failure scenario', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('An error occurred'));

    // Ensure the checkbox is present and click it
    const checkbox = screen.getByLabelText('Warning message');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);

    // Ensure the button is present and clickable
    const saveButton = screen.getByText('Save Changes');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toHaveClass('opacity-50');

    // Click the button
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/memberContactPreference?memberKey=${session?.user.currUsr?.plan.memCk}&subscriberKey=${session?.user.currUsr?.plan.sbsbCk}&getMemberPreferenceBy=memberKeySubscriberKey&extendedOptions=true',
        {
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
        },
      );

      // Ensure changePage is not called
      expect(mockChangePage).not.toHaveBeenCalled();
    });
  });
});
