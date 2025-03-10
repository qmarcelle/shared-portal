import ClaimsDetailPage from '@/app/claims/[id]/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
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

jest.mock('src/utils/encryption', () => ({
  decrypt: jest.fn(() => {
    return 'EXT820200100';
  }),
}));

describe('Claim Details Error Handling', () => {
  it('should show the Error Info Card on claim details page when api throws 400', async () => {
    mockedAxios.get
      // LoggedIn User Info
      .mockResolvedValueOnce({
        data: loggedInUserInfoMockResp,
      })
      .mockRejectedValueOnce(
        createAxiosErrorForTest({ status: 400, errorObject: {} }),
      );
    // Render the page
    const result = await ClaimsDetailPage({
      searchParams: { type: 'M' },
      params: {
        id: 'aW9pZ0F3V0lwZHlrbnBaeUVtaGk3QT09O2QwY2JmOWQ0ZWNiZjM0OWU=',
      },
    });
    const { container } = render(result);

    // Members Api was called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789',
    );
    // Claim Detail APi was called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/v1/claims/654567656/EXT820200100/M',
    );
    expect(
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
