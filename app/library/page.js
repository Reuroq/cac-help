import Link from 'next/link';
import issues from '@/data/issues.json';
import LibrarySearch from '@/components/LibrarySearch';

export const metadata = {
  title: 'CAC Issue Library',
  description: 'Browse 100+ documented CAC issues and fixes, sourced from a decade of community troubleshooting.',
};

export default function LibraryPage() {
  const byCategory = {};
  for (const i of issues) {
    (byCategory[i.category] ||= []).push(i);
  }
  const categories = Object.keys(byCategory).sort();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-mil-900 mb-2">CAC Issue Library</h1>
      <p className="text-mil-700 mb-6 text-lg">
        {issues.length} documented CAC issues with fixes — sourced from a decade of community troubleshooting and rewritten for clarity.
      </p>

      <div className="bg-gold-400/10 border-l-4 border-gold-400 px-4 py-3 rounded-r mb-8">
        <p className="text-sm text-mil-800">
          <strong>Can't find it?</strong>{' '}
          <Link href="/" className="underline text-mil-900 font-semibold">Describe it to the AI assistant</Link>{' '}
          — it has access to this full library and will tailor a fix to your setup.
        </p>
      </div>

      <LibrarySearch issues={issues} />

      <div className="mt-12 space-y-10">
        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="text-2xl font-bold text-mil-900 mb-1 capitalize">{cat}</h2>
            <p className="text-sm text-mil-600 mb-4">{byCategory[cat].length} entries</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {byCategory[cat].slice(0, 12).map((i) => (
                <Link
                  key={i.id}
                  href={`/library/${i.id}`}
                  className="block bg-white border border-mil-200 hover:border-mil-600 rounded-lg p-4 transition-colors"
                >
                  <div className="font-semibold text-mil-900">{i.title}</div>
                  {i.symptoms && <p className="text-xs text-mil-600 mt-1 line-clamp-2">{i.symptoms}</p>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(i.platforms || []).map((p) => (
                      <span key={p} className="text-[10px] uppercase bg-mil-100 text-mil-700 px-1.5 py-0.5 rounded">{p}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
            {byCategory[cat].length > 12 && (
              <p className="text-sm text-mil-600 mt-3">
                + {byCategory[cat].length - 12} more — use search above to find specific issues.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
