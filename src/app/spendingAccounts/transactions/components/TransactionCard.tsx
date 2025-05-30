import { IComponent } from '@/components/IComponent';
import { TransactionItem } from '@/components/composite/TransactionItem';
import { Column } from '@/components/foundation/Column';
import { Pagination } from '@/components/foundation/Pagination';
import {
  RichDropDown,
  RichSelectItem,
} from '@/components/foundation/RichDropDown';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TransactionDetails } from '@/models/transaction_details';
import downIcon from '@/public/assets/down.svg';
import Image from 'next/image';
import { useState } from 'react';

interface TransactionCard extends IComponent {
  transactionsInfo: TransactionDetails[];
  sortBy: RichSelectItem[];
  healthCareAccountBalance: number;
}

export const TransactionCard = ({
  transactionsInfo,
  sortBy,
}: TransactionCard) => {
  const [selectedSort, setSelectedSort] = useState(sortBy[0]);

  function sortItems(selectedSort: RichSelectItem) {
    if (selectedSort.sortFn) {
      return [...transactionsInfo].sort(selectedSort.sortFn);
    }
    return transactionsInfo;
  }

  return (
    <Column className="mt-2">
      <div className={'xs:block md:inline-flex max-sm:m-4 md:my-2'}>
        <Row className="body-1 flex-grow align-top mb-0 ">
          Filter Results:{' '}
          <TextBox
            type="body-1"
            className="font-bold ml-2"
            text={`${transactionsInfo.length} Transactions`}
          />
        </Row>

        <Row className="body-1 items-end">
          <span id="sort-label">Sort by:</span>{' '}
          <div>
            <RichDropDown
              minWidth="min-w-[200px]"
              headBuilder={(val) => (
                <a className="link ml-2 flex" aria-labelledby="sort-label">
                  {val.label}{' '}
                  <Image
                    src={downIcon}
                    className="w-[20px] h-[20px] ml-2"
                    alt=""
                    aria-hidden="true"
                  />
                </a>
              )}
              itemData={sortBy}
              itemsBuilder={(data) => (
                <p className="text-nowrap">{data.label}</p>
              )}
              selected={selectedSort}
              onSelectItem={(val) => {
                setSelectedSort(val);
              }}
              aria-label="Sort claims by"
            />
          </div>
        </Row>
        <Spacer axis="horizontal" size={8} />
      </div>

      {/* <Card className="" type="elevated">
        <Row className="p-8 font-bold">
          <TextBox
            className="body-1 flex-grow "
            text="Health Savings Account Balance"
          />
          <TextBox
            className="body-1 flex-end"
            text={formatCurrency(healthCareAccountBalance) ?? ''}
          />
        </Row>
      </Card> */}

      <div className={'flex flex-col max-sm:m-4'}>
        <Spacer size={16} />
        <Pagination<TransactionDetails>
          key={selectedSort.id}
          initialList={sortItems(selectedSort)}
          pageSize={5}
          wrapperBuilder={(items) => <Column>{items}</Column>}
          itemsBuilder={(item, index) => (
            <TransactionItem
              key={`${item.transactionId}-${index}`}
              className="mb-4"
              transactionInfo={item}
            />
          )}
          label="Transactions"
          totalCount={transactionsInfo.length}
        />
        <Spacer size={16} />
      </div>
    </Column>
  );
};
