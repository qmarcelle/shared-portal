'use client';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import {
  dentalIcon,
  downloadIcon,
  medicalIcon,
  pharmacyIcon,
  visionIcon,
} from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { FilterItem } from '@/models/filter_dropdown_details';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useAppModalStore } from '../../components/foundation/AppModal';
import { SpendingAccountSummary } from '../dashboard/components/SpendingAccountSummary';
import { DownloadPdf } from '../spendingSummary/journeys/DownloadPdf';

/* eslint-disable */
type SpendingSummaryPageProps = {
  filters: FilterItem[];
};

const SpendingSummary = ({ filters }: SpendingSummaryPageProps) => {
  const initialFilter = useMemo(() => {
    return filters;
  }, []);
  const [filter, setFilter] = useState(filters);

  function onFilterSelect(index: number, filter: FilterItem[]) {
    setFilter(filter);
  }

  function resetFilter() {
    setFilter(initialFilter);
  }

  const { showAppModal } = useAppModalStore();

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color mt-20">
        <Header
          text="Spending Summary"
          className="mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row className="mb-0" key={0}>
                Your annual statement shows claims we&apos;ve received and
                processed.
              </Row>,
              <Row className="body-1 flex-grow align-top mt-4 ml-4" key={1}>
                <AppLink
                  className="!flex pl-0 manage-underline"
                  label="Download a PDF Statement"
                  icon={<Image src={downloadIcon} alt="external" />}
                  callback={() =>
                    showAppModal({
                      content: <DownloadPdf />,
                    })
                  }
                />
              </Row>,
            ]}
          />
        </section>

        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="large-section px-0 m-0 w-11/12"
              filterHeading="Filter Summary"
              onSelectCallback={(index, data) => onFilterSelect(index, data)}
              filterItems={filter}
              onReset={resetFilter}
              showReset={filter != initialFilter}
            />
          </Column>

          <Column className="flex-grow page-section-63_33 items-stretch">
            <SpendingAccountSummary
              className="large-section statementSummary"
              title="Statement Summary up to November 8, 2023"
              subTitle="View Medical, Pharmacy, Dental and Vision for All Members"
              amountPaid={1199.19}
              totalBilledAmount={9804.31}
              amountSaved={8605.12}
              amountSavedPercentage={89}
              color1={'#005EB9'}
              color2={'#5DC1FD'}
              service={[
                {
                  serviceIcon: (
                    <Image
                      className="w-6"
                      src={medicalIcon}
                      alt="Medical Icon"
                    />
                  ),
                  serviceLabel: 'Medical',
                  serviceSubLabel: 'Your share',
                  serviceSubLabelValue: 30.24,
                  labelText1: 'Amount Billed',
                  labelValue1: 145.0,
                  labelText2: 'Plan Discount',
                  labelValue2: 114.76,
                  labelText3: 'Plan Paid',
                  labelValue3: 0.0,
                },
                {
                  serviceIcon: (
                    <Image
                      className="w-6"
                      src={pharmacyIcon}
                      alt="Pharmacy Icon"
                    />
                  ),
                  serviceLabel: 'Pharmacy',
                  serviceSubLabel: 'Your share',
                  serviceSubLabelValue: 30.24,
                  labelText1: 'Amount Billed',
                  labelValue1: 145.0,
                  labelText2: 'Plan Discount',
                  labelValue2: 114.76,
                  labelText3: 'Plan Paid',
                  labelValue3: 0.0,
                },
                {
                  serviceIcon: (
                    <Image className="w-6" src={dentalIcon} alt="Dental Icon" />
                  ),
                  serviceLabel: 'Dental',
                  serviceSubLabel: 'Your share',
                  serviceSubLabelValue: 30.24,
                  labelText1: 'Amount Billed',
                  labelValue1: 145.0,
                  labelText2: 'Plan Discount',
                  labelValue2: 114.76,
                  labelText3: 'Plan Paid',
                  labelValue3: 0.0,
                },
                {
                  serviceIcon: (
                    <Image className="w-6" src={visionIcon} alt="Vision Icon" />
                  ),
                  serviceLabel: 'Vision',
                  serviceSubLabel: 'Your share',
                  serviceSubLabelValue: 30.24,
                  labelText1: 'Amount Billed',
                  labelValue1: 145.0,
                  labelText2: 'Plan Discount',
                  labelValue2: 114.76,
                  labelText3: 'Plan Paid',
                  labelValue3: 0.0,
                },
              ]}
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default SpendingSummary;
