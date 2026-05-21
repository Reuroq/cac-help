import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cac.help';

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'CAC.help — AI-powered CAC setup & troubleshooting',
    template: '%s · CAC.help',
  },
  description:
    'Get your Common Access Card (CAC) working in minutes. Describe the problem; an AI assistant walks you through the fix for Windows, Mac, Linux, iPhone, iPad, and Android.',
  keywords: [
    'CAC', 'Common Access Card', 'CAC reader', 'DoD certificates',
    'ActivClient', 'military email', 'OWA', 'webmail',
    'CAC setup', 'CAC troubleshooting',
  ],
  openGraph: {
    title: 'CAC.help — AI-powered CAC setup & troubleshooting',
    description:
      'Describe the problem. Get a step-by-step fix tailored to your OS. Free.',
    url: SITE,
    siteName: 'CAC.help',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'CAC.help' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
