// Convert local Date → Local ISO (YYYY-MM-DDTHH:mm:ss)
export const formatDateToLocalISO = (date: Date): string => {
  const offset = date.getTimezoneOffset(); // minutes difference
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 19); 
  // 👉 "YYYY-MM-DDTHH:mm:ss" in local time
};

export const formatTimeToLocalISO = (date: Date): string => {
  const offset = date.getTimezoneOffset(); // minutes difference
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 19).split('T')[1]; 
  // 👉 "YYYY-MM-DDTHH:mm:ss" in local time
};