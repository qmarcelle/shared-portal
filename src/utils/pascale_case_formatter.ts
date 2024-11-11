export const toPascalCase = (value: string): string => {
  return value
    .split(/[\s]/) // Split by spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
