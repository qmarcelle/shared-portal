import GlobalIDCard from '@/app/memberIDCard/page';
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
} from '@testing-library/react/pure';
import userEvent from '@testing-library/user-event';

URL.createObjectURL = jest.fn().mockReturnValue('somethingURL');
global.atob = jest.fn().mockReturnValue('somethingRandom');
global.open = jest.fn();

jest
  .useFakeTimers({
    doNotFake: ['nextTick', 'setImmediate'],
  })
  .setSystemTime(new Date('2024-02-01'));

describe('Download Member ID Card Pdf', () => {
  beforeAll(() => {
    render(<GlobalIDCard />);
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

    // Api is called with required values
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'IDCardService/PDF?subscriberCk=949881000&groupId=119002&effectiveDate=02/01/2024',
      {
        headers: { consumer: 'member', portaluser: 'm905699955' },
        responseType: 'arraybuffer',
      },
    );
    await waitFor(() => {
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
    fireEvent.click(downloadIDCardButton);

    // Api is called with required values for selected date
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'IDCardService/PDF?subscriberCk=949881000&groupId=119002&effectiveDate=12/05/2025',
      {
        headers: { consumer: 'member', portaluser: 'm905699955' },
        responseType: 'arraybuffer',
      },
    );
    await waitFor(() => {
      // Pdf is viewed
      expect(global.open).toHaveBeenCalled();
      // Pdf is downloaded
      expect(mockedDownloadJs).toHaveBeenCalled();
    });
  });
});
