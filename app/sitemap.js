import errors from '@/data/errors.json';
import guides from '@/data/guides.json';
import issues from '@/data/issues.json';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cac.help';

export default function sitemap() {
  const now = new Date();
  const staticPaths = ['/', '/install-certs', '/guides', '/errors', '/library', '/readers', '/help-desks', '/about', '/disclaimer', '/privacy', '/terms'];
  const guidePaths = Object.keys(guides).map((slug) => `/guides/${slug}`);
  const errorPaths = errors.map((e) => `/errors/${e.code}`);
  const issuePaths = issues.map((i) => `/library/${i.id}`);
  return [...staticPaths, ...guidePaths, ...errorPaths, ...issuePaths].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: p === '/' ? 'weekly' : 'monthly',
    priority:
      p === '/' ? 1.0
      : p.startsWith('/guides/') ? 0.8
      : p.startsWith('/errors/') || p.startsWith('/library/') ? 0.6
      : 0.5,
  }));
}
