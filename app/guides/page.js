import Link from 'next/link';
import guides from '@/data/guides.json';

export const metadata = {
  title: 'CAC Setup Guides — Windows, Mac, Linux, iOS, Android',
  description: 'Step-by-step guides to set up your Common Access Card on every major operating system.',
};

export default function GuidesIndex() {
  const list = Object.values(guides);
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-mil-900 mb-2">CAC Setup Guides</h1>
      <p className="text-mil-700 mb-8 text-lg">
        Pick your operating system. Each guide is a focused walkthrough — usually 10-20 minutes start to finish.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="block bg-white border border-mil-200 hover:border-mil-600 rounded-xl p-5 transition-colors group"
          >
            <h2 className="text-xl font-bold text-mil-900 group-hover:text-mil-700 mb-1">{g.title}</h2>
            <p className="text-sm text-mil-700 mb-2">{g.summary}</p>
            <p className="text-xs text-mil-400">~{g.estimatedMinutes} min · {g.steps.length} steps</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
