import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Formats an ISO date string for input fields (YYYY-MM-DD).
 *
 * @param isoDate - The ISO date string.
 * @returns A formatted date string suitable for input fields.
 */
export const formatDateForInput = (isoDate: string) => {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
};


