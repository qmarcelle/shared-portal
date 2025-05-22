import { auth } from '@/auth';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import BlueCareFooter from '../foundation/BlueCareFooter';
import Footer from '../foundation/Footer';

export const FooterServerWrapper = async () => {
  const session = await auth();
  const isLogin = session?.user.id && session?.user.currUsr.plan;

  if (isLogin) {
    try {
      return isBlueCareEligible(session.user.vRules) ? (
        <BlueCareFooter />
      ) : (
        <Footer />
      );
    } catch (error) {
      return <></>;
    }
  } else {
    return <></>;
  }
};
