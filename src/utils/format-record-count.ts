export function formatRecordCount(value: number): string {
  return Math.max(0, Math.floor(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
