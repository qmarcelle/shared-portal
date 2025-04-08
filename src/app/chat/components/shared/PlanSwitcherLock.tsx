import { ToolTip } from '@/components/foundation/Tooltip';
import Image from 'next/image';
import lockIcon from '../../../../../public/assets/lock.svg';
import { useChatStore } from '../../stores/chatStore';

export const PlanSwitcherLock = () => {
  const isPlanSwitcherLocked = useChatStore(
    (state) => state.isPlanSwitcherLocked,
  );

  return (
    <ToolTip
      showTooltip={isPlanSwitcherLocked}
      className="flex flex-row justify-center items-center tooltip"
      label="Plan switching is disabled during an active chat session."
    >
      <Image src={lockIcon} alt="Lock" className="icon" />
    </ToolTip>
  );
};
