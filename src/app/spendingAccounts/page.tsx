import { auth } from '@/auth';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Metadata } from 'next';
import SpendingAccount from '.';
import { invokePhoneNumberAction } from '../profileSettings/actions/profileSettingsAction';
import { mapAccountInfo } from './actions/mapAccountInfo';
import { myHealthCareAccountService } from './actions/myHealthCareAccountService';
import { HealthAccountInfo } from './model/myHealthCareResponseDTO';

export const metadata: Metadata = {
  title: 'Spending Accounts',
};

const SpendingAccountPage = async () => {
  const phoneNumber = await invokePhoneNumberAction();
  try {
    const session = await auth();
    const accountInfo = session?.user.vRules
      ? mapAccountInfo(session.user.vRules)
      : ({} as HealthAccountInfo);
    const spendAccDTO = await myHealthCareAccountService(accountInfo);
    let expensesURL: string = '';
    if (session!.user?.vRules?.healthEquity) {
      expensesURL = 'https://learn.healthequity.com/qme/';
    }
    return (
      spendAccDTO.data && (
        <SpendingAccount
          contact={phoneNumber}
          spendAccDTO={spendAccDTO.data}
          accountInfo={accountInfo}
          isExternalSpendingAccounts={
            session!.user?.vRules?.externalSpendingAcct || false
          }
          expensesURL={expensesURL}
        />
      )
    );
  } catch (err) {
    console.error('Error fetching spending account data:', err);
    return (
      <main className="flex flex-col justify-center items-center page">
        <Column className="app-content app-base-font-color">
          <Header
            text="Spending Accounts"
            className="m-1 mb-0 !font-light !text-[32px]/[40px]"
          />
          <ErrorInfoCard
            className="mt-4"
            errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later."
          />
        </Column>
      </main>
    );
  }
};

export default SpendingAccountPage;
