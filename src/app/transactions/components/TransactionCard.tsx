import { Card } from '@/components/foundation/Card';
import { TransactionDetails } from '@/models/transaction_details';
import Image from 'next/image';
import downIcon from '../../../../public/assets/down.svg';
import { IComponent } from '../../../components/IComponent';
import { TransactionItem } from '../../../components/composite/TransactionItem';
import { Column } from '../../../components/foundation/Column';
import { SelectItem } from '../../../components/foundation/Dropdown';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';

interface TransactionCard extends IComponent {
  transactionsInfo: TransactionDetails[];
  sortBy: SelectItem[];
  selectedDate: string;
  onSelectedDateChange: () => void;
}

export const TransactionCard = ({ transactionsInfo }: TransactionCard) => {
  return (
    <Column className="mt-2">
      <div className={'xs:block md:inline-flex max-sm:m-4 md:my-2'}>
        <Row className="body-1 flex-grow align-top mb-0 ">
          Filter Results:{' '}
          <TextBox
            type="body-1"
            className="font-bold ml-2"
            text="5 Prior Authorizations"
          />
        </Row>

        <Row className="body-1 items-end">
          Sort by:{' '}
          <a className="link ml-2 flex">
            Date (Most Recent)
            <Image src={downIcon} className="w-[20px] h-[20px] ml-2" alt="" />
          </a>
        </Row>
        <Spacer axis="horizontal" size={8} />
      </div>

      <Card className="" type="elevated">
        <Row className="p-8 font-bold">
          <TextBox
            className="body-1 flex-grow "
            text="Health Savings Account Balance"
          />
          <TextBox className="body-1 flex-end" text="$3,850.10" />
        </Row>
      </Card>

      <div className={'flex flex-col max-sm:m-4'}>
        <Spacer size={16} />
        {transactionsInfo.slice(0, 5).map((item) => (
          <TransactionItem
            key={item.id}
            className="mb-4"
            transactionInfo={item}
          />
        ))}
        <Spacer size={16} />
      </div>
    </Column>
  );
};
