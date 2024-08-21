'use client';

import { RecentClaimSection } from '@/components/composite/RecentClaimSection';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { useRouter } from 'next/navigation';

const Pharmacy = () => {
  const router = useRouter();
  //To Do Remove Below EsLint once integrated with API
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redirectToPharmacyClaims = (claimId: string) => {
    router.push('/pharmacy/pharmacyClaims');
  };
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body"></section>
        <Spacer size={32} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <RecentClaimSection
              className="large-section"
              title="My Recent Pharmacy Claims"
              linkText="View All Pharmacy Claims"
              linkCallBack={() => {
                router.push('/claimSnapshotList');
              }}
              claims={[
                {
                  id: 'Claim01',
                  claimStatus: 'Processed',
                  claimType: 'Pharmacy',
                  claimTotal: '50.00',
                  issuer: '123 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '08/10/2023',
                  claimInfo: {},
                  isMiniCard: true,
                  callBack: (claimId: string) => {
                    redirectToPharmacyClaims(claimId);
                  },
                },
                {
                  id: 'Claim02',
                  claimStatus: 'Denied',
                  claimType: 'Pharmacy',
                  claimTotal: '403.98',
                  issuer: '565 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '07/05/2023',
                  claimInfo: {},
                  isMiniCard: true,
                  callBack: (claimId: string) => {
                    redirectToPharmacyClaims(claimId);
                  },
                },
                {
                  id: 'Claim03',
                  claimStatus: 'Pending',
                  claimType: 'Pharmacy',
                  claimTotal: '33.00',
                  issuer: '890 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '12/22/2022',
                  claimInfo: {},
                  isMiniCard: true,
                  callBack: (claimId: string) => {
                    redirectToPharmacyClaims(claimId);
                  },
                },
              ]}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <></>
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default Pharmacy;
