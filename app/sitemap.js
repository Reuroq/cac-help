import errors from '@/data/errors.json';
import guides from '@/data/guides.json';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cac.help';

export default function sitemap() {
  const now = new Date();
  const staticPaths = ['/', '/install-certs', '/guides', '/errors', '/readers', '/help-desks', '/about', '/disclaimer', '/privacy', '/terms'];
  const guidePaths = Object.keys(guides).map((slug) => `/guides/${slug}`);
  const errorPaths = errors.map((e) => `/errors/${e.code}`);
  return [...staticPaths, ...guidePaths, ...errorPaths].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1.0 : p.startsWith('/guides/') || p.startsWith('/errors/') ? 0.7 : 0.5,
  }));
}
