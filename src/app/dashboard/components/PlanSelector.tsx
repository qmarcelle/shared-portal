import { PlanSwitcher } from '@/components/composite/PlanSwitcherComponent';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { PlanDetails } from '@/models/plan_details';
import { useEffect } from 'react';
import DashboardLoader from './DashboardLoader';

type PlanSelectorProps = {
  plans: PlanDetails[];
};

export const PlanSelector = ({ plans }: PlanSelectorProps) => {
  const { showAppModal } = useAppModalStore();
  useEffect(() => {
    useAppModalStore.setState({
      isFlexModal: true,
    });
    showAppModal({
      content: (
        <PlanSwitcher
          className="w-[416px]"
          plans={plans}
          selectedPlan={{
            subscriberName: '',
            policies: '',
            planName: '',
            id: '',
            memeCk: '',
            termedPlan: false,
          }}
          onSelectionChange={() => {}}
          isModal={true}
          onSelectItemCallBack={() => {}}
        />
      ),
    });

    return () => {
      useAppModalStore.setState({ isFlexModal: false });
    };
  }, []);
  return <DashboardLoader />;
};
