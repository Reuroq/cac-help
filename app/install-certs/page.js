import Link from 'next/link';
import InstallCertsClient from '@/components/InstallCertsClient';

export const metadata = {
  title: 'One-click DoD certificate installer',
  description: 'Install DoD certificates on Windows, Mac, or Linux without downloading InstallRoot.exe. Open-source script you can audit.',
};

export default function InstallCertsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-mil-900 mb-2">Install DoD Certificates</h1>
      <p className="text-mil-700 mb-6 text-lg">
        Pulls the latest DoD root and intermediate CAs from cyber.mil and installs them into your user
        certificate store. No download of InstallRoot.exe required.
      </p>

      <div className="bg-gold-400/10 border-l-4 border-gold-400 px-4 py-3 rounded-r mb-8">
        <p className="text-sm text-mil-800">
          <strong>Why not just use InstallRoot?</strong> You absolutely can —{' '}
          <a href="https://public.cyber.mil/pki-pke/tools-configuration-files/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">download it from cyber.mil</a>.
          But it's a 60+ MB installer that requires admin rights on Windows. Our script is ~50 lines, runs as your user,
          and you can read every line before you run it.
        </p>
      </div>

      <InstallCertsClient />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-mil-900 mb-3">What gets installed</h2>
        <ul className="space-y-2 text-mil-800 list-disc pl-6">
          <li><strong>DoD Root CA 3, 4, 5, 6</strong> — the trust anchors for everything .mil</li>
          <li><strong>DoD Intermediate CAs</strong> (DOD ID CA, DOD EMAIL CA, DOD SW CA, etc.) — the certs that chain CAC identity certs to a root</li>
          <li>(Optional) <strong>External Certification Authority (ECA)</strong> roots — only if your agency uses ECA-issued CACs/PIVs</li>
        </ul>
        <p className="text-mil-700 mt-3">
          These are installed into your <strong>user</strong> certificate store (<code className="bg-mil-100 px-1 rounded">Cert:\CurrentUser\Root</code> on Windows, login keychain on macOS, NSS database on Linux).
          No admin/sudo required for the recommended user-only install path.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-mil-900 mb-3">After install</h2>
        <ol className="list-decimal pl-6 space-y-2 text-mil-800">
          <li>Restart your browser (all windows).</li>
          <li>Insert your CAC and visit a .mil site — pick the right certificate when prompted (IDENTITY for general sign-on, EMAIL for webmail, SIGNATURE for PDF signing).</li>
          <li>If a site still says "certificate required," check your <Link href="/guides/windows" className="underline">OS-specific guide</Link> — there may be one more browser-level step.</li>
        </ol>
      </section>

      <section className="mt-10 bg-mil-100 rounded-xl p-6">
        <h2 className="text-xl font-bold text-mil-900 mb-3">Trust but verify</h2>
        <p className="text-mil-800 mb-3">
          Every script we generate is <strong>auditable</strong>. The full source lives in our public GitHub repo —{' '}
          <a href="https://github.com/Reuroq/cac-help/tree/main/public/scripts" target="_blank" rel="noopener noreferrer" className="underline font-semibold">read it before you run it</a>.
        </p>
        <p className="text-mil-800 text-sm">
          The script downloads the certificate bundle directly from <code className="bg-white px-1 rounded">public.cyber.mil</code> at runtime —
          we don't host or modify DoD certificates. If you're paranoid (and you should be), open the script in a text editor first,
          confirm the cyber.mil URL, and only then execute.
        </p>
      </section>
    </div>
  );
}
