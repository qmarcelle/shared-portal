'use client';

import { PlanSwitcher } from '@/components/composite/PlanSwitcherComponent';
import { Spacer } from '@/components/foundation/Spacer';
import { useRouter } from 'next/navigation';

const PlanSelector = () => {
  const router = useRouter();
  const selectItem = () => {
    router.replace('/dashboard');
  };
  return (
    <div className="flex flex-col justify-center items-center ">
      <Spacer size={105} />
      <div className="modal-overlay plan-selector-modal">
        <div className="modal-content w-[416px] rounded-lg">
          <PlanSwitcher
            className="mx-4 w-[416px]"
            plans={[
              {
                subscriberName: 'Chris Hall',
                policies: 'Medical, Vision, Dental',
                planName: 'BlueCross BlueShield of Tennessee',
                id: 'ABC1234567890',
              },
              {
                subscriberName: 'Maddison Hall',
                policies: 'Dental',
                planName: 'Tennessee Valley Authority',
                id: 'ABC000000000',
              },
              {
                subscriberName: 'Chris Hall',
                policies: 'Medical, Vision, Dental',
                planName: 'Dollar General',
                id: 'ABC1234567891',
                endedOn: '2023',
              },
            ]}
            selectedPlan={{
              subscriberName: '',
              policies: '',
              planName: '',
              id: '',
            }}
            onSelectionChange={() => {}}
            isModal={true}
            onSelectItemCallBack={selectItem}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanSelector;
