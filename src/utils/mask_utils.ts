/**
 * Masks the given phone number.
 * For example : a number as 9866545932 will be formatted as
 * (\*\*\*)*\*\*-5932
 * @param phone Phone number to mask
 * @returns The masked phone number in the format (\*\*\*)*\*\*-dddd
 */
export const maskPhoneNumber = (phone: string): string =>
  `(***)***-${phone.substring(phone.length - 4)}`;

// Function to mask email address
export const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  return `${user[0]}${'*'.repeat(user.length - 1)}@${domain}`;
};
