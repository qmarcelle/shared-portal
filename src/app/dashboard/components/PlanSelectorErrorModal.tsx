import { LoginErrorTemplate } from '@/app/login/components/LoginErrorTemplate';
import { useLoginStore } from '@/app/login/stores/loginStore';
import { ContactUs } from '@/components/composite/ContactUs';
import { AppLink } from '@/components/foundation/AppLink';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { DEFAULT_LOGOUT_REDIRECT } from '@/utils/routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLoader from './DashboardLoader';

export const PlanSelectorErrorModal = () => {
  const { showAppModal, dismissModal } = useAppModalStore();
  const { signOut } = useLoginStore();
  const [isRefreshed, setIsRefreshed] = useState(false);
  const router = useRouter();
  const onSignOut = async () => {
    await signOut();
    dismissModal();
    router.replace(DEFAULT_LOGOUT_REDIRECT);
    router.refresh();
  };
  const OnTryAgain = async () => {
    router.refresh();
    setIsRefreshed(true);
  };

  useEffect(() => {
    useAppModalStore.setState({
      isFlexModal: true,
    });
    showAppModal({
      content: (
        <LoginErrorTemplate
          label="Loading Error"
          body={
            <Column className="items-center w-[352px] ">
              <TextBox
                className="text-center"
                text="Sorry, we can't load this information right now. Please try again later."
              />
              <Spacer size={8} />
              {!isRefreshed && (
                <Button
                  label="Try Again"
                  className="w-[280px]"
                  callback={() => OnTryAgain()}
                />
              )}
              <Spacer size={8} />
              <AppLink label={'Log Out'} callback={() => onSignOut()} />
              <Spacer size={32} />
              <Divider />
              <Spacer size={32} />
              <TextBox className="title-3 center" text="Need help?" />
              <Spacer size={16} />
              <footer>
                <p className="text-center">
                  Give us a call using the number listed on the back of your
                  Member ID card or <ContactUs label=" contact us" />
                </p>
              </footer>
            </Column>
          }
          bottomNote={''}
          contactUs={''}
        />
      ),
    });

    return () => {
      useAppModalStore.setState({ isFlexModal: false });
    };
  }, [isRefreshed]);
  return <DashboardLoader />;
};
