import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { createChatSettings } from '@/app/chat/utils/chatUtils';
import { Metadata } from 'next';
import Dashboard from '.';
import { getDashboardData } from './actions/getDashboardData';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async () => {
  const result = await getDashboardData();
  const memberDetails = result.data?.memberDetails;
  let chatSettings = null;

  // Only build chatSettings if we have a selected plan and groupId
  if (memberDetails?.selectedPlan?.memeCk && memberDetails?.groupId) {
    // Fetch canonical user info (if needed for chat settings)
    const userInfo = await getLoggedInUserInfo(
      memberDetails.selectedPlan.memeCk,
    );
    // Build userData for chat settings
    const userData = {
      memCk: memberDetails.selectedPlan.memeCk,
      grpId: memberDetails.groupId,
      // Add more fields as needed from userInfo or memberDetails
    };
    chatSettings = createChatSettings(userData, 'cloud');
  }

  return <Dashboard data={result.data!} chatSettings={chatSettings} />;
};

export default DashboardPage;
