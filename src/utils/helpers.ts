export function daysBetweenDates(startDate: Date, endDate: Date): number {
  // The getTime() method returns the number of milliseconds since January 1, 1970 UTC.
  const startTimestamp: number = startDate.getTime();
  const endTimestamp: number = endDate.getTime();

  // Calculate the difference in milliseconds.
  const differenceInMs: number = endTimestamp - startTimestamp;

  // Convert the millisecond difference to days.
  // A day has 1000 milliseconds * 60 seconds * 60 minutes * 24 hours = 86400000 ms.
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInDays: number = differenceInMs / millisecondsPerDay;

  // Use Math.floor() or Math.round() depending on how you want to handle partial days.
  // Math.floor() returns the integer number of full days.
  // Math.round() rounds to the nearest whole day.
  return Math.floor(differenceInDays);
}
