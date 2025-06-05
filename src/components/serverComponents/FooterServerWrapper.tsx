import { auth } from '@/auth';
import { UserRole } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import BlueCareFooter from '../foundation/BlueCareFooter';
import Footer from '../foundation/Footer';

export const FooterServerWrapper = async () => {
  const session = await auth();
  const isLogin = session?.user.id && session?.user.currUsr.plan;
  const isNonMember = UserRole.NON_MEM === session?.user.currUsr.role;

  if (isLogin || isNonMember) {
    try {
      return isBlueCareEligible(session.user.vRules) ? (
        <BlueCareFooter />
      ) : (
        <Footer />
      );
    } catch (error) {
      logger.error('Error from FooterServerWrapper', error);
      return <></>;
    }
  } else {
    return <></>;
  }
};
