'use server';

import { memberMockResponse } from '@/app/profileSettings/mock/memberMockResponse';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMemberDetails(): Promise<any> {
  //need to implement member service API call
  return memberMockResponse;
}
