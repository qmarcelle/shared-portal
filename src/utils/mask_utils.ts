export const maskPhoneNumber = (phone: string): string =>
  phone.replace(/.(?=.{4})/g, '*');

// Function to mask email address
export const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  return `${user[0]}${'*'.repeat(user.length - 1)}@${domain}`;
};
