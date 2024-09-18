export const UNIXTimeSeconds = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};
