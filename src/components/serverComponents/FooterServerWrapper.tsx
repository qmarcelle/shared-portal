import { auth } from '@/auth';
import Footer from '../foundation/Footer';

export const FooterServerWrapper = async () => {
  const session = await auth();
  const isLogin = session?.user.id && session?.user.currUsr.plan;

  if (isLogin) {
    try {
      return <Footer />;
    } catch (error) {
      return <></>;
    }
  } else {
    return <></>;
  }
};
