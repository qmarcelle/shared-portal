import { ShopOverCounterItemsCard } from '@/app/pharmacy/components/ShopOverCounterItems';
import { shoppingCreditIcon } from '@/components/foundation/Icons';
import { render, screen } from '@testing-library/react';
process.env.NEXT_PUBLIC_SHOP_OVER_THE_COUNTER = 'https://www.shopbcbstotc.com';
const renderUI = () => {
  return render(
    <ShopOverCounterItemsCard
      icon={shoppingCreditIcon}
      title="Shop Over-the-Counter Items"
      description="You get a quarterly allowance for over-the-counter (OTC) items. You can spend it on things like cold medicine, vitamins and more. And once you set up an account, you can even shop for those items online. Set up or log in to your online account to get OTC items shipped right to your door."
      url={process.env.NEXT_PUBLIC_SHOP_OVER_THE_COUNTER ?? ''}
    />,
  );
};

describe('ShopOverCounterItemsCard', () => {
  it('should render the  Biometric UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Shop Over-the-Counter Items');
    screen.getByText(
      'You get a quarterly allowance for over-the-counter (OTC) items. You can spend it on things like cold medicine, vitamins and more. And once you set up an account, you can even shop for those items online. Set up or log in to your online account to get OTC items shipped right to your door.',
    );
    expect(component).toMatchSnapshot();
  });
});
