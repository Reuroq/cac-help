import Chat from '@/components/Chat';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-mil-100 to-mil-50">
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-mil-900">
            Your CAC, working in minutes.
          </h1>
          <p className="text-mil-700 mt-1">Free. Independent. AI-guided.</p>
        </div>
      </section>

      <section className="bg-mil-50">
        <div className="max-w-4xl mx-auto px-4 min-h-[60vh] flex flex-col">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-mil-200 overflow-hidden my-4 flex flex-col" style={{ minHeight: '500px' }}>
            <Chat />
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-mil-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-mil-900 mb-2 text-center">Or browse by operating system</h2>
          <p className="text-mil-700 text-center mb-8">Step-by-step guides if you'd rather read than chat.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              ['windows', 'Windows', '🪟'],
              ['macos', 'macOS', '🍎'],
              ['linux', 'Linux', '🐧'],
              ['ios', 'iPhone / iPad', '📱'],
              ['android', 'Android', '🤖'],
              ['chromeos', 'ChromeOS', '🌐'],
            ].map(([slug, label, emoji]) => (
              <Link
                key={slug}
                href={`/guides/${slug}`}
                className="bg-mil-50 hover:bg-mil-100 border border-mil-200 rounded-xl p-4 text-center transition-colors group"
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-semibold text-mil-900 group-hover:text-mil-700">{label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mil-900 text-mil-50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Stuck on an error code?</h2>
          <p className="text-center text-mil-200 mb-6">
            We have plain-English fixes for the most common CAC error codes.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['38', '53', '107', '117', '403.7', '500', '1719', '1722', '2738', '4012', '5011', '2148073485'].map((code) => (
              <Link
                key={code}
                href={`/errors/${code}`}
                className="bg-mil-800 hover:bg-mil-700 border border-mil-700 text-mil-50 px-3 py-1.5 rounded-lg text-sm font-mono transition-colors"
              >
                Error {code}
              </Link>
            ))}
            <Link
              href="/errors"
              className="bg-gold-400 hover:bg-gold-500 text-mil-900 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            >
              See all →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-mil-50">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold text-mil-900 mb-3">Why CAC.help?</h2>
          <p className="text-mil-700 leading-relaxed">
            The classic militarycac.com is a treasured community resource — but it was built before AI, and it shows.
            We took the collective wisdom of a decade of military IT troubleshooting and put a modern,
            conversational front door on it. Describe your problem in plain English; get a tailored fix.
            No accounts, no ads, no tracking beyond basic analytics.
          </p>
        </div>
      </section>
    </div>
  );
}
