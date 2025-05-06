import GlobalIDCard from '@/app/(protected)/(common)/member/myplan/idcard';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedDownloadJs } from '@/tests/__mocks__/downloadjs';
import '@testing-library/jest-dom';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

URL.createObjectURL = jest.fn().mockReturnValue('somethingURL');
global.atob = jest.fn().mockReturnValue('somethingRandom');
global.open = jest.fn();

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            grpId: '100000',
            sbsbCk: '91722400',
          },
        },
      },
    }),
  ),
}));

jest
  .useFakeTimers({
    doNotFake: ['nextTick', 'setImmediate'],
  })
  .setSystemTime(new Date('2024-02-01T00:00:00.000'));

describe('Download Member ID Card Pdf', () => {
  beforeEach(async () => {
    const input = {
      idCardSvgFrontData: null,
      idCardSvgBackData: null,
      memberDetails: null,
    };
    render(<GlobalIDCard data={input} />);
  });

  afterAll(() => {
    cleanup();
  });

  it('should download id card successfully for current date', async () => {
    // Setup Mocks

    mockedAxios.get.mockResolvedValue({
      data: 'SomeRandomPDFBinaryDataWhichisanything',
    });

    const downloadIDCardButton = screen.getByRole('button', {
      name: /Download ID Card/i,
    });

    fireEvent.click(downloadIDCardButton);

    await waitFor(() => {
      // Api is called with required values
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/PDF?subscriberCk=91722400&groupId=100000&effectiveDate=02/01/2024',
        {
          responseType: 'arraybuffer',
        },
      );
      // Pdf is viewed
      expect(global.open).toHaveBeenCalled();
      // Pdf is downloaded
      expect(mockedDownloadJs).toHaveBeenCalled();
    });
  });

  it('should download id card successfully for future date', async () => {
    // Setup Mocks
    mockedAxios.get.mockResolvedValue({
      data: 'SomeRandomPDFBinaryDataWhichisanything',
    });

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    // The date selector should not be shown if the future day radio is not clicked
    expect(
      screen.queryByRole('textbox', {
        name: /When does this plan begin?/i,
      }),
    ).not.toBeInTheDocument();

    const futureCardRadio = screen.getByText(
      'Get a card for a plan starting at a later date.',
    );
    const downloadIDCardButton = screen.getByRole('button', {
      name: /Download ID Card/i,
    });

    act(() => {
      fireEvent.click(futureCardRadio);
    });
    await waitFor(() => {
      expect(
        screen.getByRole('textbox', {
          name: /When does this plan begin?/i,
        }),
      ).toBeInTheDocument();
    });
    const futureCardDateField = screen.getByRole('textbox', {
      name: /When does this plan begin?/i,
    });
    await user.type(futureCardDateField, '12/05/2025');
    await waitFor(() => {
      expect(downloadIDCardButton).not.toBeDisabled();
    });
    fireEvent.click(downloadIDCardButton);

    await waitFor(() => {
      // Api is called with required values for selected date
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/PDF?subscriberCk=91722400&groupId=100000&effectiveDate=12/05/2025',
        {
          responseType: 'arraybuffer',
        },
      );
      // Pdf is viewed
      expect(global.open).toHaveBeenCalled();
      // Pdf is downloaded
      expect(mockedDownloadJs).toHaveBeenCalled();
    });
  });
});
