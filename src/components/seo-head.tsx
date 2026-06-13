import Head from "expo-router/head";

type SeoHeadProps = {
  title: string;
  description?: string;
};

/**
 * Per-route document head for the web build. On native it is a no-op-ish
 * Handoff hook, so it is safe to render on every platform.
 */
export function SeoHead({ title, description }: SeoHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {description ? (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
        </>
      ) : null}
    </Head>
  );
}
