/**
 * Host allowlist check for anything loaded into the KYC WebView.
 *
 * Security (PEN073 F-2): the registration flow loads a `verificationUrl` that
 * the backend returns in its response. A MITM who can tamper with that response
 * (no TLS pinning — see F-5) can swap the URL for an attacker page and have it
 * rendered inside the trusted app with camera/mic access. We therefore refuse
 * to load — and refuse to let the WebView navigate the main frame to — any URL
 * whose host isn't on this static allowlist. The allowlist is static on purpose:
 * validating against the *returned* URL's own host would defeat the control.
 */

// Registrable domains we trust inside the KYC WebView. A host matches when it
// equals one of these or is a sub-domain of it (`*.identomat.com`).
//   - identomat.com : Identomat KYC widget (widget/app/api.identomat.com)
//   - supademo.com  : the read-only product demo used by IDENTOMAT_DEMO_URL
export const WEBVIEW_ALLOWED_HOSTS = ['identomat.com', 'supademo.com'] as const;

/**
 * Extract the lowercase hostname from a URL without relying on a full WHATWG
 * `URL` implementation (React Native's is partial across platforms). Returns
 * null when the input isn't an absolute http(s) URL with a host.
 */
export function extractHost(url: string | undefined | null): string | null {
  if (!url) return null;
  // Only http/https are navigable targets we want to allow; reject anything
  // else (javascript:, file:, intent:, data:, custom schemes, …).
  const match = /^https?:\/\/([^/?#]+)/i.exec(url.trim());
  if (!match) return null;
  // Strip userinfo ("user:pass@host") and port, then lowercase.
  const authority = match[1];
  const host = authority.split('@').pop() ?? authority;
  return host.split(':')[0].toLowerCase();
}

function isAllowedHost(host: string | null): boolean {
  if (!host) return false;
  return WEBVIEW_ALLOWED_HOSTS.some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );
}

/**
 * True when `url` is an absolute http(s) URL whose host is on the allowlist.
 */
export function isAllowedWebViewUrl(url: string | undefined | null): boolean {
  return isAllowedHost(extractHost(url));
}
