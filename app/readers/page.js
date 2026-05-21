import Link from 'next/link';

export const metadata = {
  title: 'Recommended CAC Readers',
  description: 'CAC readers known to work with Windows, macOS, Linux, iPhone, iPad, and Android — what to buy and what to avoid.',
};

const READERS = [
  {
    name: 'SCR3310 v2.0',
    maker: 'Identiv',
    price: '$15-25',
    notes: 'The classic "just works" USB reader. Driverless on Windows, macOS, and Linux. Best first pick for desktop / laptop.',
    platforms: ['Windows', 'macOS', 'Linux'],
  },
  {
    name: 'SCR3500 C',
    maker: 'Identiv',
    price: '$20-30',
    notes: 'USB-C variant of the SCR3500. Works with modern Macs, iPad Pro, and newer Android phones via OTG.',
    platforms: ['Windows', 'macOS', 'Linux', 'Android', 'iPad'],
  },
  {
    name: 'SCR3500 A',
    maker: 'Identiv',
    price: '$15-25',
    notes: 'USB-A version. Works with USB-A → USB-C adapter on newer devices. Mac/Linux friendly.',
    platforms: ['Windows', 'macOS', 'Linux', 'Android'],
  },
  {
    name: 'PKard Reader',
    maker: 'Thursby Software',
    price: '$40-60',
    notes: 'Lightning-connector reader specifically for iPhone / iPad. Includes Thursby middleware app. Premium price but works reliably on iOS.',
    platforms: ['iOS'],
  },
  {
    name: 'CAC Reader Smart Card Reader',
    maker: 'Saicoo / DOD reader (Amazon)',
    price: '$10-15',
    notes: 'Cheap generic readers. Hit-or-miss quality. If you get one that works, great. Avoid for mission-critical use.',
    platforms: ['Windows', 'macOS', 'Linux'],
  },
  {
    name: 'OmniKey 3021',
    maker: 'HID Global',
    price: '$25-40',
    notes: 'Enterprise-grade. Often issued at duty stations. Solid on Windows, fine on Linux, decent on Mac.',
    platforms: ['Windows', 'macOS', 'Linux'],
  },
];

export default function ReadersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-mil-900 mb-2">Recommended CAC Readers</h1>
      <p className="text-mil-700 mb-8 text-lg">
        Any reader that's CCID-compliant and supports T=0 / T=1 protocols will work with a CAC.
        Here's what we've seen work consistently — and what to skip.
      </p>

      <div className="bg-gold-400/10 border-l-4 border-gold-400 px-4 py-3 rounded-r mb-8">
        <p className="text-sm text-mil-800">
          <strong>Heads up:</strong> CAC.help has no affiliate relationships. These are independent recommendations based on community reports. Prices are approximate retail.
        </p>
      </div>

      <div className="space-y-4">
        {READERS.map((r) => (
          <div key={r.name} className="bg-white border border-mil-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-mil-900">{r.name}</h2>
                <p className="text-sm text-mil-600">{r.maker} · {r.price}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {r.platforms.map((p) => (
                  <span key={p} className="text-xs bg-mil-100 text-mil-700 px-2 py-1 rounded">{p}</span>
                ))}
              </div>
            </div>
            <p className="text-mil-800 mt-3 leading-relaxed">{r.notes}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-mil-100 rounded-xl p-6">
        <h2 className="text-xl font-bold text-mil-900 mb-3">What to look for</h2>
        <ul className="space-y-2 text-mil-800">
          <li>✅ <strong>CCID-compliant</strong> — basically all modern readers</li>
          <li>✅ <strong>T=0 and T=1 protocol</strong> — CACs use both</li>
          <li>✅ <strong>Smart Card Alliance / GSA approved</strong> — extra confidence</li>
          <li>❌ Skip readers that require proprietary drivers — they'll break on Mac/Linux</li>
          <li>❌ Skip Bluetooth readers — unreliable and battery-dependent</li>
        </ul>
      </div>
    </div>
  );
}
