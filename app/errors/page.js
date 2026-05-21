import Link from 'next/link';
import errors from '@/data/errors.json';

export const metadata = {
  title: 'CAC Error Code Reference',
  description: 'Plain-English fixes for every common CAC error code — 38, 53, 107, 117, 403.7, 500, 1719, and more.',
};

export default function ErrorsIndex() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-mil-900 mb-2">CAC Error Code Reference</h1>
      <p className="text-mil-700 mb-8 text-lg">
        {errors.length} common CAC errors with plain-English fixes. Click any code for details.
      </p>
      <div className="bg-gold-400/10 border-l-4 border-gold-400 px-4 py-3 rounded-r mb-8">
        <p className="text-sm text-mil-800">
          <strong>Don't see your error?</strong>{' '}
          <Link href="/" className="underline text-mil-900 font-semibold">Describe it to the AI assistant</Link>{' '}
          — it knows hundreds of variants.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {errors.map((e) => (
          <Link
            key={e.code}
            href={`/errors/${e.code}`}
            className="block bg-white border border-mil-200 hover:border-mil-600 rounded-lg p-4 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-mil-600 group-hover:text-mil-700">Error {e.code}</div>
                <div className="font-semibold text-mil-900 group-hover:text-mil-700">{e.title}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
