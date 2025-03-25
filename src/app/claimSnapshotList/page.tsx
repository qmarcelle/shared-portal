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
          className="mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <div className="mb-0">
                If you need more than two years of claims, call [1-800-000-000].
                Need to submit a claim?
              </div>,
              <div className="link">
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
              dropDown={[
                {
                  dropNownName: 'Connected Plans',
                  dropDownval: [
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
                  totalBilled: '535.00',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim2',
                  claimStatus: 'empty',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'Thomas H. Smith',
                  memberName: 'Chris Hall',
                  serviceDate: '08/22/23',
                  totalBilled: '145.00',
                  planPaid: '114.76',
                  myShare: '30.24',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim3',
                  claimStatus: 'empty',
                  claimType: 'Pharmacy',
                  claimTotal: null,
                  issuer: '123 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '08/10/23',
                  totalBilled: '403.98',
                  planPaid: '338.37',
                  myShare: '65.61',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim4',
                  claimStatus: 'Denied',
                  claimType: 'Pharmacy',
                  claimTotal: null,
                  issuer: '123 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '07/05/23',
                  totalBilled: '403.98',
                  planPaid: '0.00',
                  myShare: '403.98',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim5',
                  claimStatus: 'empty',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'Brittant Johnson',
                  memberName: 'Chris Hall',
                  serviceDate: '07/04/23',
                  totalBilled: '183.00',
                  planPaid: '150.85',
                  myShare: '32.15',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim6',
                  claimStatus: 'empty',
                  claimType: 'Vision',
                  claimTotal: null,
                  issuer: 'Trisha Anjani',
                  memberName: 'Telly Hall',
                  serviceDate: '07/01/23',
                  totalBilled: '280.00',
                  planPaid: '190.85',
                  myShare: '90.00',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim7',
                  claimStatus: 'empty',
                  claimType: 'Dental',
                  claimTotal: null,
                  issuer: 'Marcus Howard',
                  memberName: 'Chris Hall',
                  serviceDate: '06/12/23',
                  totalBilled: '128.00',
                  planPaid: '95.85',
                  myShare: '33.00',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim8',
                  claimStatus: 'empty',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'Tonya P. Clark',
                  memberName: 'Maddison Hall',
                  serviceDate: '05/17/23',
                  totalBilled: '263.00',
                  planPaid: '263.00',
                  myShare: '0.00',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim9',
                  claimStatus: 'empty',
                  claimType: 'Medical',
                  claimTotal: null,
                  issuer: 'Local Care Hospital',
                  memberName: 'Maddison Hall',
                  serviceDate: '05/17/23',
                  totalBilled: '32.00',
                  planPaid: '23.42',
                  myShare: '8.59',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
                },
                {
                  id: 'Claim10',
                  claimStatus: 'empty',
                  claimType: 'Pharmacy',
                  claimTotal: null,
                  issuer: 'Trisha Anjani',
                  memberName: 'Chris Hall',
                  serviceDate: '01/20/23',
                  totalBilled: '280.00',
                  planPaid: '190.85',
                  myShare: '90.00',
                  claimsFlag: true,
                  claimInfo: {},
                  priorAuthFlag: false,
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
