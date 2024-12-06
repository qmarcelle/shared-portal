import GlobalIDCard from '@/app/memberIDCard';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react/pure';

URL.createObjectURL = jest.fn().mockReturnValue('somethingURL');
global.atob = jest.fn().mockReturnValue('somethingRandom');
global.open = jest.fn();

jest
  .useFakeTimers({
    doNotFake: ['nextTick', 'setImmediate'],
  })
  .setSystemTime(new Date('2024-02-01T00:00:00.000'));

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

describe('Download Member ID Card Pdf API Error Handling', () => {
  beforeAll(() => {
    render(
      <GlobalIDCard
        data={{
          idCardSvgBackData: null,
          idCardSvgFrontData: null,
          memberDetails: null,
        }}
      />,
    );
  });

  afterAll(() => {
    cleanup();
  });

  it('should display error msg on download id card API fails', async () => {
    // Setup Mocks
    mockedAxios.get.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 500,
      }),
    );

    const downloadIDCardButton = screen.getByRole('button', {
      name: /Download ID Card/i,
    });

    fireEvent.click(downloadIDCardButton);

    // Api is called with required values
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'IDCardService/PDF?subscriberCk=91722400&groupId=100000&effectiveDate=02/01/2024',
        {
          responseType: 'arraybuffer',
        },
      );
      expect(
        screen.getByText(
          'Your digital ID card is unavailable right now. We’re working on it and hope to have it up soon.',
        ),
      ).toBeVisible();
    });
  });
});
