import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-mil-900 text-mil-200 border-t border-mil-800 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-bold text-mil-50 mb-2">CAC.help</h3>
            <p className="text-xs text-mil-400">
              AI-powered CAC setup and troubleshooting. Free and independent.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-mil-50 mb-2">Guides</h3>
            <ul className="space-y-1">
              <li><Link href="/guides/windows" className="hover:text-gold-400">Windows</Link></li>
              <li><Link href="/guides/macos" className="hover:text-gold-400">macOS</Link></li>
              <li><Link href="/guides/linux" className="hover:text-gold-400">Linux</Link></li>
              <li><Link href="/guides/ios" className="hover:text-gold-400">iPhone / iPad</Link></li>
              <li><Link href="/guides/android" className="hover:text-gold-400">Android</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-mil-50 mb-2">Reference</h3>
            <ul className="space-y-1">
              <li><Link href="/install-certs" className="hover:text-gold-400">Install DoD certs</Link></li>
              <li><Link href="/library" className="hover:text-gold-400">Issue library</Link></li>
              <li><Link href="/errors" className="hover:text-gold-400">Error codes</Link></li>
              <li><Link href="/readers" className="hover:text-gold-400">CAC readers</Link></li>
              <li><Link href="/help-desks" className="hover:text-gold-400">Help desks</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-mil-50 mb-2">Legal</h3>
            <ul className="space-y-1">
              <li><Link href="/about" className="hover:text-gold-400">About</Link></li>
              <li><Link href="/disclaimer" className="hover:text-gold-400">Disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-gold-400">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-gold-400">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-mil-800 text-xs text-mil-400">
          <p className="mb-2">
            <strong className="text-mil-300">Not affiliated with the U.S. Department of Defense, any branch of the military, or any federal agency.</strong> CAC.help is an independent community resource provided as-is, without warranty. Follow your organization's official IT policies.
          </p>
          <p>© {new Date().getFullYear()} CAC.help. CAC, Common Access Card, and DoD are trademarks of their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
