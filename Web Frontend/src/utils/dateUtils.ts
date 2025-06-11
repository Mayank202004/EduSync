/**
 * @desc Formats date in the format 10 May 2025
 * @param dateString - Date String
 * @returns {String} - Date string in format 10 May 2025
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @desc Formats date in the format YYYY-MM-DD
 * @param dateStr - Date String
 * @returns {String} - In hte format YYYY-MM-DD
 */
export const formatToYYYYMM_D = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 2-digit month
  const day = date.getDate(); // No pad
  return `${year}-${month}-${day}`;
};


export const formatDateTime = (dateTimeString: string): string => {
  return new Date(dateTimeString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

