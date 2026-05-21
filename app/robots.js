const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cac.help';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
