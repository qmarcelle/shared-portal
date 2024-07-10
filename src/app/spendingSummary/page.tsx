'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';
import DownloadIcon from '../../../public/assets/Document-File.svg';
import { Filter } from '../../components/foundation/Filter';

const SpendingSummary = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Spending Summary"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row className="m-4 mb-0" key={0}>
                Your annual statement shows claims we&apos;ve received and
                processed.
              </Row>,
              <Row className="body-1 flex-grow align-top mt-4 ml-4" key={1}>
                <Column className="link ml-4 !no-underline">
                  <a className="inline-flex">
                    Download a PDF Statement
                    <span>
                      <Image src={DownloadIcon} alt="external" />
                    </span>
                  </a>
                </Column>
              </Row>,
            ]}
          />
        </section>

        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="large-section px-0 m-0"
              filterHeading="Filter Summary"
              dropDown={[
                {
                  dropNownName: 'Member',
                  dropDownval: [
                    {
                      label: 'All Members',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Chris Hall',
                      value: '2',
                      id: '2',
                    },
                    {
                      label: 'Madission Hall',
                      value: '3',
                      id: '3',
                    },
                    {
                      label: 'Forest Hall',
                      value: '4',
                      id: '4',
                    },
                    {
                      label: 'Telly Hall',
                      value: '5',
                      id: '5',
                    },
                    {
                      label: 'Janie Hall',
                      value: '6',
                      id: '6',
                    },
                  ],
                  selectedValue: { label: 'All Members', value: '1', id: '1' },
                },
                {
                  dropNownName: 'Date Range',
                  dropDownval: [
                    {
                      label: '2023',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: '2022',
                      value: '2',
                      id: '2',
                    },
                    {
                      label: '2021',
                      value: '3',
                      id: '3',
                    },
                  ],
                  selectedValue: { label: '2023', value: '1', id: '1' },
                },
                {
                  dropNownName: 'Claim Type',
                  dropDownval: [
                    {
                      label: 'All Types',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Medical',
                      value: '2',
                      id: '2',
                    },
                    {
                      label: 'Pharmacy',
                      value: '3',
                      id: '3',
                    },
                    {
                      label: 'Dental',
                      value: '4',
                      id: '4',
                    },
                    {
                      label: 'Vision',
                      value: '5',
                      id: '5',
                    },
                  ],
                  selectedValue: { label: 'All Types', value: '1', id: '1' },
                },
              ]}
            />
          </Column>

          <Column className="flex-grow page-section-63_33 items-stretch">
            <div></div>
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default SpendingSummary;
