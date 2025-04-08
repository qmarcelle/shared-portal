'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import {
  checkGreenIcon,
  rightIcon,
  switchFilterIcon,
} from '@/components/foundation/Icons';
import { RichDropDown } from '@/components/foundation/RichDropDown';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useChat } from '../../../hooks/useChat';
import { ChatPlan } from '../../../types/types';

interface PlanSwitcherProps {
  onPlanSwitch?: (plan: ChatPlan) => void;
  className?: string;
  isModal?: boolean;
}

const PlanDetailTile = ({
  plan,
  isSelected,
  className = 'px-4 pt-4',
}: {
  plan: ChatPlan;
  isSelected: boolean;
  className?: string;
}) => {
  // Convert SVG components to a format compatible with next/image
  const checkGreenIconSrc = checkGreenIcon as unknown as { src: string };
  const rightIconSrc = rightIcon as unknown as { src: string };

  return (
    <Card
      type="elevated"
      className={`${className} ${isSelected ? 'selected' : ''} app-base-font-color min-w-[100%]`}
    >
      <Column>
        <Row className="justify-between">
          <TextBox
            className={`font-bold ${!isSelected ? 'primary-color' : ''}`}
            text={plan.name}
          />
          <Image
            alt="selected"
            className="size-5 m-[2px]"
            src={isSelected ? checkGreenIconSrc.src : rightIconSrc.src}
          />
        </Row>
        <Column>
          <TextBox
            text={`Subscriber: ${plan.memberFirstname} ${plan.memberLastname}`}
          />
          <TextBox text={`ID: ${plan.memberId}`} />
          <TextBox text={`Type: ${plan.lineOfBusiness}`} />
        </Column>
      </Column>
    </Card>
  );
};

const SelectedPlan = ({ plan }: { plan: ChatPlan }) => {
  // Convert SVG component to a format compatible with next/image
  const switchFilterIconSrc = switchFilterIcon as unknown as { src: string };

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
          text={plan.name}
        />
      </Column>
      <Image
        alt="switch"
        className="size-5 head-icon m-[4px]"
        src={switchFilterIconSrc.src}
      />
    </Row>
  );
};

const PlanDropDownHead = ({
  isModalView,
}: {
  isModalView: boolean | undefined;
}) => {
  // Convert SVG component to a format compatible with next/image
  const switchFilterIconSrc = switchFilterIcon as unknown as { src: string };

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
      <Image alt="switch" className="size-5" src={switchFilterIconSrc.src} />
    </Row>
  );
};

/**
 * PlanSwitcher Component
 * @userStory ID: 31158 - Plan Switcher is Locked when a Chat is Started and Unlocked when the Chat is Closed
 * @userStory ID: 31159 - Hover Message Displayed when the Chat Switcher is Unavailable During a Chat
 */
export const PlanSwitcher: React.FC<PlanSwitcherProps> = ({
  onPlanSwitch,
  className = '',
  isModal,
}) => {
  const { plans, selectedPlan, error, switchPlan, isInChat } = useChat({});

  const handlePlanSelect = useCallback(
    async (plan: ChatPlan) => {
      if (isInChat) {
        return;
      }
      await switchPlan(plan.id);
      onPlanSwitch?.(plan);
    },
    [switchPlan, onPlanSwitch, isInChat],
  );

  if (!plans || plans.length === 0) {
    return <div className="chat-plan-switcher-loading">Loading plans...</div>;
  }

  if (error) {
    return <AlertBar alerts={[error]} />;
  }

  if (plans.length <= 1) {
    return null;
  }

  return (
    <div
      className={`chat-plan-switcher ${className}`}
      data-testid="plan-switcher"
    >
      {isInChat && (
        <div className="plan-switcher-locked-message" role="tooltip">
          End your chat session to switch plan information.
        </div>
      )}
      <div
        className={`plan-switcher-container ${isInChat ? 'disabled' : ''}`}
        aria-disabled={isInChat}
      >
        <div className={isInChat ? 'pointer-events-none opacity-70' : ''}>
          <RichDropDown<ChatPlan>
            headBuilder={
              !isModal ? (val) => <SelectedPlan plan={val} /> : undefined
            }
            itemData={plans}
            itemsBuilder={(data, index, selected) => (
              <PlanDetailTile
                plan={data}
                isSelected={selected.id === data.id}
                className="px-4 pt-4"
              />
            )}
            isMultipleItem={plans.length > 1}
            selected={selectedPlan || plans[0]}
            onSelectItem={handlePlanSelect}
            showSelected={false}
            divider={false}
            dropdownHeader={<PlanDropDownHead isModalView={isModal} />}
          />
        </div>
      </div>
    </div>
  );
};
