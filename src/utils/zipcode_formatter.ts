export const formatZip = (zipCode: string | undefined) => {
  if (zipCode && zipCode?.length > 5) {
    return zipCode.substring(0, 5) + '-' + zipCode.substring(5, zipCode.length);
  }
  return zipCode ?? ' ';
};

export const isValidZipCode = (zipCode: string) => {
  const regex = /^\d{5}(-\d{4})?$/;
  return regex.test(zipCode);
};
