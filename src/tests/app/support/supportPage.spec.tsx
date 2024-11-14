import SupportPage from '@/app/support/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

global.open = jest.fn();
process.env.NEXT_PUBLIC_PORTAL_QUALTRICS_URL =
  'https://test-bcbst.qualtrics.com/jfe/form';

const setupUI = async () => {
  const result = await SupportPage();
  return render(result);
};

jest.mock('../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            grpId: '100000',
            memCk: '123456789',
          },
        },
      },
    }),
  ),
}));

describe('Support Page', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          hashCode: 'xyz',
        },
      },
    });
  });
  it('should render the page correctly', async () => {
    const component = await setupUI();
    // Contact Us Section should be present
    expect(screen.getByText('Contact Us')).toBeVisible();
    expect(screen.getAllByText('Call')[0]).toBeVisible();
    expect(screen.getByText('Chat')).toBeVisible();
    expect(screen.getByText('Email')).toBeVisible();

    // Resources Section should be present
    expect(screen.getByText('Resources')).toBeVisible();
    expect(screen.getByText('Frequently Asked Questions')).toBeVisible();
    expect(screen.getByText('Health Insurance Glossary')).toBeVisible();
    expect(screen.getByText('Find a Form')).toBeVisible();

    expect(component).toMatchSnapshot();
  });

  it('should open the Qualtrics survey link on feedback button click', async () => {
    await setupUI();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/memberDetails/hashKey?memberKey=123456789&groupId=100000',
    );
    fireEvent.click(screen.getByLabelText('Share Your Feedback'));
    expect(global.open).toHaveBeenCalledWith(
      'https://test-bcbst.qualtrics.com/jfe/form/SV_6rHlwsGRs79CO33?Q_CHL=si&grpnbr=100000&qs_digid=xyz',
      '_blank',
      'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=500,width=400,height=400',
    );
  });
});
