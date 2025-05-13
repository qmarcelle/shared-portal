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
  console.log('[DashboardPage] Starting to fetch dashboard data');
  const result = await getDashboardData();
  console.log('[DashboardPage] Dashboard data fetched', {
    hasData: !!result.data,
    hasMemberDetails: !!result.data?.memberDetails,
    memberDetailsProps: result.data?.memberDetails
      ? Object.keys(result.data.memberDetails)
      : [],
    hasPlans: !!result.data?.memberDetails?.plans,
    plansLength: result.data?.memberDetails?.plans?.length,
    timestamp: new Date().toISOString(),
  });

  const memberDetails = result.data?.memberDetails;
  let chatSettings = null;

  // Only build chatSettings if we have a selected plan and groupId
  if (memberDetails?.selectedPlan?.memeCk && memberDetails?.groupId) {
    console.log('[DashboardPage] Building chat settings', {
      hasMemeKey: !!memberDetails.selectedPlan.memeCk,
      hasGroupId: !!memberDetails.groupId,
      timestamp: new Date().toISOString(),
    });

    // Fetch canonical user info
    const userInfo = await getLoggedInUserInfo(
      memberDetails.selectedPlan.memeCk,
    );

    // Build userData for chat settings
    const userData = {
      memCk: memberDetails.selectedPlan.memeCk,
      grpId: memberDetails.groupId,
    };

    console.log('[DashboardPage] Creating chat settings with userData', {
      userDataKeys: Object.keys(userData),
      timestamp: new Date().toISOString(),
    });

    // Wrapping createChatSettings in try/catch to see if it's causing issues
    try {
      chatSettings = createChatSettings(userData, 'cloud');
      console.log('[DashboardPage] Chat settings created successfully');
    } catch (err) {
      console.error('[DashboardPage] Error creating chat settings:', err);
    }
  } else {
    console.log(
      '[DashboardPage] Skipping chat settings - missing required data',
      {
        hasMemeKey: !!memberDetails?.selectedPlan?.memeCk,
        hasGroupId: !!memberDetails?.groupId,
      },
    );
  }

  console.log('[DashboardPage] Rendering Dashboard component', {
    hasData: !!result.data,
    hasChatSettings: !!chatSettings,
    timestamp: new Date().toISOString(),
  });

  return <Dashboard data={result.data!} chatSettings={chatSettings} />;
};

export default DashboardPage;
