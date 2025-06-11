import { UpdateCommunicationText } from '@/app/communicationSettings/journeys/UpdateCommunicationText';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            grpId: '21908',
            sbsbCk: '502622000',
            memCk: '502622001',
          },
        },
      },
    }),
  ),
}));

const showAppModal = useAppModalStore.getState().showAppModal;
const dismissAppModal = useAppModalStore.getState().dismissModal;

const mockChangePage = jest.fn();

const renderUI = () => {
  return render(<AppModal />);
};

describe('UpdateCommunicationText Component', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
    act(() => {
      dismissAppModal();
      renderUI();

      showAppModal({
        content: (
          <UpdateCommunicationText
            phone={'123456789'}
            changePage={mockChangePage}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onRequestPhoneNoSuccessCallBack={(arg0: string) => {}}
            email={'test@gmail.com'}
            preferenceData={[
              {
                optOut: 'I',
                communicationCategory: 'TEXT',
                communicationMethod: 'TEXT',
              },
              {
                optOut: 'O',
                communicationCategory: 'PLIN',
                communicationMethod: 'EML',
              },
              {
                optOut: 'I',
                communicationCategory: 'CLMS',
                communicationMethod: 'EML',
              },
              {
                optOut: 'I',
                communicationCategory: 'HLTW',
                communicationMethod: 'EML',
              },
            ]}
          />
        ),
      });
    });
  });

  it('renders the initial page correctly', () => {
    expect(screen.getByText('Update Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('displays error message for invalid phone number', async () => {
    const phoneNumberInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneNumberInput, { target: { value: 'invalid' } });
    fireEvent.blur(phoneNumberInput);
    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid Phone number.'),
      ).toBeInTheDocument();
    });
  });

  it('enables Next button for valid phone number and calls API', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          updateContactPreference: {
            ticketNumber: 'D8BD5CDF-7FB3-4D72-9EBE-7E0B254A19C4',
            status: '3',
          },
          validationFailure: {},
        },
        details: {
          componentName: 'membercontactpreference',
          componentStatus: 'Success',
          returnCode: '0',
          subSystemName: 'Multiple Services',
          message: '',
          problemTypes: '0',
          innerDetails: {},
        },
      },
    });
    const phoneNumberInput = screen.getByLabelText('Phone Number');
    await userEvent.type(phoneNumberInput, '0');

    await waitFor(() => {
      expect(screen.getByText('Next')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/memberContactPreference',
        {
          mobileNumber: '1234567890',
          emailAddress: 'test@gmail.com',
          memberKey: '502622001',
          subscriberKey: '502622000',
          groupKey: '21908',
          lineOfBusiness: 'REGL',
          contactPreference: [
            {
              optOut: 'I',
              communicationCategory: 'TEXT',
              communicationMethod: 'TEXT',
            },
            {
              optOut: 'O',
              communicationCategory: 'PLIN',
              communicationMethod: 'EML',
            },
            {
              optOut: 'I',
              communicationCategory: 'CLMS',
              communicationMethod: 'EML',
            },
            {
              optOut: 'I',
              communicationCategory: 'HLTW',
              communicationMethod: 'EML',
            },
          ],
        },
      );
      expect(screen.getByText('Phone Number Updated')).toBeVisible();
    });
  });

  it('enables Next button for valid phone number and calls API - Failure Scenario', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          updateContactPreference: {
            ticketNumber: 'D8BD5CDF-7FB3-4D72-9EBE-7E0B254A19C4',
            status: '3',
          },
          validationFailure: {},
        },
        details: {
          componentName: 'membercontactpreference',
          componentStatus: 'Failure',
          returnCode: '0',
          subSystemName: 'Multiple Services',
          message: '',
          problemTypes: '0',
          innerDetails: {},
        },
      },
    });
    const phoneNumberInput = screen.getByLabelText('Phone Number');
    await userEvent.type(phoneNumberInput, '0');

    await waitFor(() => {
      expect(screen.getByText('Next')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/memberContactPreference',
        {
          mobileNumber: '1234567890',
          emailAddress: 'test@gmail.com',
          memberKey: '502622001',
          subscriberKey: '502622000',
          groupKey: '21908',
          lineOfBusiness: 'REGL',
          contactPreference: [
            {
              optOut: 'I',
              communicationCategory: 'TEXT',
              communicationMethod: 'TEXT',
            },
            {
              optOut: 'O',
              communicationCategory: 'PLIN',
              communicationMethod: 'EML',
            },
            {
              optOut: 'I',
              communicationCategory: 'CLMS',
              communicationMethod: 'EML',
            },
            {
              optOut: 'I',
              communicationCategory: 'HLTW',
              communicationMethod: 'EML',
            },
          ],
        },
      );
      expect(screen.getByText('Something went wrong.')).toBeVisible();
    });
  });
});
