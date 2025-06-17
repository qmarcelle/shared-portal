import { memberService } from '@/utils/api/memberService';
import 'server-only';
import { LegacyChatInfo } from '../types/c2ctypes';

// Cache object to store chat info by memberCk

export async function getChatInfo(
  memberCk: string,
): Promise<LegacyChatInfo | undefined> {
  // Return cached info if available

  try {
    const chatInfo = await memberService.get(
      `/api/member/v1/members/byMemberCk/${memberCk}/chat/getChatInfo`,
    );

    const resp = chatInfo?.data as LegacyChatInfo;

    return resp;
  } catch (error) {
    console.error('Error fetching chat info:', error);
    throw new Error('Failed to fetch chat info');
  }
}
