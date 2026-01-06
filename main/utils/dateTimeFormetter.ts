// Convert local Date → Local ISO (YYYY-MM-DDTHH:mm:ss)
export const formatDateToLocalISO = (date: Date): string => {
  const offset = date.getTimezoneOffset(); // minutes difference
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 19); 
  // 👉 "YYYY-MM-DDTHH:mm:ss" in local time
};

function localTimeToUTCISO(date: Date): string {
  // getTimezoneOffset = difference between local and UTC in minutes
  const offset = date.getTimezoneOffset();
  // shift local time back to UTC
  const utcDate = new Date(date.getTime() + offset * 60 * 1000);
  return utcDate.toISOString(); // full UTC ISO string
}
