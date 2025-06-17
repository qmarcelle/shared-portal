'use server';
import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getOperationHours } from '@/app/profileSettings/actions/profileSettingsAction';
import { auth } from '@/auth';
import { fetAuthTokenFromPing } from '@/utils/api/getToken';

import { ActionResponse } from '@/models/app/actionResponse';
import { convertToISO8601 } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import { formatText } from '@/utils/name_formatter';
import { ChatDataStatus, IChatData, LegacyChatInfo } from '../types/c2ctypes';
import { getChatInfo } from './getChatInfo';

export async function getClickToChatData(): Promise<
  ActionResponse<ChatDataStatus, IChatData>
> {
  const session = await auth();
  if (!session || !session.user.currUsr || !session.user.currUsr.plan) {
    return {
      status: ChatDataStatus.CHAT_INELIGIBLE,
    };
  }
  const [
    loggedInUserInfoResult,
    clickToChatTokenResult,
    legacyChatInfoResult,
    operationsHoursResult,
  ] = await Promise.allSettled([
    getLoggedInUserInfo(session!.user.currUsr!.plan!.memCk),
    fetAuthTokenFromPing(),
    getChatInfo(session!.user.currUsr!.plan!.memCk),
    getOperationHours(),
  ]);

  // Add error handling and output messaging for failed calls
  if (loggedInUserInfoResult.status === 'rejected') {
    console.error(
      'Failed to fetch logged in user info:',
      loggedInUserInfoResult.reason,
    );
    return {
      status: ChatDataStatus.ERROR,
    };
  }
  if (clickToChatTokenResult.status === 'rejected') {
    console.error(
      'Failed to fetch ClickToChat token:',
      clickToChatTokenResult.reason,
    );
    return {
      status: ChatDataStatus.ERROR,
    };
  }
  if (legacyChatInfoResult.status === 'rejected') {
    console.error(
      'Failed to fetch legacy chat info:',
      legacyChatInfoResult.reason,
    );
    return {
      status: ChatDataStatus.ERROR,
    };
  }
  if (operationsHoursResult.status === 'rejected') {
    console.error(
      'Failed to fetch operation hours:',
      operationsHoursResult.reason,
    );
    return {
      status: ChatDataStatus.ERROR,
    };
  }

  const blueEliteChatGroup =
    process.env.CLICK_TO_CHAT_BLUE_ELITE_CHAT_GROUP?.split(',').some(
      (groupId) => groupId === loggedInUserInfo.groupData.groupID,
    ) ?? false;

  const loggedInUserInfo =
    loggedInUserInfoResult.status === 'fulfilled'
      ? loggedInUserInfoResult.value
      : {
          groupData: { groupID: '', clientID: '' },
          members: [
            {
              firstName: '',
              lastName: '',
              birthDate: '',
              planDetails: [],
              memberCk: 0,
              memberSuffix: '',
            },
          ],
          subscriberLoggedIn: false,
          subscriberFirstName: '',
          subscriberLastName: '',
          subscriberDateOfBirth: '',
          isActive: false,
          lob: '',
          subscriberID: '',
        };
  const clickToChatToken =
    clickToChatTokenResult.status === 'fulfilled'
      ? clickToChatTokenResult.value
      : null;
  const legacyChatInfo: LegacyChatInfo =
    legacyChatInfoResult.status === 'fulfilled'
      ? legacyChatInfoResult.value!
      : {
          routingChatBotEligibility: false,
          chatAvailable: false,
          workingHours: '',
          chatBotEligibility: false,
          chatIDChatBotName: '',
          chatGroup: '',
          cloudChatEligible: false,
        };
  if (
    !legacyChatInfo?.chatBotEligibility &&
    !legacyChatInfo?.routingChatBotEligibility &&
    !legacyChatInfo?.cloudChatEligible
  ) {
    return {
      status: ChatDataStatus.CHAT_INELIGIBLE,
    };
  }
  const operationsHours =
    operationsHoursResult.status === 'fulfilled'
      ? operationsHoursResult.value
      : { memberServicePhoneNumber: '', operationHours: '' };

  console.log('legacyChatInfo ' + JSON.stringify(legacyChatInfo));

  const member = loggedInUserInfo.members.find(
    (member) =>
      member.memberCk === parseFloat(session!.user.currUsr!.plan!.memCk),
  );

  if (member === undefined || member.memberSuffix === undefined) {
    logger.error('Member SFX Info not found for chat.');
    throw new Error('Member info not found.');
  }

  const sfx = member.memberSuffix;
  const chatInformation = {
    clickToChatToken: clickToChatToken,
    routingChatbotEligible: legacyChatInfo?.routingChatBotEligibility,
    clickToChatEndpoint: legacyChatInfo?.routingChatBotEligibility
      ? process.env.CLICK_TO_CHAT_CHATBOT_ENDPOINT
      : process.env.CLICK_TO_CHAT_CHAT_ENDPOINT,
    clickToChatDemoEndPoint: process.env.CLICK_TO_CHAT_DEMO_ENDPOINT,
    coBrowseLicence: process.env.CLICK_TO_CHAT_COBROWSE_LICENSE,
    coBrowseSource: process.env.CLICK_TO_CHAT_COBROWSE_SOURCE,
    coBrowseURL: process.env.CLICK_TO_CHAT_COBROWSE_URL,
    opsPhone: operationsHours.memberServicePhoneNumber,
    opsPhoneHours: operationsHours.operationHours,
    user_id: session!.user.id,
    user_name: loggedInUserInfo.subscriberLoggedIn
      ? loggedInUserInfo.subscriberFirstName
      : loggedInUserInfo.members[0]?.firstName || '',
    isDemoMember: process.env.IS_DEMO_MEMBER === 'true',
    isAmplifyMem: session!.user.vRules?.amplifyHealth || false,
    groupID: loggedInUserInfo.groupData.groupID || '',
    memberClientID: loggedInUserInfo.groupData.clientID || '',
    groupType: loggedInUserInfo.lob || '',
    isDental: session!.user.vRules?.dental || false,
    isChatAvailable: legacyChatInfo?.chatAvailable,
    isCobraEligible: false, //session!, //TODO: Fix Braden
    workingHrs: convertChatHours(legacyChatInfo?.workingHours),
    rawChatHrs: legacyChatInfo?.workingHours,
    chatbotEligible: legacyChatInfo?.chatBotEligibility,
    memberMedicalPlanId:
      loggedInUserInfo.members[0]?.planDetails?.find(
        (plan) => plan.productCategory === 'M',
      )?.planID || '',
    isIDCardEligible:
      loggedInUserInfo.isActive && legacyChatInfo?.chatBotEligibility,
    memberDOB: loggedInUserInfo.subscriberLoggedIn
      ? convertToISO8601(loggedInUserInfo.subscriberDateOfBirth)
      : convertToISO8601(loggedInUserInfo.members[0]?.birthDate) || '',
    formattedFirstName: loggedInUserInfo.subscriberLoggedIn
      ? formatText(loggedInUserInfo.subscriberFirstName)
      : formatText(loggedInUserInfo.members[0]?.firstName) || '',
    memberLastName: loggedInUserInfo.subscriberLoggedIn
      ? formatText(loggedInUserInfo.subscriberLastName)
      : formatText(loggedInUserInfo.members[0]?.lastName) || '',
    isMedical: session!.user.vRules?.medical || false,
    isVision: session!.user.vRules?.vision || false,
    idCardChatBotName: legacyChatInfo?.chatIDChatBotName,
    subscriberId: loggedInUserInfo.subscriberID || '',
    sfx: sfx,
    isBlueEliteGroup: blueEliteChatGroup,
    isWellnessOnly: session!.user.vRules?.wellnessOnly || false,
  };
  console.log('chatInformation' + JSON.stringify(chatInformation));
  return {
    status: ChatDataStatus.SUCCESS,
    data: chatInformation,
  };
}

function convertChatHours(
  workingHours: string | undefined,
): string | undefined {
  if (workingHours == undefined) return workingHours;
  const splitStrings = workingHours.split('_');
  if (workingHours === 'S_S_24') {
    return 'Available 24/7';
  }
  if (splitStrings.length !== 4) {
    throw new Error('Invalid working hours format');
  }

  const formattedHours = `${splitStrings[0]}-${splitStrings[1]} ${splitStrings[2]}AM-${splitStrings[3]}PM (EST)`;
  return formattedHours;
}
