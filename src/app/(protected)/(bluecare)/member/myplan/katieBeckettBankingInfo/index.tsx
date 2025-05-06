import { BankFormHelp } from '@/components/composite/BankFormHelp';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { BankDraftForm } from '@/components/BankDraftForm';

const KatieBeckettBankingInfo = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header text="Katie Beckett Banking Info" type="title-1" />
        <TextBox
          className="body-1 m-2 ml-0 mb-0 md:w-2/3"
          text="Below is the authorization for BlueCare Tennessee to accept bank draft payments for health insurance premiums."
        />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <BankDraftForm className="large-section" />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <BankFormHelp />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default KatieBeckettBankingInfo;
