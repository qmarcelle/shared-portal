'use server';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';

export default async function getUserData(): Promise<LoggedInUserInfo> {
  // Replace the following with actual data fetching logic
  return loggedInUserInfoMockResp;
}
