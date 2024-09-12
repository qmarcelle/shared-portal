import { NextErrorResp } from './nextErrorResp';

export interface ActionResponse<S, T> {
  status: S;
  data?: T;
  error?: NextErrorResp;
}
