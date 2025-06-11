/* eslint-disable quotes */
// Defects 75000, 74996, 74987, 74990, 75003: Enhanced login error handling for specific HTTP status codes
export const inlineErrorCodeMessageMap = new Map<string | number, string>([
  [401, "Oops! We're sorry. Something went wrong. Please try again."],
  [408, "Oops! We're sorry. Something went wrong. Please try again."],
  // Defect 74996: 500 Internal Server Error handling
  [500, 'Unable to process request (Error Code: 500)'],
  // Defect 75000: 404 Not Found error handling
  [404, 'The requested resource does not exist (Error code: 404)'],
  // Defect 75003: 502 Bad Gateway error handling
  [502, 'Bad Gateway (Error Code: 502)'],
  // Defect 74990: 503 Service Unavailable error handling
  [503, 'The Service is unavailable (Error Code: 503)'],
  // Defect 74987: 504 Gateway Timeout error handling
  [504, 'Connection Timeout (Error Code: 504)'],
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
