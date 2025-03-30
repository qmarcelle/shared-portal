/**
 * Checks if the current time is within chat operating hours
 * @param rawChatHours Format example: "Monday-Friday_8:00am-5:00pm_17.00"
 * @returns true if within operating hours, false otherwise
 */
export function checkChatHours(rawChatHours: string): boolean {
  try {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: 'America/New_York'
    });
    
    const [hours, minutes] = timeStr.split(':');
    const currentTime = parseFloat(`${hours}.${minutes}`);
    
    // Extract end time from raw chat hours
    // Format example: "Monday-Friday_8:00am-5:00pm_17.00"
    const endChatHours = rawChatHours.substring(
      rawChatHours.lastIndexOf('_') + 1
    );
    
    let endTime = parseFloat(endChatHours);
    
    // If end time is between 1 and 12 (not 24-hour format), add 12 to convert to 24-hour
    if (typeof endTime === 'number' && (0 < endTime && endTime < 12) && endTime !== 24) {
      endTime += 12;
    }
    
    return currentTime <= endTime;
  } catch (error) {
    console.error('Error checking chat hours:', error);
    return true; // Default to available if calculation fails
  }
} 