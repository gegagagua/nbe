export function formatOfficialCaseNumberDisplay(
  regnumber: string | null | undefined,
  fallbackId: number,
): string {
  const raw = regnumber?.trim();
  if (raw) {
    const letterDigit = raw.match(/^([A-Za-z])(\d{1,12})$/);
    if (letterDigit) {
      const letter = letterDigit[1].toUpperCase();
      const digits = letterDigit[2].padStart(8, '0').slice(-8);
      return `${letter}${digits}`;
    }
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length > 0) {
      return `A${digitsOnly.padStart(8, '0').slice(-8)}`;
    }
  }
  return `A${String(fallbackId % 100_000_000).padStart(8, '0')}`;
}
