/**
 * Computes whether the current date is in between the given date range
 * in format 'mm/dd' and returns true false accordingly.
 * @param startDate Start date
 * @param endDate End date
 * @returns Whether the current date is in between the given date range
 */
export function isDateInRange(startDate: string|undefined, endDate: string|undefined): boolean {
  if(!startDate || !endDate){
    return false
  }
  
  const today = new Date();
    const currentMonth = today.getMonth() + 1; // Months are zero-based in JS
    const currentDay = today.getDate();

    // Extract month and day from input strings
    const [startMonth, startDay] = startDate.split('/').map(Number);
    const [endMonth, endDay] = endDate.split('/').map(Number);

    // Convert dates to comparable numbers (MMDD format)
    const currentNumeric = currentMonth * 100 + currentDay;
    const startNumeric = startMonth * 100 + startDay;
    const endNumeric = endMonth * 100 + endDay;

    // Check if today's date falls within the range
    return currentNumeric >= startNumeric && currentNumeric <= endNumeric;
}