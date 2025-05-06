// Temporary local type definitions
export type ClientIdentification = {
  isBlueEliteGroup?: boolean | string;
  groupType?: string;
  memberClientId?: string;
};

export type MemberEligibility = {
  isDental?: string;
  isMedical?: string;
  isVision?: string;
  isWellnessOnly?: string;
};

// src/app/chat/config/constants.ts
export const CLIENT_ID_CONST = {
  BlueCare: 'BlueCare',
  BlueCarePlus: 'BlueCarePlus',
  CoverTN: 'CoverTN',
  CoverKids: 'CoverKids',
  SeniorCare: 'SeniorCare',
  BlueElite: 'BlueElite',
  Individual: 'Individual',
  // Add any other client IDs you use
};
/**
 * Determines if the member has dental coverage only
 */
export function isDentalOnly(eligibility: MemberEligibility): boolean {
  return (
    eligibility.isDental === 'true' &&
    !(
      eligibility.isMedical === 'true' ||
      eligibility.isVision === 'true' ||
      eligibility.isWellnessOnly === 'true'
    )
  );
}

/**
 * Gets client ID based on member information
 */
export function getClientID(client: ClientIdentification): string {
  if (client.isBlueEliteGroup === 'true' || client.isBlueEliteGroup === true) {
    return CLIENT_ID_CONST.BlueElite;
  } else if (client.groupType === 'INDV') {
    return CLIENT_ID_CONST.Individual;
  } else {
    return client.memberClientId || CLIENT_ID_CONST.Individual;
  }
}

/**
 * Default client ID handling
 */
export function defaultedClientID(clientID?: string | null): string {
  if (!clientID) return 'Default';
  return Object.values(CLIENT_ID_CONST).includes(
    clientID.trim() as (typeof CLIENT_ID_CONST)[keyof typeof CLIENT_ID_CONST],
  )
    ? clientID.trim()
    : 'Default';
}

/**
 * Determines chat type based on client ID
 */
export function getChatType(calculatedCiciId: string): string {
  switch (calculatedCiciId) {
    case CLIENT_ID_CONST.BlueCare:
    case CLIENT_ID_CONST.BlueCarePlus:
    case CLIENT_ID_CONST.CoverTN:
    case CLIENT_ID_CONST.CoverKids:
      //return CHAT_TYPE_CONST.BlueCareChat;
      return 'BlueCareChat';
    case CLIENT_ID_CONST.SeniorCare:
    case CLIENT_ID_CONST.BlueElite:
      //return CHAT_TYPE_CONST.SeniorCareChat;
      return 'SeniorCareChat';
    case CLIENT_ID_CONST.Individual:
    default:
      //return CHAT_TYPE_CONST.DefaultChat;
      return 'DefaultChat';
  }
}

/**
 * Format name to proper case (first letter capitalized, rest lowercase)
 */
export function formatNameToPascalCase(name: string): string {
  return name.replace(
    /(\w)(\w*)/g,
    (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase(),
  );
}

/**
 * Sets the chat disclaimer message based on client ID
 */
export function getChatDisclaimerMessage(calculatedCiciId: string): string {
  switch (calculatedCiciId) {
    case CLIENT_ID_CONST.BlueCare:
    case CLIENT_ID_CONST.BlueCarePlus:
      return 'For quality assurance your chat may be monitored and/or recorded. Benefits are based on the member&#39 eligibility when services are rendered. Benefits are determined by the Division of TennCare and are subject to change.';
    case CLIENT_ID_CONST.CoverTN:
      return 'This information provided today is based on current eligibility and contract limitations. Final determination will be made upon the completion of the processing of your claim.';
    default:
      return 'This information provided today is based on current eligibility and contract limitations.<br>Final determination will be made upon the completion of the processing of your claim.<br>For quality assurance your chat may be monitored and/or recorded.<br><br>Estimates are not a confirmation of coverage or benefits. The Health Care Cost Estimator tool is designed to help you plan for health care costs. Your actual cost may be different based on your health status and services provided. Final determination will be made when the claims are received based on eligibility at time of service. Payment of benefits remains subject to any contract terms, exclusions, and/or riders. <br> <br> To better serve you, we may send you a survey or questions about your chat experience by email. Communications via unencrypted email over the internet are not secure, and there is a possibility that information included in an email can be intercepted and read by other parties besides the person to whom it is addressed.';
  }
}
