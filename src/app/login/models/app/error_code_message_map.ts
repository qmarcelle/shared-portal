/* eslint-disable quotes */
export const inlineErrorCodeMessageMap = new Map<string | number, string>([
  [401, "Oops! We're sorry. Something went wrong. Please try again."],
  [408, "Oops! We're sorry. Something went wrong. Please try again."],
  [500, 'Unable to process request (Error Code: 500). Please try again later.'],
  [
    404,
    'The requested resource does not exist (Error code: 404). Please try again or contact support.',
  ],
  [
    502,
    'Bad Gateway (Error Code: 502). Please contact support if this issue persists.',
  ],
  [
    503,
    'The Service is unavailable (Error Code: 503). The system may be undergoing maintenance.',
  ],
  [504, 'Connection Timeout (Error Code: 504). Please try again.'],
  [
    'MF-402',
    'There is a problem with the security code. Try re-entering or resending the code.',
  ],
  [
    'OTP Expired',
    'There is a problem with the security code. Try re-entering or resending the code.',
  ],
  [
    'MF-403',
    'There is a problem with the security code. Try re-entering or resending the code.',
  ],
  [
    'UI-401',
    "We didn't recognize the username or password you entered. Please try again.",
  ],
  [
    'UI-403',
    "We didn't recognize the username or password you entered. Please try again.",
  ],
  ['MFA-403', 'Invalid OTP'],
  [
    'UI-404',
    "We didn't recognize the username or password you entered. Please try again.",
  ],
]);

export const UNDEFINED_ERROR_CODE = 500;

export const slideErrorCodes = ['UI-405', 'MF-405'];

export const pingErrorCodes = ['PP-600', 'PP-601'];
