function messageFromErrorItem(item: unknown): string | undefined {
  if (typeof item === 'string' && item.trim()) {
    return item.trim();
  }
  if (typeof item !== 'object' || item === null) {
    return undefined;
  }
  const o = item as Record<string, unknown>;
  if (typeof o.defaultMessage === 'string' && o.defaultMessage.trim()) {
    return o.defaultMessage.trim();
  }
  if (typeof o.message === 'string' && o.message.trim()) {
    return o.message.trim();
  }
  return undefined;
}

export function extractApiErrorMessage(data: unknown): string | undefined {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }
  if (typeof data !== 'object' || data === null) {
    return undefined;
  }
  const o = data as Record<string, unknown>;
  if (typeof o.message === 'string' && o.message.trim()) {
    return o.message.trim();
  }
  if (typeof o.error === 'string' && o.error.trim()) {
    return o.error.trim();
  }
  const errs = o.errors;
  if (!Array.isArray(errs) || errs.length === 0) {
    return undefined;
  }
  const parts = errs
    .slice(0, 8)
    .map((item) => messageFromErrorItem(item))
    .filter((s): s is string => Boolean(s));
  if (parts.length === 0) {
    return undefined;
  }
  return parts.join('; ');
}
