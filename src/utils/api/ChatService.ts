import { logger } from '../logger';
import { ChatInfoResponse, memberService } from './memberService';

export async function getChatInfo(
  memberId: number,
  planId: string,
): Promise<ChatInfoResponse> {
  try {
    // Use memberService which already has the proper baseURL configuration
    const { data } = await memberService.get<ChatInfoResponse>('/chat/info', {
      params: { memberId, planId },
    });
    return data;
  } catch (err) {
    logger.error('[ChatService] getChatInfo failed', err);
    return {
      member_ck: memberId,
      first_name: '',
      last_name: '',
      lob_group: '',
      planId,
      isEligible: false,
      cloudChatEligible: false,
      businessHours: { text: 'Unavailable', isOpen: false },
    } as ChatInfoResponse;
  }
}
