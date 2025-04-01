import PharmacyPage from '@/app/pharmacy/page';
import { render, screen } from '@testing-library/react';
import { mockedAxios } from '../_mocks_/axios';
process.env.NEXT_PUBLIC_SHOP_OVER_THE_COUNTER = 'https://www.shopbcbstotc.com';
const renderUI = async () => {
  const page = await PharmacyPage();
  return render(page);
};

const vRules = {
  user: {
    vRules: {
      active: true,
      otcEnable: true,
      showPharmacyTab: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('ShopOverCounterItemsCard', () => {
  it('should render the  ShopOverCounterItemsCard correctly- for OTC elegible Members', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();

    expect(screen.getByText('Shop Over-the-Counter Items'));
    expect(
      screen.getByText(
        'You get a quarterly allowance for over-the-counter (OTC) items. You can spend it on things like cold medicine, vitamins and more. And once you set up an account, you can even shop for those items online. Set up or log in to your online account to get OTC items shipped right to your door.',
      ),
    );
    expect(component).toMatchSnapshot();
  });

  it('should NOT render the  ShopOverCounterItemsCard - for Non OTC elegible Members', async () => {
    vRules.user.vRules.otcEnable = false;
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();

    expect(screen.queryByText('Shop Over-the-Counter Items')).not
      .toBeInTheDocument;
    expect(
      screen.queryByText(
        'You get a quarterly allowance for over-the-counter (OTC) items. You can spend it on things like cold medicine, vitamins and more. And once you set up an account, you can even shop for those items online. Set up or log in to your online account to get OTC items shipped right to your door.',
      ),
    ).not.toBeInTheDocument;
    expect(component).toMatchSnapshot();
  });
});
