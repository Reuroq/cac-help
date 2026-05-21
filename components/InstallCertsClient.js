'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const TABS = [
  { id: 'windows', label: 'Windows', emoji: '🪟' },
  { id: 'macos', label: 'macOS', emoji: '🍎' },
  { id: 'linux', label: 'Linux', emoji: '🐧' },
  { id: 'ios', label: 'iPhone / iPad', emoji: '📱' },
  { id: 'android', label: 'Android', emoji: '🤖' },
  { id: 'chromeos', label: 'ChromeOS', emoji: '🌐' },
];

function detectOS() {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/cros/.test(ua)) return 'chromeos';
  if (/mac os x|macintosh/.test(ua)) return 'macos';
  if (/linux/.test(ua)) return 'linux';
  return 'windows';
}

function BigDownload({ href, filename, label, sublabel }) {
  return (
    <a
      href={href}
      download={filename}
      className="block bg-mil-700 hover:bg-mil-800 text-white rounded-xl p-5 transition-colors text-center group"
    >
      <div className="flex items-center justify-center gap-3">
        <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <div className="text-left">
          <div className="text-xl font-bold leading-tight">{label}</div>
          <div className="text-sm text-mil-200 mt-0.5">{sublabel}</div>
        </div>
      </div>
    </a>
  );
}

function AdvancedToggle({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 border-t border-mil-200 pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-mil-700 hover:text-mil-900 font-semibold flex items-center gap-1"
      >
        <span>{open ? '▼' : '▶'}</span>
        <span>Advanced: view the raw PowerShell script (audit before running)</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  return (
    <button onClick={copy} className="bg-gold-400 hover:bg-gold-500 text-mil-900 px-2 py-1 rounded text-xs font-semibold">
      {copied ? 'Copied!' : label}
    </button>
  );
}

function ScriptViewer({ text, filename }) {
  return (
    <div className="bg-mil-900 rounded-lg overflow-hidden border border-mil-800">
      <div className="flex items-center justify-between bg-mil-800 px-3 py-2 text-xs">
        <span className="text-mil-200 font-mono">{filename}</span>
        <CopyButton text={text} />
      </div>
      <pre className="text-mil-50 text-xs p-3 overflow-x-auto font-mono leading-relaxed max-h-96">
        <code>{text}</code>
      </pre>
    </div>
  );
}

function WindowsSection() {
  const [psScript, setPsScript] = useState('');
  useEffect(() => {
    fetch('/scripts/install-dod-certs.ps1').then((r) => r.text()).then(setPsScript).catch(() => {});
  }, []);
  return (
    <div>
      <h3 className="text-2xl font-bold text-mil-900 mb-1">Windows — easiest way</h3>
      <p className="text-mil-700 mb-5">Download. Double-click. Done in 30 seconds. No file association dialogs, no PowerShell windows to figure out.</p>

      <BigDownload
        href="/scripts/install-dod-certs.bat"
        filename="install-dod-certs.bat"
        label="Download installer for Windows"
        sublabel="install-dod-certs.bat · ~3 KB · double-click to run"
      />

      <div className="mt-5 bg-amber-50 border-l-4 border-amber-400 px-4 py-3 rounded-r">
        <p className="text-sm text-amber-900">
          <strong>⚠ Expect a SmartScreen warning.</strong> Windows shows{' '}
          <em>"Windows protected your PC"</em> for any file downloaded from the internet that isn't signed by a major publisher.
          That's not specific to our installer — it's how Windows treats all unsigned downloads.
        </p>
        <p className="text-sm text-amber-900 mt-2">
          To proceed: click <strong>More info</strong> → <strong>Run anyway</strong>. The installer then runs as your normal user
          account (no admin/UAC prompt) and only modifies your personal certificate store.
        </p>
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-mil-900 mb-2">What happens when you run it</h4>
        <ol className="list-decimal pl-6 space-y-1 text-mil-800 text-sm">
          <li>A blue console window opens with the CAC.help banner.</li>
          <li>Press any key to begin.</li>
          <li>It downloads the latest DoD cert bundle from <code className="bg-mil-100 px-1 rounded">public.cyber.mil</code>.</li>
          <li>Each certificate is added to <code className="bg-mil-100 px-1 rounded">Cert:\CurrentUser\Root</code> or <code className="bg-mil-100 px-1 rounded">\CA</code>.</li>
          <li>You see green <code className="bg-mil-100 px-1 rounded">+</code> lines for each cert installed. Press any key to close.</li>
          <li>Restart your browser. Insert your CAC. Visit a .mil site.</li>
        </ol>
      </div>

      <AdvancedToggle>
        <p className="text-sm text-mil-700 mb-2">
          This is the raw PowerShell that the <code className="bg-mil-100 px-1 rounded">.bat</code> downloads and runs.
          You can also{' '}
          <a href="/scripts/install-dod-certs.ps1" download className="underline font-semibold">
            download the .ps1 directly
          </a>{' '}
          and run it manually if you prefer.
        </p>
        <ScriptViewer text={psScript || '(loading...)'} filename="install-dod-certs.ps1" />
      </AdvancedToggle>
    </div>
  );
}

function MacOSSection() {
  const [shScript, setShScript] = useState('');
  useEffect(() => {
    fetch('/scripts/install-dod-certs.sh').then((r) => r.text()).then(setShScript).catch(() => {});
  }, []);
  return (
    <div>
      <h3 className="text-2xl font-bold text-mil-900 mb-1">macOS — easiest way</h3>
      <p className="text-mil-700 mb-5">Download. Right-click → Open → Open. (macOS Gatekeeper blocks unsigned downloads on first run.)</p>

      <BigDownload
        href="/scripts/install-dod-certs.command"
        filename="install-dod-certs.command"
        label="Download installer for Mac"
        sublabel="install-dod-certs.command · opens in Terminal"
      />

      <div className="mt-5 bg-amber-50 border-l-4 border-amber-400 px-4 py-3 rounded-r">
        <p className="text-sm text-amber-900">
          <strong>⚠ On first run, macOS blocks unsigned downloads.</strong> You'll see <em>"cannot be opened because Apple cannot check it for malicious software."</em>
        </p>
        <p className="text-sm text-amber-900 mt-2">
          To bypass: in Finder, <strong>right-click</strong> (or Control-click) the file → <strong>Open</strong> → <strong>Open</strong> again on the warning dialog. After this one-time approval, Terminal opens, you press Enter, and it runs.
        </p>
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-mil-900 mb-2">Don't trust .command files? Run it manually instead</h4>
        <p className="text-sm text-mil-800 mb-2">Open Terminal (⌘+Space → "Terminal") and paste:</p>
        <div className="bg-mil-900 rounded-lg p-3 font-mono text-sm text-mil-50 overflow-x-auto">
          curl -fsSL https://cac-help.onrender.com/scripts/install-dod-certs.sh | bash
        </div>
        <p className="text-xs text-mil-600 mt-2">macOS will prompt for your account password (not your CAC PIN) to write certs to your login keychain.</p>
      </div>

      <AdvancedToggle>
        <p className="text-sm text-mil-700 mb-2">
          Raw script that <code className="bg-mil-100 px-1 rounded">.command</code> / <code className="bg-mil-100 px-1 rounded">curl | bash</code> runs.{' '}
          <a href="/scripts/install-dod-certs.sh" download className="underline font-semibold">Download .sh directly</a>.
        </p>
        <ScriptViewer text={shScript || '(loading...)'} filename="install-dod-certs.sh" />
      </AdvancedToggle>
    </div>
  );
}

function LinuxSection() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-mil-900 mb-1">Linux</h3>
      <p className="text-mil-700 mb-5">One-line install via terminal.</p>

      <div className="bg-mil-900 rounded-lg p-4 font-mono text-sm text-mil-50 overflow-x-auto">
        curl -fsSL https://cac-help.onrender.com/scripts/install-dod-certs.sh | bash
      </div>

      <div className="mt-4 bg-mil-100 rounded-lg p-4">
        <p className="text-sm font-semibold text-mil-900 mb-2">Prerequisites (one-time):</p>
        <ul className="text-sm text-mil-800 space-y-1 font-mono">
          <li>Ubuntu/Debian: <code>sudo apt install pcscd opensc libnss3-tools openssl unzip</code></li>
          <li>Fedora: <code>sudo dnf install pcsc-lite opensc nss-tools openssl unzip</code></li>
          <li>Arch: <code>sudo pacman -S pcsclite opensc nss openssl unzip</code></li>
        </ul>
      </div>

      <p className="text-sm text-mil-700 mt-4">
        Installs certs into your NSS database (<code className="bg-mil-100 px-1 rounded">~/.pki/nssdb</code>) — used by Chrome, Edge, and other NSS-aware tools.
        Firefox uses its own per-profile NSS store; the script prints manual import instructions for it.
      </p>

      <p className="text-sm text-mil-600 mt-3">
        Don't pipe to bash? <a href="/scripts/install-dod-certs.sh" download className="underline font-semibold">Download install-dod-certs.sh</a>, audit, then run with <code className="bg-mil-100 px-1 rounded">bash install-dod-certs.sh</code>.
      </p>
    </div>
  );
}

function IOSSection() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-mil-900 mb-1">iPhone / iPad</h3>
      <p className="text-mil-700 mb-5">
        iOS doesn't allow apps or websites to install certificates directly — that's a hard sandbox boundary.
        Instead, you install a <strong>Configuration Profile</strong> through Safari + Settings.
      </p>

      <ol className="list-decimal pl-6 space-y-3 text-mil-800">
        <li>Open <strong>Safari</strong> on your iPhone/iPad and go to{' '}
          <a href="https://public.cyber.mil/pki-pke/admins/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">public.cyber.mil/pki-pke/admins/</a>
        </li>
        <li>Find and tap the <strong>DoD Mobile Configuration Profile</strong> (.mobileconfig file). Safari prompts: "This website is trying to download a configuration profile. Do you want to allow this?" → tap <strong>Allow</strong>.</li>
        <li>Open <strong>Settings → General → VPN & Device Management</strong> → tap the downloaded profile → <strong>Install</strong> (top right). Enter your device passcode.</li>
        <li>
          <strong className="text-red-700">Critical step most people miss:</strong> Settings → General → About → <strong>Certificate Trust Settings</strong> → toggle <strong>ON</strong> for each DoD Root CA. Without this, iOS won't trust the certs for SSL.
        </li>
        <li>Force-quit Safari (swipe up, swipe Safari off-screen) and reopen.</li>
      </ol>

      <p className="text-sm text-mil-700 mt-4">
        Step-by-step with what to tap next at: <Link href="/guides/ios" className="underline font-semibold">our iOS guide</Link>.
      </p>
    </div>
  );
}

function AndroidSection() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-mil-900 mb-1">Android</h3>
      <p className="text-mil-700 mb-5">
        Android's system cert store is locked down for security. For CAC use, you import certs <strong>into a CAC-aware app</strong>, not the OS.
      </p>

      <ol className="list-decimal pl-6 space-y-3 text-mil-800">
        <li>Install <strong>Sub Rosa</strong> from the Google Play Store (free).</li>
        <li>From your device browser, download <a href="https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip" target="_blank" rel="noopener noreferrer" className="underline font-semibold">the DoD bundle (.zip)</a>.</li>
        <li>Open Sub Rosa → <strong>Settings → Certificates → Import</strong> → select the bundle.</li>
        <li>Use Sub Rosa (not stock Chrome) as your CAC-aware browser.</li>
      </ol>

      <p className="text-sm text-amber-900 mt-4 bg-amber-50 border-l-4 border-amber-400 px-3 py-2 rounded-r">
        <strong>Stock Chrome on Android does NOT support CAC card readers reliably.</strong> Use Sub Rosa or TF Maverick.
      </p>

      <p className="text-sm text-mil-700 mt-4">
        Full Android setup at: <Link href="/guides/android" className="underline font-semibold">our Android guide</Link>.
      </p>
    </div>
  );
}

function ChromeOSSection() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-mil-900 mb-1">ChromeOS</h3>
      <p className="text-mil-700 mb-5">ChromeOS supports CAC via two Chrome extensions plus manual cert import.</p>

      <ol className="list-decimal pl-6 space-y-3 text-mil-800">
        <li>From the Chrome Web Store, install <strong>Smart Card Connector</strong> (by Google).</li>
        <li>Also install <strong>CACKey</strong> (or <strong>OpenSC</strong> — either works).</li>
        <li>Download <a href="https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip" target="_blank" rel="noopener noreferrer" className="underline font-semibold">the DoD bundle (.zip)</a>.</li>
        <li>Open the .zip in the Files app and extract each <code className="bg-mil-100 px-1 rounded">.cer</code>.</li>
        <li>Open <code className="bg-mil-100 px-1 rounded">chrome://settings/certificates</code> → <strong>Authorities</strong> → <strong>Import</strong> → select each cert → tick <em>"Trust this certificate for identifying websites"</em>.</li>
      </ol>

      <p className="text-sm text-amber-900 mt-4 bg-amber-50 border-l-4 border-amber-400 px-3 py-2 rounded-r">
        <strong>School/work Chromebook?</strong> If managed by an organization, the admin may block smart card extensions. Contact your IT admin.
      </p>
    </div>
  );
}

export default function InstallCertsClient() {
  const [os, setOs] = useState('windows');
  useEffect(() => { setOs(detectOS()); }, []);

  const SECTIONS = {
    windows: <WindowsSection />,
    macos: <MacOSSection />,
    linux: <LinuxSection />,
    ios: <IOSSection />,
    android: <AndroidSection />,
    chromeos: <ChromeOSSection />,
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setOs(t.id)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              os === t.id
                ? 'bg-mil-700 text-mil-50'
                : 'bg-white text-mil-700 border border-mil-200 hover:bg-mil-100'
            }`}
          >
            <span className="mr-1">{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white border border-mil-200 rounded-xl p-6">
        {SECTIONS[os]}
      </div>
    </div>
  );
}
