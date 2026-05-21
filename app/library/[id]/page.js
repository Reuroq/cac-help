import Link from 'next/link';
import { notFound } from 'next/navigation';
import issues from '@/data/issues.json';

export async function generateStaticParams() {
  return issues.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }) {
  const i = issues.find((x) => x.id === params.id);
  if (!i) return {};
  return {
    title: i.title,
    description: (i.symptoms || i.title).slice(0, 160),
    alternates: { canonical: `/library/${i.id}` },
  };
}

export default function IssuePage({ params }) {
  const issue = issues.find((x) => x.id === params.id);
  if (!issue) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-mil-600 mb-4">
        <Link href="/library" className="hover:text-mil-800">Library</Link>
        <span className="mx-2">/</span>
        <span className="text-mil-800 capitalize">{issue.category}</span>
      </nav>

      <h1 className="text-3xl font-bold text-mil-900 mb-3">{issue.title}</h1>
      <div className="flex flex-wrap gap-1 mb-6">
        {(issue.platforms || []).map((p) => (
          <span key={p} className="text-xs uppercase bg-mil-100 text-mil-700 px-2 py-0.5 rounded">{p}</span>
        ))}
        {(issue.related_error_codes || []).map((c) => (
          <Link
            key={c}
            href={`/errors/${c}`}
            className="text-xs font-mono bg-mil-700 text-mil-50 hover:bg-mil-800 px-2 py-0.5 rounded"
          >
            Error {c}
          </Link>
        ))}
      </div>

      {issue.symptoms && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-mil-800 mb-2">Symptoms</h2>
          <p className="text-mil-800 leading-relaxed">{issue.symptoms}</p>
        </section>
      )}

      {issue.causes && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-mil-800 mb-2">Likely cause</h2>
          <p className="text-mil-800 leading-relaxed">{issue.causes}</p>
        </section>
      )}

      {issue.fix && (
        <section className="mb-8 bg-mil-700 text-mil-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gold-400 mb-3">Fix</h2>
          <div className="whitespace-pre-wrap leading-relaxed">{issue.fix}</div>
        </section>
      )}

      {issue.source_url && (
        <p className="text-xs text-mil-500 mb-6">
          Sourced from{' '}
          <a href={issue.source_url} target="_blank" rel="noopener noreferrer" className="underline">
            {new URL(issue.source_url).hostname}
          </a>
          . Rewritten for clarity.
        </p>
      )}

      <div className="bg-mil-100 rounded-xl p-6 text-center">
        <p className="text-mil-900 font-semibold mb-2">Didn't work, or need it tailored to your setup?</p>
        <Link
          href={`/?prompt=${encodeURIComponent(issue.title + '. ' + (issue.symptoms || ''))}`}
          className="inline-block bg-mil-700 hover:bg-mil-800 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Ask the AI assistant
        </Link>
      </div>
    </article>
  );
}
