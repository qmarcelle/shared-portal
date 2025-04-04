export const formatText = (text: string) => {
  if (!text) return '';
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};
