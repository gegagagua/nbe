export function epsUserHeaders(userId: number | string): Record<string, string> {
  return { 'X-User-ID': String(userId) };
}
