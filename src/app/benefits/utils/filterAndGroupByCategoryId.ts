export const filterAndGroupByCategoryId = (
  data: CoveredService[] | undefined,
  categoryId: number,
) => {
  if (data === undefined) {
    return [];
  }
  return data
    .map((item) => {
      return {
        serviceDetails: item.serviceDetails.filter(
          (detail) => detail.categoryId === categoryId,
        ),
      };
    })
    .filter((item) => item.serviceDetails.length > 0);
};
