import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-mil-700 mb-4">404</h1>
      <p className="text-mil-700 text-lg mb-6">Page not found.</p>
      <Link href="/" className="inline-block bg-mil-700 hover:bg-mil-800 text-white px-6 py-2 rounded-lg font-semibold">
        Back to home
      </Link>
    </div>
  );
}
