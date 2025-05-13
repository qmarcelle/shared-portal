'use client';

import ChatWidget from '@/components/ChatWidget';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { UserRole } from '@/userManagement/models/sessionUser';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import Link from 'next/link';
import MemberDashboard from './components/MemberDashboard';
import MemberDashboardTermedPlan from './components/MemberDashboardTermedPlan';
import NonMemberDashboard from './components/NonMemberDashboard';
import { PlanSelector } from './components/PlanSelector';
import { DashboardData } from './models/dashboardData';

export type DashboardProps = {
  data: DashboardData;
  chatSettings?: any;
};

const Dashboard = ({ data, chatSettings }: DashboardProps) => {
  // Log Genesys env vars for debugging
  const genesysEnvVars = {
    NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL:
      process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL,
    NEXT_PUBLIC_GENESYS_WIDGET_URL: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL,
    NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS:
      process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS,
    NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT:
      process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
    CLICK_TO_CHAT_ENDPOINT_RAW: JSON.stringify(
      process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
    ),
    CLICK_TO_CHAT_ENDPOINT_TYPE:
      typeof process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
    NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT:
      process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT,
    NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT:
      process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT,
    NEXT_PUBLIC_OPS_PHONE: process.env.NEXT_PUBLIC_OPS_PHONE,
    NEXT_PUBLIC_OPS_HOURS: process.env.NEXT_PUBLIC_OPS_HOURS,
    NEXT_PUBLIC_LEGACY_CHAT_URL: process.env.NEXT_PUBLIC_LEGACY_CHAT_URL,
    NEXT_PUBLIC_ESTIMATE_COSTS_SAPPHIRE:
      process.env.NEXT_PUBLIC_ESTIMATE_COSTS_SAPPHIRE,
  };

  // Environment detection helper
  const detectEnvironmentMismatch = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const envName = isDevelopment ? 'STAGING' : 'PRODUCTION';

    // Check if any production URLs are used in development
    const hasProdUrlsInDev =
      isDevelopment &&
      (process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT?.includes(
        'api.bcbst.com/prod',
      ) ||
        process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT?.includes(
          'api.bcbst.com/prod',
        ) ||
        process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT?.includes(
          'api.bcbst.com/prod',
        ));

    // Check if any staging URLs are used in production
    const hasStageUrlsInProd =
      !isDevelopment &&
      (process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT?.includes(
        'api3.bcbst.com/stge',
      ) ||
        process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT?.includes(
          'api3.bcbst.com/stge',
        ) ||
        process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT?.includes(
          'api3.bcbst.com/stge',
        ));

    // Show warning for environment mismatches
    if (hasProdUrlsInDev) {
      console.error(
        '%c⚠️ ENVIRONMENT MISMATCH! ⚠️\n' +
          '%cYou are in DEVELOPMENT but using PRODUCTION endpoints.\n' +
          'This is likely causing your chat issues!',
        'font-size: 18px; color: red; font-weight: bold',
        'font-size: 14px; color: red',
      );
    }

    if (hasStageUrlsInProd) {
      console.error(
        '%c⚠️ ENVIRONMENT MISMATCH! ⚠️\n' +
          '%cYou are in PRODUCTION but using STAGING endpoints.',
        'font-size: 18px; color: red; font-weight: bold',
        'font-size: 14px; color: red',
      );
    }

    // Log environment info in a visually clear way
    console.log(
      `%c ENVIRONMENT: ${envName} %c NODE_ENV: ${process.env.NODE_ENV} `,
      `font-size: 14px; background-color: ${isDevelopment ? '#2563eb' : '#16a34a'}; color: white; padding: 3px 6px; border-radius: 3px 0 0 3px; font-weight: bold`,
      `font-size: 14px; background-color: #1e293b; color: white; padding: 3px 6px; border-radius: 0 3px 3px 0`,
    );

    return {
      isDevelopment,
      envName,
      hasMismatch: hasProdUrlsInDev || hasStageUrlsInProd,
      mismatchType: hasProdUrlsInDev
        ? 'PROD_URLS_IN_DEV'
        : hasStageUrlsInProd
          ? 'STAGE_URLS_IN_PROD'
          : null,
    };
  };

  // Call the detector
  const envInfo = detectEnvironmentMismatch();

  // Add environment info to the existing console log
  console.log('[Dashboard] Genesys Env Vars:', {
    ...genesysEnvVars,
    environment: envInfo.envName,
    hasMismatch: envInfo.hasMismatch,
    mismatchType: envInfo.mismatchType,
  });

  function getWelcomeText() {
    if ([UserRole.MEMBER, UserRole.NON_MEM].includes(data.role!)) {
      return 'Welcome, ';
    } else {
      return 'Viewing as ';
    }
  }

  if (data.role != UserRole.NON_MEM && data.memberDetails?.planName == null) {
    return <PlanSelector plans={data.memberDetails!.plans!} />;
  }

  return (
    <div className="flex flex-col justify-center items-center page">
      <WelcomeBanner
        className="px-4"
        titleText={getWelcomeText()}
        name={toPascalCase(data.memberDetails?.firstName ?? '')}
        body={
          <>
            {data.memberDetails?.planName && (
              <>
                <TextBox text={`Plan: ${data.memberDetails?.planName}`} />
                <Spacer size={8} />
              </>
            )}
            {data.memberDetails?.subscriberId && (
              <>
                <TextBox
                  text={`Subscriber ID: ${data.memberDetails?.subscriberId}`}
                />
                <Spacer size={8} />
              </>
            )}
            {data.memberDetails?.groupId && (
              <>
                <TextBox text={`Group ID: ${data.memberDetails?.groupId}`} />
                <Spacer size={8} />
              </>
            )}
            {data.memberDetails?.coverageType?.length && (
              <>
                <TextBox
                  text={`Policies: ${data.memberDetails?.coverageType?.join(', ')}`}
                />
                <Spacer size={16} />
              </>
            )}
            {data.memberDetails?.planName && (
              <Link href="/myPlan" className="link-white-text">
                <p className="pb-2 pt-2">View Plan Details</p>
              </Link>
            )}
          </>
        }
      />
      <Spacer size={32}></Spacer>
      {data.role != UserRole.NON_MEM ? (
        <>
          {!data.memberDetails?.selectedPlan?.termedPlan ? (
            <MemberDashboard data={data} />
          ) : (
            <MemberDashboardTermedPlan data={data} />
          )}
        </>
      ) : (
        <NonMemberDashboard profiles={data.profiles!} />
      )}
      {chatSettings && <ChatWidget chatSettings={chatSettings} />}
    </div>
  );
};

export default Dashboard;
