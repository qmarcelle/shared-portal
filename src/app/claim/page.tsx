/**
 * claim
 * Claim
 */
export const metadata = {
  title: 'Claim | Consumer Portal',
  description: 'Claim'
};

'use client';

import { SubmitClaimComponent } from '@/app/claim/components/SubmitClaimComponent';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';

const Claim = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Spacer size={32}></Spacer>
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <SubmitClaimComponent />
        </section>
      </Column>
    </main>
  );
};

export default Claim;
