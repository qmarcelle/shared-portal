import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Metadata } from 'next';
import SpendingAccount from '.';
import { invokePhoneNumberAction } from '../profileSettings/actions/profileSettingsAction';
import { myHealthCareAccountService } from './actions/myHealthCareAccountService';

export const metadata: Metadata = {
  title: 'Spending Accounts',
};

const SpendingAccountPage = async () => {
  const phoneNumber = await invokePhoneNumberAction();
  try {
    const spendAccDTO = await myHealthCareAccountService();
    return (
      spendAccDTO.data && (
        <SpendingAccount contact={phoneNumber} spendAccDTO={spendAccDTO.data} />
      )
    );
  } catch (err) {
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
