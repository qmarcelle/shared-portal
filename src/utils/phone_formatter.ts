export const formatPhone = (phone: string | undefined) => {
  if (phone && phone?.length > 0) {
    return (
      '(' +
      phone.substring(0, 3) +
      ') ' +
      phone.substring(3, 6) +
      '-' +
      phone.substring(6)
    );
  }
  return phone ?? '';
};
