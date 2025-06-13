export interface SendEmailRequest {
  portal: string;
  appName: string;
  subject: string;
  recipients: string;
  bodyText: string;
}

export interface SendEmailResponse {
  httpStatus: number;
  message: string;
}
