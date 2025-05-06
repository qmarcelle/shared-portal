/* eslint-disable quotes */
export const errorCodeMessageMap = new Map<string | number, string>([
  [400, "Oops! We're sorry. Something went wrong. Please try again."],
  [408, "Oops! We're sorry. Something went wrong. Please try again."],
  [500, "Oops! We're sorry. Something went wrong. Please try again."],
  [
    'MF-402',
    'There is a problem with the security code. Try re-entering or resending the code.',
  ],
  [
    'INVALID_OTP',
    'There is a problem with the security code. Try re-entering or resending the code.',
  ],
  [
    'INVALID_VALUE',
    'There is a problem with the security code. Try re-entering or resending the code.',
  ],
]);
