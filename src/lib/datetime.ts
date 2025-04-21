export function formatDate(rawTimestamp: string) {
  // Example: rawTimestamp = "2025-04-20 10:07:55.323847+02";
  // Convert to JS Date object
  const date = new Date(rawTimestamp);

  // Format using toLocaleString (customizable)
  const formattedDate = date.toLocaleString("en-UK", {
    // dateStyle: "short",
    year: "numeric",
    month: "short", // "April"
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short", // e.g., GMT+2
  });

  return formattedDate;
}

export function getEstimatedTimeHHMM(millis: number) {
  const totalMinutes = Math.floor(millis / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const shownHours = hours !== 0 ? `${hours}h` : "";
  const shownMinutes = minutes !== 0 ? `${minutes}m` : "";

  return `${shownHours}${shownHours && shownMinutes ? ":" : ""}${shownMinutes}`;
}

export function getMillisFromHours(hours: number) {
  return hours * 60 * 60 * 1000;
}

export function getHoursFromMillis(millis: number): number {
  return parseFloat((millis / 1000 / 60 / 60).toFixed(1));
}
