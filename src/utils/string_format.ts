/**
 * Capitalize the first letter of a string value
 * For example : a string as PAID will be formatted as
 * Paid
 * @param val string to format
 * @returns The capitalized string
 */

export function capitalizeString(val: string) {
  console.log(val);
  const stringToFormat: string = val.toLowerCase();
  return (
    String(stringToFormat).charAt(0).toUpperCase() +
    String(stringToFormat).slice(1)
  );
}
