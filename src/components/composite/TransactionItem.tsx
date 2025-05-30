import { TransactionDetails } from '@/models/transaction_details';
import { useEffect, useState } from 'react';
import { IComponent } from '../IComponent';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { StatusLabel } from '../foundation/StatusLabel';
import { TransactionListCard } from './TransactionListCard';

interface TransactionItemProps extends IComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactionInfo: TransactionDetails;
}

export const TransactionItem = ({
  transactionInfo,
  onClick,
  className,
}: TransactionItemProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getDesktopView() {
    return (
      <Column>
        <TransactionListCard
          baseCard={DateReceivedComponent(transactionInfo)}
          information={[
            {
              title: transactionInfo.providerName,
              body: (
                <>
                  {DateReceivedComponent(transactionInfo)}
                  <Divider></Divider>
                  <Spacer axis="horizontal" size={32} />
                  <Row className="py-2 m-2">
                    <Column className="flex-grow">
                      <span className="body-1">
                        Transaction ID: {transactionInfo.transactionId}
                      </span>
                    </Column>
                    <Column className="flex-end">
                      <StatusLabel
                        label={transactionInfo.transactionStatusDescription}
                        status={transactionInfo.transactionStatus}
                      />
                    </Column>
                  </Row>
                  <Spacer axis="horizontal" size={32} />
                  <span className="body-1"></span>
                  <Divider></Divider>
                  <section>
                    <Spacer axis="horizontal" size={32} />
                    {transactionInfo.disallowedFlag && (
                      <Row className="px-3 py-2 m-2">
                        <Column>
                          <span className="opacity-70">Disallowed Amount</span>
                          <Spacer axis="horizontal" size={32} />
                          <span>
                            {transactionInfo.formattedDisallowedAmount}
                          </span>
                        </Column>
                        <Spacer axis="horizontal" size={100} />
                        <Column>
                          <span className="opacity-70">Disallowed Reason</span>
                          <Spacer axis="horizontal" size={32} />
                          <span>{transactionInfo.disallowedReason}</span>
                        </Column>
                      </Row>
                    )}
                  </section>
                </>
              ),
            },
          ]}
        ></TransactionListCard>
      </Column>
    );
  }

  return isClient ? (
    <Card
      className={`cursor-pointer ${className}`}
      type="elevated"
      onClick={onClick}
    >
      {getDesktopView()}
    </Card>
  ) : null;
};

const DateReceivedComponent = (transactionDetails: TransactionDetails) => {
  const textColor = transactionDetails.isWithdrawal ? 'text-rose-700' : ''; // Ensure 'withdrawal' exists in TransactionDetails or handle it safely
  return (
    <section>
      <Row className=" py-2 m-2">
        <Column className="flex-grow">
          <span className="body-1">
            Date Received:{transactionDetails.serviceDate}
          </span>
        </Column>
        <Column className="flex-end">
          <span className={`body-1 ${textColor}`}>
            {transactionDetails.formattedTransactionTotal}
          </span>
        </Column>
      </Row>
      <Spacer axis="horizontal" size={32} />
    </section>
  );
};
