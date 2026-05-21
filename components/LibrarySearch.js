'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function LibrarySearch({ issues }) {
  const [q, setQ] = useState('');
  const [platform, setPlatform] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim() && !platform) return [];
    const needle = q.trim().toLowerCase();
    return issues.filter((i) => {
      if (platform && !(i.platforms || []).includes(platform)) return false;
      if (!needle) return true;
      const hay = [
        i.title,
        i.symptoms,
        i.causes,
        i.fix,
        (i.related_error_codes || []).join(' '),
        (i.keywords || []).join(' '),
        i.category,
      ].join(' ').toLowerCase();
      return hay.includes(needle);
    }).slice(0, 25);
  }, [q, platform, issues]);

  return (
    <div className="bg-white border border-mil-200 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: 'webmail', 'error 117', 'Adobe sign', 'reader not detected'..."
          className="flex-1 px-3 py-2 rounded-lg border-2 border-mil-200 focus:border-mil-600 outline-none text-mil-900 placeholder-mil-400"
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="px-3 py-2 rounded-lg border-2 border-mil-200 focus:border-mil-600 outline-none text-mil-900 bg-white"
        >
          <option value="">All platforms</option>
          <option value="windows">Windows</option>
          <option value="macos">macOS</option>
          <option value="linux">Linux</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
          <option value="chromeos">ChromeOS</option>
        </select>
      </div>
      {(q.trim() || platform) && (
        <div className="mt-4">
          {filtered.length === 0 ? (
            <p className="text-mil-600 text-sm">
              No matches.{' '}
              <Link href={`/?prompt=${encodeURIComponent(q)}`} className="underline font-semibold">
                Ask the AI assistant instead →
              </Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/library/${i.id}`}
                    className="block bg-mil-50 hover:bg-mil-100 border border-mil-200 rounded-lg p-3 transition-colors"
                  >
                    <div className="font-semibold text-mil-900">{i.title}</div>
                    {i.symptoms && <p className="text-xs text-mil-600 mt-0.5 line-clamp-1">{i.symptoms}</p>}
                  </Link>
                </li>
              ))}
              <li className="text-xs text-mil-500 pt-1">
                Showing {filtered.length} {filtered.length === 25 ? 'of many' : 'results'}.
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
