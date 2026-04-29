let guestMode = false;

export function setGuestMode(value: boolean): void {
  guestMode = value;
}

export function isGuestMode(): boolean {
  return guestMode;
}
