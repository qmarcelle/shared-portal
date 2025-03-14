import MyClaimsPage from '@/app/claims/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
        },
      },
    }),
  ),
}));

jest
  .useFakeTimers({
    doNotFake: ['nextTick', 'setImmediate'],
  })
  .setSystemTime(new Date('2024-11-28T00:00:00.000'));

describe('Claims SnapshotList Error Handling', () => {
  it('should show the error message when api fails', async () => {
    mockedAxios.get

      // Claims Data
      .mockRejectedValueOnce(
        createAxiosErrorForTest({ status: 400, errorObject: {} }),
      );

    // Render the page
    const Result = await MyClaimsPage({
      searchParams: new Promise((resolve) => {
        resolve({});
      }),
    });
    const { container } = render(Result);

    expect(screen.queryByText('13 Claims')).toBeNull();
    // Members Api was called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789',
    );
    // Claims List APi was called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789/claims?from=11-28-2022&to=11-28-2024&type=MDV&includeDependents=true',
    );

    // Error Message is shown
    expect(
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
