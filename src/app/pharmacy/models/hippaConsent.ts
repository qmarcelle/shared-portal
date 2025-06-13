export interface HipaaFindRequest {
  memberCk: string;
  application: string;
}

export interface HipaaFindResponse {
  consent: boolean;
  effDate: string;
  termDate: string;
  error?: {
    errorCode: string;
  };
}

export interface HipaaUserConsentRequest extends HipaaFindRequest {
  consent: boolean;
  effDate: string;
  termDate: string;
}

export interface HipaaUserConsentResponse {
  success: boolean;
  serviceError?: { desc: string; id: string };
}
