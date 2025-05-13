import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ThirdPartySharingInputslide } from '../ThirdPartySharingInputslide';

interface ThirdPartySharingJourneyProps {
  appName: string;
  disableSubmit?: boolean;
}

export const ThirdPartySharingJourney = ({
  changePage,
  pageIndex,
  appName,
  disableSubmit = false,
}: ModalChildProps & ThirdPartySharingJourneyProps) => {
  const { dismissModal } = useAppModalStore();
  const confirmStopSharing = async () => {
    if (disableSubmit) return;
    changePage?.(1, true);
  };

  const pages = [
    <ThirdPartySharingInputslide
      key={0}
      label="Stop Sharing"
      subLabel="We'll stop sharing your health plan information with:"
      actionArea={
        <Column className="items-center">
          <TextBox className="font-bold" text={appName} />
          <Spacer size={32} />
          <TextBox
            className="text-center"
            text="This will mean this app or website can't see your health information. Any information you already shared may still be available to them."
          />
          <Spacer size={32} />
        </Column>
      }
      nextCallback={() => confirmStopSharing()}
      cancelCallback={() => dismissModal()}
    />,
    <SuccessSlide
      key={1}
      label="Sharing Stopped"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="You are no longer sharing with:"
          />
          <Spacer size={16} />
          <TextBox text={appName} className="font-bold" />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
