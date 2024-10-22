export const toPascalCase = (value: string): string => {
  return value
    .split(/[\s_-]/) // Split by spaces, underscores, and hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
