// Determine the maxWidth with default to px if no unit is provided
export const resolveMaxWidth = (maxWidth: number | string | undefined) => {
  typeof maxWidth === 'number' || /^\d+$/.test(maxWidth as string)
    ? `${maxWidth}px`
    : maxWidth;
  return maxWidth;
};
