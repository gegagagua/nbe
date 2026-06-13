import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

const DESCRIPTION =
  "აღსრულების ეროვნული ბიურო — National Bureau of Enforcement. " +
  "გადახდები, საქმეები და მოვალეთა რეესტრი ერთ სივრცეში.";
const TITLE = "აღსრულების ეროვნული ბიურო | National Bureau of Enforcement";

/**
 * Static HTML shell wrapping every web route during `web.output: "static"`
 * export. Sets the SEO/meta baseline so individual routes only override
 * title/description via <SeoHead>.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ka">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#208AEF" />

        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary" />

        <link rel="icon" href="/favicon.png" />

        {/* Prevent body scroll lock-up so RN ScrollViews behave on web. */}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
