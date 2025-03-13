export function getDateTwoYearsAgo(): string {
  // Create a new Date object for today
  const today = new Date();

  // Subtract 2 years from the current date
  today.setFullYear(today.getFullYear() - 2);

  const year: number = today.getFullYear();
  const month: string = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day: string = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getCurrentDate(): string {
  // Create a new Date object for today
  const today = new Date();

  const year: number = today.getFullYear();
  const month: string = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day: string = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
