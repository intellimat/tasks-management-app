import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEstimatedTimeHHMM(millis: number) {
  const totalMinutes = Math.floor(millis / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const shownHours = hours !== 0 ? `${hours}h` : "";
  const shownMinutes = minutes !== 0 ? `${minutes}m` : "";

  return `${shownHours}${shownHours && shownMinutes ? ":" : ""}${shownMinutes}`;
}

export function getMillisFromHours(millis: number) {
  return millis * 60 * 60 * 1000;
}
export function getHoursFromMillis(millis: number) {
  return Math.floor(millis / 1000 / 60 / 60);
}
