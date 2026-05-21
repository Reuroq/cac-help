import Link from 'next/link';
import { notFound } from 'next/navigation';
import errors from '@/data/errors.json';

export async function generateStaticParams() {
  return errors.map((e) => ({ code: e.code }));
}

export async function generateMetadata({ params }) {
  const e = errors.find((x) => x.code === params.code);
  if (!e) return {};
  return {
    title: `Error ${e.code}: ${e.title}`,
    description: `${e.summary} — Fix in plain English.`,
    alternates: { canonical: `/errors/${e.code}` },
  };
}

export default function ErrorPage({ params }) {
  const e = errors.find((x) => x.code === params.code);
  if (!e) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-mil-600 mb-4">
        <Link href="/errors" className="hover:text-mil-800">Error codes</Link>
        <span className="mx-2">/</span>
        <span className="text-mil-800 font-mono">Error {e.code}</span>
      </nav>

      <div className="bg-white border-2 border-mil-200 rounded-xl p-6 mb-6">
        <div className="font-mono text-sm text-mil-600 mb-1">CAC Error Code</div>
        <h1 className="text-4xl font-bold text-mil-900 mb-3">{e.code}</h1>
        <h2 className="text-xl font-semibold text-mil-800 mb-3">{e.title}</h2>
        <p className="text-mil-700 italic">"{e.summary}"</p>
      </div>

      <div className="bg-mil-700 text-mil-50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-3 text-gold-400">How to fix it</h2>
        <p className="leading-relaxed">{e.fix}</p>
      </div>

      <div className="bg-mil-100 rounded-xl p-6 text-center">
        <p className="text-mil-900 font-semibold mb-2">Didn't work, or need more detail?</p>
        <Link
          href={`/?prompt=${encodeURIComponent(`I'm getting Error ${e.code}: ${e.title}. What I tried didn't work.`)}`}
          className="inline-block bg-mil-700 hover:bg-mil-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Ask the AI assistant
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-mil-900 mb-3">Related errors</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {errors.filter((x) => x.code !== e.code).slice(0, 6).map((x) => (
            <Link
              key={x.code}
              href={`/errors/${x.code}`}
              className="block bg-white border border-mil-200 hover:border-mil-600 rounded-lg p-3 text-sm transition-colors"
            >
              <div className="font-mono text-xs text-mil-600">Error {x.code}</div>
              <div className="font-semibold text-mil-900">{x.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
