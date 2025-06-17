'use client';

import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';

import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { downloadIcon, downloadWhiteIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { useState } from 'react';
import { SpendingSummarySectionProps } from './AnnualSpendingSummary';

export const AnnualSpendingCompact = ({
  className,
  title,
  subTitle,
  linkLabel,
}: SpendingSummarySectionProps) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const yearList = [
    { label: currentYear.toString(), value: currentYear.toString() },
    {
      label: (currentYear - 1).toString(),
      value: (currentYear - 1).toString(),
    },
    {
      label: (currentYear - 2).toString(),
      value: (currentYear - 2).toString(),
    },
  ];

  function sendToPHS(): void {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate =
      currentYear === Number(selectedYear)
        ? new Date()
        : new Date(selectedYear, 11, 31);
    const formatDate = (date: Date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    const url = `${process.env.NEXT_PUBLIC_PHSDOCPRES_HOST_URL}?format=pdf&portal=true&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`;
    window.open(url, '_blank');
  }

  const asOfDate = new Date();
  const monthDate = `${asOfDate.toLocaleString('default', { month: 'long' })} ${asOfDate.getDate()}, ${asOfDate.getFullYear()}`;

  return (
    <Card className={className}>
      <div>
        <Header text={title} type="title-2" />
        <Spacer size={18} />
        <TextBox
          text={
            "Your spending summary shows claims we've received and processed."
          }
          className="body-1"
        />
        <Spacer size={18} />
        <Row>
          <TextBox text={'Download Summary For:'} className="body-1" />
          <Spacer size={8} axis="horizontal" />
          <Dropdown
            onSelectCallback={(val: string) => setSelectedYear(Number(val))}
            initialSelectedValue={selectedYear.toString()}
            items={yearList}
          />
        </Row>
        {linkLabel && (
          <Column className="flex flex-row items-center">
            <Spacer size={18} />
            <Button
              type="secondary"
              label={linkLabel}
              className="body-1 relative group"
              callback={sendToPHS}
              icon={
                <>
                  <Image
                    className="group-hover:hidden"
                    alt=""
                    src={downloadIcon}
                  />
                  <Image
                    className="hidden group-hover:block absolute top-2"
                    alt=""
                    src={downloadWhiteIcon}
                  />
                </>
              }
            />
          </Column>
        )}
      </div>
    </Card>
  );
};
