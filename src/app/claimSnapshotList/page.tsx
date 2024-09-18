'use client';

import { ClaimsSnapshotCardSection } from '@/app/claimSnapshotList/components/ClaimsSnapshotCardSection';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';

/* eslint-disable */

const ClaimsSnapshot = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Claims"
          type="title-2"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <div className="m-4 mb-0">
                If you need more than two years of claims, call [1-800-000-000].
                Need to submit a claim?
              </div>,
              <div className="link ml-4">
                <a>Get the form you need here.</a>
              </div>,
            ]}
          />
        </section>

        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="large-section px-0 m-0"
              filterHeading="Filter Claims"
              filterItems={[
                {
                  type: 'dropdown',
                  label: 'Connected Plans',
                  value: [
                    {
                      label: 'All Plans',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Plans',
                      value: '2',
                      id: '2',
                    },
                  ],
                  selectedValue: { label: 'All Plans', value: '1', id: '1' },
                },
                {
                  type: 'dropdown',
                  label: 'Member',
                  value: [
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
                  type: 'dropdown',
                  label: 'Date Range',
                  value: [
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
                  type: 'dropdown',
                  label: 'Claim Type',
                  value: [
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
            <ClaimsSnapshotCardSection
              sortby={[
                {
                  label: 'MyShare (Low to High)',
                  value: '0',
                },
                {
                  label: 'Date (Most Recent)',
                  value: '43',
                },
                {
                  label: 'Status (Denied First)',
                  value: '2',
                },
                {
                  label: 'MyShare (High to Low)',
                  value: '4',
                },
              ]}
              onSelectedDateChange={() => {}}
              selectedDate="43"
              claims={[
                {
                  id: 'Claim1',
                  claimStatus: 'Pending',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'John Hopkins',
                  memberName: 'Chris Hall',
                  serviceDate: '08/23/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$535.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: null,
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: null,
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim2',
                  claimStatus: 'empty',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'Thomas H. Smith',
                  memberName: 'Chris Hall',
                  serviceDate: '08/22/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$145.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$114.76',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$30.24',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim3',
                  claimStatus: 'empty',
                  claimType: 'Pharmacy',
                  claimTotal: null,
                  issuer: '123 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '08/10/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$403.98',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$338.37',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$65.61',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim4',
                  claimStatus: 'Denied',
                  claimType: 'Pharmacy',
                  claimTotal: null,
                  issuer: '123 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '07/05/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$403.98',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$0.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$403.98',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim5',
                  claimStatus: 'empty',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'Brittant Johnson',
                  memberName: 'Chris Hall',
                  serviceDate: '07/04/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$183.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$150.85',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$32.15',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim6',
                  claimStatus: 'empty',
                  claimType: 'Vision',
                  claimTotal: null,
                  issuer: 'Trisha Anjani',
                  memberName: 'Telly Hall',
                  serviceDate: '07/01/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$280.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$190.85',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$90.00',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim7',
                  claimStatus: 'empty',
                  claimType: 'Dental',
                  claimTotal: null,
                  issuer: 'Marcus Howard',
                  memberName: 'Chris Hall',
                  serviceDate: '06/12/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$128.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$95.85',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$33.00',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim8',
                  claimStatus: 'empty',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'Tonya P. Clark',
                  memberName: 'Maddison Hall',
                  serviceDate: '05/17/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$263.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$263.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$0.00',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim9',
                  claimStatus: 'empty',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'Local Care Hospital',
                  memberName: 'Maddison Hall',
                  serviceDate: '05/17/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$32.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$23.42',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$8.59',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
                {
                  id: 'Claim10',
                  claimStatus: 'empty',
                  claimType: 'Pharmacy',
                  claimTotal: null,
                  issuer: 'Trisha Anjani',
                  memberName: 'Chris Hall',
                  serviceDate: '01/20/23',
                  claimInfo: {},
                  columns: [
                    {
                      label: 'Total Billed',
                      value: '$280.00',
                      defaultValue: '--',
                    },
                    {
                      label: 'Plan Paid',
                      value: '$190.85',
                      defaultValue: '--',
                    },
                    {
                      label: 'My Share',
                      value: '$90.00',
                      defaultValue: '--',
                      isValueBold: true,
                      isVisibleInMobile: true,
                    },
                  ],
                },
              ]}
            />
            <section className="flex justify-center self-center">
              <div className="m-2 mt-0">Viewing 10 of 20 Claims</div>
            </section>
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default ClaimsSnapshot;
