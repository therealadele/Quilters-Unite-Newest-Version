import { Helmet } from "react-helmet-async";

const SITE_NAME = "Quilters Unite";
const DEFAULT_DESCRIPTION = "Discover patterns, share projects, and connect with quilters worldwide. Quilters Unite is your home for all things quilting.";
const SITE_URL = "https://quiltersunite.com";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  article?: {
    author?: string;
    publishedTime?: string;
    section?: string;
  };
  noindex?: boolean;
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  type = "website",
  article,
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Your Quilting Community`;
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.section && <meta property="article:section" content={article.section} />}
    </Helmet>
  );
}

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
