import EmployerProvidedBenfitsPage from '@/app/(common)/myplan/benefits/employerProvidedBenefits/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('../../../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({ user: { currUsr: { plan: { memCk: '123456789' } } } }),
  ),
}));

describe('Employer Provided Benefits Page Api Error', () => {
  it('should call the api and handle api error', async () => {
    mockedAxios.get.mockRejectedValueOnce('An error occurred');

    const Page = await EmployerProvidedBenfitsPage();
    render(Page);

    // getEmployerBenefits api should be called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789/benefits/employerProvidedBenefits',
    );

    // Page should show error scenario
    expect(
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeVisible();
  });
});
