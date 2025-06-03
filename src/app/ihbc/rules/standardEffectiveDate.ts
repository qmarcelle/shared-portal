export function computeStandardEffectiveDate(): Date {
  const givenDate = new Date();

  if (givenDate.getDate() <= 15) {
    givenDate.setMonth(givenDate.getMonth() + 1);
  } else {
    givenDate.setMonth(givenDate.getMonth() + 2);
  }

  givenDate.setDate(1);

  return givenDate;
}
