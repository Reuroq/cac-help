import Link from 'next/link';
import { notFound } from 'next/navigation';
import guides from '@/data/guides.json';

export async function generateStaticParams() {
  return Object.keys(guides).map((os) => ({ os }));
}

export async function generateMetadata({ params }) {
  const g = guides[params.os];
  if (!g) return {};
  return {
    title: g.title,
    description: g.summary,
    alternates: { canonical: `/guides/${g.slug}` },
  };
}

export default function GuidePage({ params }) {
  const g = guides[params.os];
  if (!g) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-mil-600 mb-4">
        <Link href="/guides" className="hover:text-mil-800">Guides</Link>
        <span className="mx-2">/</span>
        <span className="text-mil-800">{g.title}</span>
      </nav>

      <h1 className="text-4xl font-bold text-mil-900 mb-3">{g.title}</h1>
      <p className="text-lg text-mil-700 mb-2">{g.summary}</p>
      <p className="text-sm text-mil-400 mb-8">~{g.estimatedMinutes} min · {g.steps.length} steps</p>

      <div className="bg-gold-400/10 border-l-4 border-gold-400 px-4 py-3 rounded-r mb-8">
        <p className="text-sm text-mil-800">
          <strong>Stuck on a specific error?</strong>{' '}
          <Link href="/" className="underline text-mil-900 font-semibold">Describe it to the AI assistant</Link>{' '}
          for a tailored fix — or check our <Link href="/errors" className="underline text-mil-900 font-semibold">error code reference</Link>.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-mil-900 mb-4">Steps</h2>
      <ol className="space-y-6 mb-10">
        {g.steps.map((s, i) => (
          <li key={i} className="bg-white border border-mil-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-mil-700 text-mil-50 rounded-full flex items-center justify-center font-bold text-sm">
                {i + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-mil-900 mb-2">{s.title}</h3>
                <p className="text-mil-800 leading-relaxed">{s.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {g.commonProblems?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-mil-900 mb-4">Common problems</h2>
          <div className="space-y-3 mb-10">
            {g.commonProblems.map((p, i) => (
              <details key={i} className="bg-white border border-mil-200 rounded-xl p-4 group">
                <summary className="font-semibold text-mil-900 cursor-pointer">{p.problem}</summary>
                <p className="mt-2 text-mil-800 leading-relaxed">{p.fix}</p>
              </details>
            ))}
          </div>
        </>
      )}

      <div className="bg-mil-100 rounded-xl p-6 text-center">
        <p className="text-mil-900 font-semibold mb-2">Still stuck?</p>
        <Link
          href="/"
          className="inline-block bg-mil-700 hover:bg-mil-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Ask the AI assistant
        </Link>
      </div>
    </article>
  );
}
