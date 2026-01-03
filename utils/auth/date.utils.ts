export function isoToMysql(isoString: string) {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}
