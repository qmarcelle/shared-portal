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
  // TODO: Find the correct model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactionInfo: any;
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

  function getSuccessStatus() {
    switch (transactionInfo.transactionStatus) {
      case 'Processed':
        return 'success';
      case 'Denied':
        return 'error';
      case 'Pending':
        return 'neutral';
      case 'Partial Approval':
        return 'partialapproval';
      case 'Approved':
        return 'success';
      default:
        return 'empty';
    }
  }

  function getDesktopView() {
    return (
      <Column>
        <TransactionListCard
          information={[
            {
              title: transactionInfo.memberName,
              body: (
                <section>
                  <Row className=" py-2 m-2">
                    <Column className="flex-grow">
                      <span className="body-1">
                        Date Recieved:{transactionInfo.serviceDate}
                      </span>
                    </Column>
                    <Column className="flex-end">
                      <span className="body-1 text-rose-700">
                        {transactionInfo.transactionTotal}
                      </span>
                    </Column>
                  </Row>
                  <Spacer axis="horizontal" size={32} />
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
                        label={transactionInfo.transactionStatus}
                        status={getSuccessStatus()}
                      />
                    </Column>
                  </Row>
                  <Spacer axis="horizontal" size={32} />
                  <Divider></Divider>
                  <Spacer axis="horizontal" size={32} />
                  {transactionInfo.disallowedFlag && (
                    <Row className="px-3 py-2 m-2">
                      <Column>
                        <span className="opacity-70">Disallowed Amount</span>
                        <Spacer axis="horizontal" size={32} />
                        <span>{transactionInfo.disallowedAmount}</span>
                      </Column>
                      <Spacer axis="horizontal" size={100} />
                      <Column>
                        <span className="opacity-70">Disallowed Reason</span>
                        <Spacer axis="horizontal" size={32} />
                        <span>{transactionInfo.disallowedReason}</span>
                      </Column>
                    </Row>
                  )}
                  <span className="body-1"></span>
                </section>
              ),
            },
          ]}
          successStatus={
            <Row className="px-3 py-2">
              <Column className="flex-grow">
                <span className="body-1">
                  Date Recieved:{transactionInfo.serviceDate}
                </span>
              </Column>
              <Column className="flex-end">
                <span className="body-1 text-rose-700">
                  {transactionInfo.transactionTotal}
                </span>
              </Column>
            </Row>
          }
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
