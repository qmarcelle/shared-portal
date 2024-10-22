export const formatZip = (zipCode: string | undefined) => {
  if (zipCode && zipCode?.length > 5) {
    return zipCode.substring(0, 5) + '-' + zipCode.substring(5, zipCode.length);
  }
  return zipCode ?? ' ';
};
