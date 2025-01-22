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

export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[!@#$%^&*()\-=_+])(?!.*[\[\]{};':"\\|,.`<>\/?~]).{8,30}$/g;
  return passwordRegex.test(password);
};

export const isSpecialCharactersAvailable = (password: string): boolean => {
  const passwordRegex = /.*[\[\]{};':"\\|,.`<>\/?~].*/;
  return passwordRegex.test(password);
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
/**
 * Validates the given Date formate ib MM/DD/YYYY.
 * @param dateVal
 * @returns date
 */
export const validateDate = (dateVal: string) => {
  if (dateVal.replace(/\//g, '').length <= 7) {
    return false;
  }
  // Regular expression to match MM/DD/YYYY format
  const datePattern =
    /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)dd/;

  // Check if the input matches the date pattern
  if (datePattern.test(dateVal)) {
    return false;
  }
  // Parse the date parts to integers
  const parts = dateVal.split('/');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Check if the date is valid
  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};
/**
 * Formats the given Date.
 * Will Replace the all characters except number and format it as per below sample
 * For example : a date as 11181994 will be formatted as
 * 11/18/1994
 * @param value
 * @returns masked  date
 */
export const formatDate = (value: string) => {
  if (value.includes('/')) {
    const digits = value.split('/');
    if (digits.length == 2) {
      if (digits[1].length > 2) {
        value =
          digits[0] + '/' + digits[1].slice(0, 2) + '/' + digits[1].slice(2);
      }
    }
  } else {
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    //Add slashes at the appropriate positions
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }
  }
  return value;
};
/**
 * Confirms if email and confiem email match or not
 * @param email and confirm email
 * @returns boolen
 */
export const isConfirmEmailAddressMatch = (value: string, email: string) => {
  if (value !== email) {
    return false;
  } else {
    return true;
  }
};
