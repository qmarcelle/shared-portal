import GlobalIDCard from '@/app/(protected)/(common)/member/myplan/idcard';
import { mockedAxios } from '@/tests/__mocks__/axios';
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

describe('Download Member ID Card Pdf Invaild Date Error Handling', () => {
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

  it('should display error msg on invalid date selection', async () => {
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
    await user.type(futureCardDateField, '05/10/2020');

    await waitFor(() => {
      expect(
        screen.getByText('The date entered is out of range.'),
      ).toBeVisible();
    });

    await waitFor(() => {
      expect(downloadIDCardButton).toBeDisabled();
    });
  });
});
