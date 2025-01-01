export interface EmailUniquenessRequest {
  memberKey: string | undefined;
  subscriberKey: string | undefined;
  emailAddress: string;
}

export interface EmailUniquenessResponse {
  returnCode: string;
}
