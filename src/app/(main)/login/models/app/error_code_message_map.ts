/* eslint-disable quotes */
export const errorCodeMessageMap = new Map<string | number, string>([
  [401, "Oops! We're sorry. Something went wrong. Please try again 401."],
  [408, "Oops! We're sorry. Something went wrong. Please try again."],
  [500, "Oops! We're sorry. Something went wrong. Please try again."],
  [
    'MF-402',
    'There is a problem with the security code. Try re-entering or resending the code.',
  ],
  [
    'UI-401',
    "We didn't recognize the username or password you entered. Please try again. [UI-401]",
  ],
  [
    'UI-403',
    "We didn't recognize the username or password you entered. Please try again. [UI-403]",
  ],
]);

export const UNDEFINED_ERROR_CODE = 500;
