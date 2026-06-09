export function formatGelAmount(amount: number | string): string {
  const value = typeof amount === 'number' ? amount : Number.parseFloat(amount);
  if (Number.isNaN(value)) return String(amount);
  return `${value.toFixed(2)} ₾`;
}
