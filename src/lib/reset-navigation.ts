import { router } from "expo-router";
import type { Href } from "expo-router";

/**
 * Replace the current route AND drop every screen stacked below it, so auth and
 * logged-in history can never cross. Without this, `router.replace` only swaps
 * the top screen — e.g. after a registered user logs out and enters as a guest,
 * pressing back would reveal the previous (still-stacked) registered session.
 *
 * Use on every auth boundary transition: login, logout, and guest entry.
 */
export function resetStackTo(href: Href): void {
  // dismissAll pops the stack to its first screen; replace then swaps that out,
  // leaving only the destination in history.
  if (router.canGoBack()) {
    router.dismissAll();
  }
  router.replace(href);
}
