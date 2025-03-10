import { MemberList } from '@/app/myPlan/updateSocialSecurityNumber/models/app/memberList';
import UpdateSocialSecurityNumberPage from '@/app/myPlan/updateSocialSecurityNumber/page';
import { AppModal } from '@/components/foundation/AppModal';
import { ESResponse } from '@/models/enterprise/esResponse';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedAxios } from '../../../__mocks__/axios';

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

const renderUI = async () => {
  const result = await UpdateSocialSecurityNumberPage();
  // return render([result, <AppModal key={1} />]);
  return render(
    <>
      <AppModal />
      {result}
    </>,
  );
};
describe('Update SSN', () => {
  it('should render the screens correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        members: [
          {
            birthDate: '06/29/2009',
            memberCk: 91722406,
            firstName: 'CHRISTMAS',
            lastName: 'HALL',
            hasSocial: true,
          },
          {
            birthDate: '06/15/2009',
            memberCk: 91722406,
            firstName: 'KRISSY',
            lastName: 'HALL',
            hasSocial: false,
          },
          {
            birthDate: '10/31/2011',
            memberCk: 91722406,
            firstName: 'CHRISTIAN',
            lastName: 'HALL',
            hasSocial: true,
          },
        ],
      } as ESResponse<MemberList>,
    });
    const component = await renderUI();
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Update Social Security Number',
        }),
      ).toBeVisible();
      expect(screen.getByText('CHRISTMAS HALL')).toBeVisible();
    });

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        message: 'Updated SSN',
      },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        members: [
          {
            birthDate: '06/29/2009',
            memberCk: 91722406,
            firstName: 'CHRISTMAS',
            lastName: 'HALL',
            hasSocial: true,
          },
          {
            birthDate: '06/15/2009',
            memberCk: 91722406,
            firstName: 'KRISSY',
            lastName: 'HALL',
            hasSocial: true,
          },
          {
            birthDate: '10/31/2011',
            memberCk: 91722406,
            firstName: 'CHRISTIAN',
            lastName: 'HALL',
            hasSocial: true,
          },
        ],
      } as ESResponse<MemberList>,
    });

    const button = screen.getAllByAltText(/link/i);
    fireEvent.click(button[0]);
    await waitFor(() => {
      screen.getAllByText('Update or Add a Social Security Number');
      const text = screen.getAllByText(/Social Security Number/i);
      expect(text[0]).toBeInTheDocument();
    });
    expect(screen.queryAllByText('A SSN was found on file.')).toHaveLength(2);
    expect(screen.queryAllByText('No SSN on file.')).toHaveLength(1);
    const ssnEntryInput = screen.getByRole('textbox', {
      name: 'Social Security Number',
    });
    await userEvent.clear(ssnEntryInput);
    await userEvent.type(ssnEntryInput, '111223344');
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/member/v1/members/byMemberCk/123456789/updateSSN',
        {
          ssn: '111223344',
        },
      );
    });
    expect(
      screen.getByText(
        'Your social security number has been successfully updated.',
      ),
    ).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: /Done/i }));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(
        screen.queryAllByText('A SSN was found on file.')[0],
      ).toBeVisible();
      expect(screen.queryAllByText('A SSN was found on file.')).toHaveLength(3);
    });

    expect(component.baseElement).toMatchSnapshot();
  });
});
