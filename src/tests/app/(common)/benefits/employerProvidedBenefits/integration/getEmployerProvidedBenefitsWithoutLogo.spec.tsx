import EmployerProvidedBenfitsPage from '@/app/(protected)/(common)/member/myplan/benefits/employerProvidedBenefits/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('../../../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: { currUsr: { plan: { memCk: '123456789', grpId: '87498' } } },
    }),
  ),
}));

describe('Employer Provided Benefits Page Api Integration', () => {
  it('should call the api and display results correctly without logo', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        benefitSumInfo: [
          {
            tiered: false,
            carveOutInfo: [
              {
                name: 'Aetna EAP',
                contactNumber: '\t1-800-673-2211, www.resourcesforliving.com',
                defaultText: 'TP',
              },
              {
                name: 'Altra EAP',
                contactNumber: '\t1-800-673-2212, www.altraeap.com',
                defaultText: 'TP',
              },
            ],
            netWorksAndTierInfo: [],
            listOfServices: [],
          },
          {
            tiered: false,
            carveOutInfo: [
              {
                name: 'Aprt EAP',
                contactNumber: '\t1-800-673-2311, www.aprt.com',
                defaultText: 'TP',
              },
            ],
            netWorksAndTierInfo: [],
            listOfServices: [],
          },
        ],
      },
    });

    const Page = await EmployerProvidedBenfitsPage();
    render(Page);

    // getEmployerBenefits api should be called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789/benefits/employerProvidedBenefits',
    );

    // Page should show items correctly
    expect(screen.getByText('Aetna EAP')).toBeVisible();
    expect(screen.getByText('Altra EAP')).toBeVisible();
    expect(screen.getByText('Aprt EAP')).toBeVisible();
    // Logo for Dollar General group should not be visible
    expect(screen.queryAllByAltText('Provider logo')).toEqual([]);
  });
});
