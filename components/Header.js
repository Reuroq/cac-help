import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-mil-900 text-mil-50 border-b border-mil-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-gold-400 text-mil-900 rounded font-bold text-sm">
            CAC
          </span>
          <span className="font-bold text-lg group-hover:text-gold-400 transition-colors">
            .help
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4 text-sm">
          <Link href="/install-certs" className="px-2 sm:px-3 py-2 hover:text-gold-400 transition-colors">Install Certs</Link>
          <Link href="/guides" className="px-2 sm:px-3 py-2 hover:text-gold-400 transition-colors">Guides</Link>
          <Link href="/errors" className="px-2 sm:px-3 py-2 hover:text-gold-400 transition-colors">Errors</Link>
          <Link href="/readers" className="px-2 sm:px-3 py-2 hover:text-gold-400 transition-colors hidden sm:inline">Readers</Link>
          <Link href="/about" className="px-2 sm:px-3 py-2 hover:text-gold-400 transition-colors hidden sm:inline">About</Link>
        </nav>
      </div>
    </header>
  );
}
