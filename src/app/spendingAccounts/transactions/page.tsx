'use server';

import { ChatTrigger } from '@/app/clicktochat/components/ChatTrigger';
import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { auth } from '@/auth';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import Transactions from '.';
import { mapAccountInfo } from '../actions/mapAccountInfo';
import ExternalSpendingAccountSSOLink from '../components/ExternalSpendingAccountSSOLink';
import { HealthAccountInfo } from '../model/myHealthCareResponseDTO';

const TransactionsPage = async () => {
  const phoneNumber = await invokePhoneNumberAction();
  try {
    const session = await auth();
    const accountInfo = session?.user.vRules
      ? mapAccountInfo(session.user.vRules)
      : ({} as HealthAccountInfo);

    // No HRA Transaction service as of today 06/2025
    if (accountInfo.accountTypes) {
      accountInfo.accountTypes = accountInfo.accountTypes.filter(
        (type) => type !== 'HRA',
      );
    }
    return (
      <main className="flex flex-col justify-center items-center page">
        <Column className="app-content app-base-font-color">
          <Header
            text="Transactions"
            className="m-4 mb-0 !font-light !text-[32px]/[40px]"
          />
          {session?.user?.vRules?.externalSpendingAccounts && (
            <ExternalSpendingAccountSSOLink accountInfo={accountInfo} />
          )}
          <section className="ml-4">
            <RichText
              spans={[
                <span key={1}>If you need help, </span>,
                <span className="link" key={2}>
                  <ChatTrigger>start a chat</ChatTrigger>
                </span>,
                <span key={3}>or</span>,
                <span key={4}> call us at {phoneNumber}.</span>,
              ]}
            />
          </section>
          <Transactions accountInfo={accountInfo} />
        </Column>
      </main>
    );
  } catch (err) {
    console.error('Error fetching transaction data:', err);
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

export default TransactionsPage;
