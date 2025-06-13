import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { getDedAndOOPBalanceForSubscriberAndDep } from '../../balances/actions/getDedAndOOPBalance';
import { BenefitDetailsParams, Details } from '../../details';

const BenefitDetailsPage = async ({
  params,
}: {
  params: Promise<BenefitDetailsParams>;
}) => {
  const spendingAccounts = {
    linkURL: '/member/myplan/spendingaccounts',
    hsaBalance: 1000,
    fsaBalance: 500,
    className: 'large-section',
  };
  const phoneNumber = await invokePhoneNumberAction();
  const balanceData = await getDedAndOOPBalanceForSubscriberAndDep();
  return (
    <Details
      params={await params}
      balanceData={balanceData.data}
      spendingAccountInfo={spendingAccounts}
      contact={phoneNumber}
    />
  );
};

export default BenefitDetailsPage;
