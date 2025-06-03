import { AnalyticsData } from '@/models/app/analyticsData';
import { PlanDetails } from '@/models/plan_details';
import { switchUser } from '@/userManagement/actions/switchUser';
import { googleAnalytics } from '@/utils/analytics';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppModalStore } from '../foundation/AppModal';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import {
  checkGreenIcon,
  rightIcon,
  switchFilterIcon,
  viewLessIcon,
  viewMoreIcon,
} from '../foundation/Icons';
import { RichDropDown } from '../foundation/RichDropDown';
import { Row } from '../foundation/Row';
import { TextBox } from '../foundation/TextBox';
import { IComponent } from '../IComponent';

export interface PlanSwitcherProps extends IComponent {
  plans: PlanDetails[];
  selectedPlan: PlanDetails;
  onSelectionChange: (val: PlanDetails) => void;
  isModal?: boolean;
  onSelectItemCallBack?: () => void | Promise<void> | null;
}

const PlanDetailTile = ({
  plan,
  isSelected,
  className = 'px-4 pt-4',
}: {
  plan: PlanDetails;
  isSelected: boolean;
  isModalView: boolean | undefined;
  className?: string;
}) => {
  return (
    <Card
      type="elevated"
      className={`${className}  ${isSelected ? 'selected' : ''} app-base-font-color min-w-[100%]`}
    >
      <Column>
        <Row className="justify-between">
          <TextBox
            className={`font-bold ${!isSelected ? 'primary-color' : ''}`}
            text={plan.planName}
          />
          <Image
            alt=""
            className="size-5 m-[2px]"
            src={isSelected ? checkGreenIcon : rightIcon}
          />
        </Row>
        <Column>
          <TextBox text={`Subscriber: ${toPascalCase(plan.subscriberName)}`} />
          <TextBox text={`ID: ${plan.id}`} />
          <TextBox text={`Policies: ${plan.policies}`} />
        </Column>
        {plan.endedOn && (
          <Column>
            <TextBox type="body-2" text={`Ended ${plan.endedOn}`} />
          </Column>
        )}
      </Column>
    </Card>
  );
};

const SelectedPlan = ({ plan }: { plan: PlanDetails }) => {
  return (
    <Row className="px-4 py-2 items-center justify-between">
      <Column className="max-w-[90%]">
        <TextBox
          type="body-2"
          className="app-base-font-color"
          text="View Plan:"
        />
        <TextBox
          className="font-bold text-ellipsis overflow-hidden whitespace-nowrap"
          text={plan.planName}
        />
      </Column>
      <Image
        alt=""
        className="size-5 head-icon m-[4px]"
        src={switchFilterIcon}
      />
    </Row>
  );
};

const PlanDropDownHead = ({
  isModalView,
}: {
  isModalView: boolean | undefined;
}) => {
  return isModalView ? (
    <Row className="items-center">
      <Header type="title-2" text="Which Plan do you want to view today?" />
    </Row>
  ) : (
    <Row className="px-4 py-2 items-center divider-bottom">
      <Header
        className="grow font-bold app-base-font-color"
        type="title-3"
        text="Select plan view..."
      />
      <Image alt="" className="size-5" src={switchFilterIcon} />
    </Row>
  );
};

const PlanDropDownFooter = ({
  isCurrentPlan,
  isModalView,
}: {
  isCurrentPlan: boolean;
  isModalView: boolean | undefined;
}) => {
  return (
    <Row className={`items-center ${isModalView ? 'py-4' : 'p-4'}`}>
      {isCurrentPlan ? (
        <>
          <Image src={viewMoreIcon} alt="" />
          <TextBox className="mx-1" text="View Past Plans" />
        </>
      ) : (
        <>
          <Image src={viewLessIcon} alt="" />
          <TextBox className="mx-1" text="Hide Past Plans" />
        </>
      )}
    </Row>
  );
};
export const PlanSwitcher = ({
  plans,
  selectedPlan,
  className,
  isModal,
}: PlanSwitcherProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState(selectedPlan);
  const isMultiplePlan = plans.length > 1;
  const isTermedPlanExist = plans.some((item) => item.termedPlan);
  const [plansToShow, setPlanToShow] = useState(
    plans.filter((x) => !x.termedPlan),
  );
  const [isCurrentPlan, setIsCurrentPlan] = useState(true);
  const { dismissModal } = useAppModalStore();
  const showPastPlans = () => {
    if (isCurrentPlan) {
      setPlanToShow(plans);
      setIsCurrentPlan(false);
    } else {
      setPlanToShow(plans.filter((x) => !x.termedPlan));
      setIsCurrentPlan(true);
    }
  };
  function trackPlanSwitcherAnalytics() {
    const analytics: AnalyticsData = {
      event: 'select_content',
      click_text: 'View Plan',
      click_url: undefined,
      page_section: undefined,
      selection_type: 'dropdown',
      element_category: 'Account Switching',
      action: 'click',
    };
    googleAnalytics(analytics);
  }

  return (
    <div className={`${className}`}>
      <RichDropDown<PlanDetails>
        headBuilder={
          !isModal ? (val) => <SelectedPlan plan={val} /> : undefined
        }
        itemData={plansToShow}
        itemsBuilder={(data, index, selected) => (
          <PlanDetailTile
            plan={data}
            isSelected={selected.id === data.id}
            isModalView={isModal}
          />
        )}
        isMultipleItem={isMultiplePlan}
        selected={selected}
        onSelectItem={(val) => {
          trackPlanSwitcherAnalytics();
          setSelected(val);
          switchUser(undefined, val.memeCk);
          if (isModal) {
            dismissModal();
          }
          router.refresh();
        }}
        showSelected={false}
        divider={false}
        dropdownHeader={<PlanDropDownHead isModalView={isModal} />}
        dropdownFooter={
          isTermedPlanExist ? (
            <PlanDropDownFooter
              isCurrentPlan={isCurrentPlan}
              isModalView={isModal}
            />
          ) : undefined
        }
        onClickFooter={() => showPastPlans()}
      />
    </div>
  );
};
