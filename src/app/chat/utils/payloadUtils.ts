import { ChatPayload } from '../models/types';

export const convertChatPayloadToRecord = (
  chatPayload: ChatPayload | null,
): Record<string, string | boolean | number> => {
  if (!chatPayload) {
    return {};
  }

  const payloadAsRecord: Record<string, string | boolean | number> = {
    memberClientID: chatPayload.memberClientID,
    userID: chatPayload.userID,
    planId: chatPayload.planId,
  };

  if (chatPayload.message) {
    payloadAsRecord.message = chatPayload.message;
  }

  return payloadAsRecord;
};
