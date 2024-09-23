import { PlanDetails } from '@/models/plan_details';
import Image from 'next/image';
import { useState } from 'react';
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
}

const PlanDetailTile = ({
  plan,
  isSelected,
}: {
  plan: PlanDetails;
  isSelected: boolean;
}) => {
  return (
    <Card
      type="elevated"
      className={`px-4 pt-4 ${isSelected ? 'selected' : ''} app-base-font-color min-w-[100%]`}
    >
      <Column>
        <Row className="justify-between">
          <TextBox
            className={`font-bold ${!isSelected ? 'primary-color' : ''}`}
            text={plan.planName}
          />
          <Image
            alt="selected"
            className="size-5 m-[2px]"
            src={isSelected ? checkGreenIcon : rightIcon}
          />
        </Row>
        <Column>
          <TextBox text={`Subscriber: ${plan.subscriberName}`} />
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
        alt="switch"
        className="size-5 head-icon m-[4px]"
        src={switchFilterIcon}
      />
    </Row>
  );
};

const PlanDropDownHead = () => {
  return (
    <Row className="px-4 py-2 items-center divider-bottom">
      <Header
        className="grow font-bold app-base-font-color"
        type="title-3"
        text="Select plan view..."
      />
      <Image alt="switch" className="size-5" src={switchFilterIcon} />
    </Row>
  );
};

const PlanDropDownFooter = ({ isCurrentPlan }: { isCurrentPlan: boolean }) => {
  return (
    <Row className="p-4 items-center">
      {isCurrentPlan ? (
        <>
          <Image src={viewMoreIcon} alt="Maximize" />
          <TextBox className="mx-1" text="View Past Plans" />
        </>
      ) : (
        <>
          <Image src={viewLessIcon} alt="Minimize" />
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
}: PlanSwitcherProps) => {
  const [selected, setSelected] = useState(selectedPlan);
  const [plansToShow, setPlanToShow] = useState(
    plans.filter((x) => !x.endedOn),
  );
  const [isCurrentPlan, setIsCurrentPlan] = useState(true);
  const showPastPlans = () => {
    if (isCurrentPlan) {
      setPlanToShow(plans);
      setIsCurrentPlan(false);
    } else {
      setPlanToShow(plans.filter((x) => !x.endedOn));
      setIsCurrentPlan(true);
    }
  };
  return (
    <div className={`${className}`}>
      <RichDropDown<PlanDetails>
        headBuilder={(val) => <SelectedPlan plan={val} />}
        itemData={plansToShow}
        itemsBuilder={(data, index, selected) => (
          <PlanDetailTile plan={data} isSelected={selected.id === data.id} />
        )}
        selected={selected}
        onSelectItem={(val) => setSelected(val)}
        showSelected={false}
        divider={false}
        dropdownHeader={<PlanDropDownHead />}
        dropdownFooter={<PlanDropDownFooter isCurrentPlan={isCurrentPlan} />}
        onClickFooter={() => showPastPlans()}
      />
    </div>
  );
};
