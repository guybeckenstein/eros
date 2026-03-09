export function calculateTimeDifference(inputTime: string): string {
  const { seconds, minutes, hours, days, months } =
    getTimeDifference(inputTime);

  // Logic flow based on your thresholds
  if (months > 0) {
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  if (days === 1) {
    return 'Yesterday';
  }
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  return `${Math.max(0, seconds)} second${seconds === 1 ? '' : 's'} ago`;
}

export function getVerboseTimeDifference(inputTime: string) {
  let text = '';
  let isToday = true;
  const { seconds, minutes, hours, days, months } =
    getTimeDifference(inputTime);

  // Logic flow based on your thresholds
  if (months > 0) {
    text = `${months} month${months === 1 ? '' : 's'} ago`;
    isToday = false;
  } else if (days === 1) {
    text = 'Yesterday';
    isToday = false;
  } else if (days > 0) {
    text = `${days} day${days === 1 ? '' : 's'} ago`;
    isToday = false;
  } else if (hours > 0) {
    text = `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    text = `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    text = `${Math.max(0, seconds)} second${seconds === 1 ? '' : 's'} ago`;
  }
  return {
    text: text,
    isToday: isToday,
  };
}

export function getTimeDifference(
  inputTime: string,
  whichLarger: 'now' | 'input' = 'now',
) {
  const now = Date.now();
  const input = new Date(inputTime).getTime();
  const diffInMs = whichLarger === 'now' ? now - input : input - now;

  // Conversion constants
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  return {
    seconds: seconds,
    minutes: minutes,
    hours: hours,
    days: days,
    months: months,
  };
}
