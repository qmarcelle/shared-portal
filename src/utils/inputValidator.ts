/**
 * Formats the given phone number.
 * Will Replace the all characters except number and format it as per below sample
 * For example : a number as 1234565932 will be formatted as
 * (123) 456-5932
 * @param phone Phone number to mask
 * @returns The masked phone number in the format (123) 456-7890
 */
export const formatPhoneNumber = (phone: string): string => {
  phone = phone.replace(/[^0-9]/g, '');
  const area = phone.substring(0, 3);
  const pre = phone.substring(3, 6);
  const tel = phone.substring(6, 10);
  let value: string = '';
  if (area.length < 3) {
    value = '(' + area;
  } else if (area.length == 3 && pre.length < 3) {
    value = '(' + area + ')' + ' ' + pre;
  } else if (area.length == 3 && pre.length == 3) {
    value = '(' + area + ')' + ' ' + pre + '-' + tel;
  }
  return value;
};

/**
 * Validates the given phone number.
 * @param phone Phone number to mask
 * @returns Boolean
 */
export const isValidMobileNumber = (mobileNumber: string): boolean => {
  const phoneRegex = /^\d{3}\d{3}\d{4}$/;
  const digits = mobileNumber.replace(/\D/g, '');
  return phoneRegex.test(digits);
};

/**
 * Validates the given Email address for reg expression.
 * @param email
 * @returns Boolean
 */
export const isValidEmailAddress = (email: string): boolean => {
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  let validEmail = isValidEmail.test(email);
  if (validEmail == false && email.length == 0) {
    validEmail = true;
  }
  return validEmail;
};

/**
 * Validates the given Email address length.
 * @param email
 * @returns Boolean
 */
export const validateLength = (value: string): boolean => {
  const checkLength = value.length <= 40 ? true : false;
  return checkLength;
};
