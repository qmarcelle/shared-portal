export const formatCurrency = (
  value: number | bigint | undefined,
): string | undefined => {
  if (!value && value !== 0) {
    return;
  }

  return Intl.NumberFormat('en-ES', {
    currency: 'USD',
    currencyDisplay: 'symbol',
    currencySign: 'standard',
    style: 'currency',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    minimumIntegerDigits: 1,
  }).format(value);
};
