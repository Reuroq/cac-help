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

function CopyBlock({ code, filename, downloadHref }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  return (
    <div className="bg-mil-900 rounded-lg overflow-hidden border border-mil-800">
      <div className="flex items-center justify-between bg-mil-800 px-3 py-2 text-xs">
        <span className="text-mil-200 font-mono">{filename}</span>
        <div className="flex gap-2">
          {downloadHref && (
            <a
              href={downloadHref}
              download={filename}
              className="bg-mil-700 hover:bg-mil-600 text-mil-50 px-2 py-1 rounded text-xs font-semibold"
            >
              Download
            </a>
          )}
          <button
            onClick={copy}
            className="bg-gold-400 hover:bg-gold-500 text-mil-900 px-2 py-1 rounded text-xs font-semibold"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="text-mil-50 text-xs p-3 overflow-x-auto font-mono leading-relaxed max-h-96">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const WINDOWS_PS1 = `# CAC.help — DoD Certificate Installer (Windows)
# Downloads the official DoD certificate bundle from public.cyber.mil and
# installs each root and intermediate cert into your USER certificate store
# (Cert:\\CurrentUser\\Root and Cert:\\CurrentUser\\CA). No admin required.
#
# Usage: right-click → Run with PowerShell, OR from PowerShell:
#   Set-ExecutionPolicy -Scope Process Bypass; .\\install-dod-certs.ps1
# Audit before running: https://github.com/Reuroq/cac-help

\$ErrorActionPreference = 'Stop'
\$BundleUrl = 'https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip'
\$WorkDir   = Join-Path \$env:TEMP "dod-certs-\$(Get-Random)"
New-Item -ItemType Directory -Path \$WorkDir -Force | Out-Null

Write-Host "[1/4] Downloading DoD certificate bundle from public.cyber.mil ..." -ForegroundColor Cyan
\$ZipPath = Join-Path \$WorkDir 'certs.zip'
try {
    Invoke-WebRequest -Uri \$BundleUrl -OutFile \$ZipPath -UseBasicParsing
} catch {
    Write-Host "Direct download failed. The DoD URL may have moved." -ForegroundColor Yellow
    Write-Host "Manually download from: https://public.cyber.mil/pki-pke/admins/" -ForegroundColor Yellow
    Write-Host "Then unzip into \$WorkDir and re-run this script with the -SkipDownload flag." -ForegroundColor Yellow
    exit 1
}

Write-Host "[2/4] Extracting ..." -ForegroundColor Cyan
Expand-Archive -Path \$ZipPath -DestinationPath \$WorkDir -Force

Write-Host "[3/4] Locating certificate files ..." -ForegroundColor Cyan
\$CerFiles = Get-ChildItem -Path \$WorkDir -Recurse -Include *.cer,*.crt,*.pem | Where-Object { -not \$_.PSIsContainer }
if (\$CerFiles.Count -eq 0) {
    # The PKCS#7 .p7b bundle case — extract certs from it
    \$P7B = Get-ChildItem -Path \$WorkDir -Recurse -Filter '*.p7b' | Select-Object -First 1
    if (\$P7B) {
        \$Coll = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
        \$Coll.Import(\$P7B.FullName)
        Write-Host "Found PKCS#7 bundle with \$(\$Coll.Count) certs." -ForegroundColor Cyan
        \$CertSink = Join-Path \$WorkDir 'individual'
        New-Item -ItemType Directory -Path \$CertSink -Force | Out-Null
        foreach (\$c in \$Coll) {
            \$Safe = (\$c.Subject -replace '[^a-zA-Z0-9]','_').Substring(0,[Math]::Min(60,(\$c.Subject -replace '[^a-zA-Z0-9]','_').Length))
            \$Path = Join-Path \$CertSink "\$Safe.cer"
            [System.IO.File]::WriteAllBytes(\$Path, \$c.RawData)
        }
        \$CerFiles = Get-ChildItem -Path \$CertSink -Filter '*.cer'
    }
}
Write-Host "Found \$(\$CerFiles.Count) certificate file(s)." -ForegroundColor Cyan

Write-Host "[4/4] Installing into Cert:\\CurrentUser store ..." -ForegroundColor Cyan
\$Installed = 0
\$Skipped = 0
foreach (\$f in \$CerFiles) {
    try {
        \$Cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 \$f.FullName
        \$Subject = \$Cert.Subject
        \$IsRoot = \$Cert.Subject -eq \$Cert.Issuer
        \$StoreName = if (\$IsRoot) { 'Root' } else { 'CA' }
        \$Store = New-Object System.Security.Cryptography.X509Certificates.X509Store \$StoreName, 'CurrentUser'
        \$Store.Open('ReadWrite')
        \$Existing = \$Store.Certificates | Where-Object { \$_.Thumbprint -eq \$Cert.Thumbprint }
        if (\$Existing) {
            \$Skipped++
        } else {
            \$Store.Add(\$Cert)
            \$Installed++
            Write-Host "  + [\$StoreName] \$Subject" -ForegroundColor Green
        }
        \$Store.Close()
    } catch {
        Write-Host "  ! Skipped \$(\$f.Name): \$_" -ForegroundColor Yellow
    }
}

Remove-Item -Path \$WorkDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Done. Installed: \$Installed  Already-present: \$Skipped" -ForegroundColor Green
Write-Host "Restart your browser, insert your CAC, and visit a .mil site." -ForegroundColor Green
`;

const MACOS_SH = `#!/usr/bin/env bash
# CAC.help — DoD Certificate Installer (macOS)
# Downloads the DoD certificate bundle from public.cyber.mil and installs each
# certificate into your LOGIN keychain set to "Always Trust" for SSL.
#
# Usage:  chmod +x install-dod-certs.sh && ./install-dod-certs.sh
# Audit: https://github.com/Reuroq/cac-help

set -euo pipefail

BUNDLE_URL='https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip'
WORK_DIR="\${TMPDIR:-/tmp}/dod-certs-\$\$"
mkdir -p "\$WORK_DIR"
trap "rm -rf '\$WORK_DIR'" EXIT

echo "[1/4] Downloading DoD certificate bundle..."
if ! curl -fsSL "\$BUNDLE_URL" -o "\$WORK_DIR/certs.zip"; then
    echo "Direct download failed. Manually grab from https://public.cyber.mil/pki-pke/admins/"
    echo "Drop the .zip into \$WORK_DIR/certs.zip and re-run."
    exit 1
fi

echo "[2/4] Extracting..."
unzip -q "\$WORK_DIR/certs.zip" -d "\$WORK_DIR"

echo "[3/4] Locating certificates..."
P7B=\$(find "\$WORK_DIR" -name '*.p7b' | head -1)
INDIV_DIR="\$WORK_DIR/individual"
mkdir -p "\$INDIV_DIR"

if [ -n "\$P7B" ]; then
    openssl pkcs7 -inform DER -in "\$P7B" -print_certs -out "\$INDIV_DIR/all.pem"
    awk '
      /-----BEGIN CERTIFICATE-----/ { n++; out = sprintf("'\$INDIV_DIR'/cert-%03d.pem", n) }
      out { print > out }
    ' "\$INDIV_DIR/all.pem"
    CERTS=("\$INDIV_DIR"/cert-*.pem)
else
    CERTS=(\$(find "\$WORK_DIR" -name '*.cer' -o -name '*.crt' -o -name '*.pem'))
fi

echo "Found \${#CERTS[@]} certificate(s)."

echo "[4/4] Installing into login keychain..."
KEYCHAIN="\$HOME/Library/Keychains/login.keychain-db"
INSTALLED=0
for c in "\${CERTS[@]}"; do
    [ -f "\$c" ] || continue
    SUBJECT=\$(openssl x509 -in "\$c" -noout -subject 2>/dev/null | sed 's/subject=//')
    if security add-trusted-cert -k "\$KEYCHAIN" -p ssl -p smime "\$c" 2>/dev/null; then
        INSTALLED=\$((INSTALLED+1))
        echo "  + \$SUBJECT"
    else
        # Fallback: add without trust (still allows chain validation)
        security import "\$c" -k "\$KEYCHAIN" 2>/dev/null && INSTALLED=\$((INSTALLED+1)) || true
    fi
done

echo ""
echo "Done. Installed: \$INSTALLED"
echo "If you got a permission prompt and clicked Cancel, re-run and click Allow."
echo "Restart Safari, insert your CAC, visit a .mil site."
`;

const LINUX_SH = `#!/usr/bin/env bash
# CAC.help — DoD Certificate Installer (Linux)
# Downloads the DoD bundle and installs into:
#   - Your user NSS database (~/.pki/nssdb)  → used by Chrome, Firefox*, Edge
#   - System CA store (optional, requires sudo) → /usr/local/share/ca-certificates
# *Firefox uses its own NSS store per profile; see manual step at bottom.
#
# Prereqs:  pcscd opensc libnss3-tools  (apt) / nss-tools (dnf)
# Usage:    chmod +x install-dod-certs.sh && ./install-dod-certs.sh
# Audit:    https://github.com/Reuroq/cac-help

set -euo pipefail

BUNDLE_URL='https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip'
WORK_DIR=\$(mktemp -d)
NSSDB="sql:\$HOME/.pki/nssdb"

trap "rm -rf '\$WORK_DIR'" EXIT
mkdir -p "\$HOME/.pki/nssdb"

if ! command -v certutil >/dev/null 2>&1; then
    echo "certutil not found. Install:"
    echo "  Ubuntu/Debian: sudo apt install libnss3-tools"
    echo "  Fedora:        sudo dnf install nss-tools"
    echo "  Arch:          sudo pacman -S nss"
    exit 1
fi

# Init NSS DB if empty
if [ ! -f "\$HOME/.pki/nssdb/cert9.db" ]; then
    certutil -N -d "\$NSSDB" --empty-password
fi

echo "[1/4] Downloading DoD certificate bundle..."
curl -fsSL "\$BUNDLE_URL" -o "\$WORK_DIR/certs.zip"

echo "[2/4] Extracting..."
unzip -q "\$WORK_DIR/certs.zip" -d "\$WORK_DIR"

echo "[3/4] Splitting PKCS#7 bundle..."
P7B=\$(find "\$WORK_DIR" -name '*.p7b' | head -1)
openssl pkcs7 -inform DER -in "\$P7B" -print_certs -out "\$WORK_DIR/all.pem"

INDIV="\$WORK_DIR/individual"
mkdir -p "\$INDIV"
awk -v d="\$INDIV" '
  /-----BEGIN CERTIFICATE-----/ { n++; out = sprintf("%s/cert-%03d.pem", d, n) }
  out { print > out }
' "\$WORK_DIR/all.pem"

echo "[4/4] Importing into NSS database..."
INSTALLED=0
for c in "\$INDIV"/cert-*.pem; do
    SUBJECT=\$(openssl x509 -in "\$c" -noout -subject 2>/dev/null | sed 's/subject=//')
    NICK=\$(echo "\$SUBJECT" | sed 's/.*CN *= *\\([^,]*\\).*/\\1/' | tr -d '"' | xargs)
    [ -z "\$NICK" ] && NICK="DoD Cert \$INSTALLED"
    if certutil -A -d "\$NSSDB" -n "\$NICK" -t "CT,C,C" -i "\$c" 2>/dev/null; then
        INSTALLED=\$((INSTALLED+1))
        echo "  + \$NICK"
    fi
done

echo ""
echo "Done. Imported \$INSTALLED certs into \$HOME/.pki/nssdb"
echo ""
echo "Firefox uses its own cert store per profile. To add DoD certs to Firefox:"
echo "  Preferences → Privacy & Security → Certificates → View Certificates → Authorities → Import"
echo "  Import \$WORK_DIR/all.pem  (or each .pem in \$INDIV/)"
echo ""
echo "To also install OpenSC PKCS#11 for Firefox (CAC reader access):"
echo "  Preferences → Privacy & Security → Security Devices → Load"
echo "  Module: 'OpenSC', file: /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so"
`;

function ScriptInstaller({ os }) {
  if (os === 'windows') {
    const blob = `data:text/plain;charset=utf-8,${encodeURIComponent(WINDOWS_PS1)}`;
    return (
      <div>
        <h3 className="text-xl font-bold text-mil-900 mb-2">Windows install — PowerShell</h3>
        <ol className="list-decimal pl-6 mb-4 space-y-1 text-mil-800">
          <li>Click <strong>Download</strong> below to save <code className="bg-mil-100 px-1 rounded">install-dod-certs.ps1</code>.</li>
          <li>Right-click the file → <strong>Run with PowerShell</strong>. (Or open PowerShell and run <code className="bg-mil-100 px-1 rounded">.\install-dod-certs.ps1</code>.)</li>
          <li>If Windows warns about execution policy, click <strong>Yes / Open / Run anyway</strong> — the script is signed only by you running it, not by Microsoft.</li>
        </ol>
        <CopyBlock code={WINDOWS_PS1} filename="install-dod-certs.ps1" downloadHref={blob} />
      </div>
    );
  }
  if (os === 'macos') {
    const blob = `data:text/plain;charset=utf-8,${encodeURIComponent(MACOS_SH)}`;
    return (
      <div>
        <h3 className="text-xl font-bold text-mil-900 mb-2">macOS install — Terminal</h3>
        <ol className="list-decimal pl-6 mb-4 space-y-1 text-mil-800">
          <li>Download <code className="bg-mil-100 px-1 rounded">install-dod-certs.sh</code> below.</li>
          <li>Open Terminal (⌘+Space → "Terminal").</li>
          <li>Run: <code className="bg-mil-100 px-1 rounded">chmod +x ~/Downloads/install-dod-certs.sh && ~/Downloads/install-dod-certs.sh</code></li>
          <li>macOS will prompt for your password to add certs to your login keychain — click <strong>Always Allow</strong>.</li>
        </ol>
        <CopyBlock code={MACOS_SH} filename="install-dod-certs.sh" downloadHref={blob} />
      </div>
    );
  }
  if (os === 'linux') {
    const blob = `data:text/plain;charset=utf-8,${encodeURIComponent(LINUX_SH)}`;
    return (
      <div>
        <h3 className="text-xl font-bold text-mil-900 mb-2">Linux install — Bash</h3>
        <ol className="list-decimal pl-6 mb-4 space-y-1 text-mil-800">
          <li>Install prerequisites: <code className="bg-mil-100 px-1 rounded">sudo apt install pcscd opensc libnss3-tools</code> (or your distro's equivalent).</li>
          <li>Download <code className="bg-mil-100 px-1 rounded">install-dod-certs.sh</code> below.</li>
          <li>Run: <code className="bg-mil-100 px-1 rounded">chmod +x install-dod-certs.sh && ./install-dod-certs.sh</code></li>
          <li>For Firefox, import the same .pem files into Firefox's own cert store (instructions printed by the script).</li>
        </ol>
        <CopyBlock code={LINUX_SH} filename="install-dod-certs.sh" downloadHref={blob} />
      </div>
    );
  }
  if (os === 'ios') {
    return (
      <div>
        <h3 className="text-xl font-bold text-mil-900 mb-2">iPhone / iPad install — Configuration Profile</h3>
        <p className="text-mil-800 mb-3">
          iOS doesn't run arbitrary scripts (Apple sandboxing). Instead, you install a <strong>Configuration Profile</strong>:
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-2 text-mil-800">
          <li>Open Safari on your device and go to{' '}
            <a href="https://public.cyber.mil/pki-pke/admins/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">public.cyber.mil/pki-pke/admins/</a>
          </li>
          <li>Download the <strong>DoD Mobile Configuration Profile</strong> (.mobileconfig file) — Safari will prompt you to install it.</li>
          <li>After download, open <strong>Settings → General → VPN & Device Management → "DoD Certs"</strong> → tap <strong>Install</strong>. Enter your device passcode.</li>
          <li>
            <strong>Critical:</strong> Settings → General → About → <strong>Certificate Trust Settings</strong> →
            toggle ON for each DoD Root CA. (iOS won't trust the profile certs for SSL until you do this.)
          </li>
          <li>Restart Safari.</li>
        </ol>
        <p className="text-mil-700 text-sm">
          Want a step-by-step with screenshots? See our <Link href="/guides/ios" className="underline font-semibold">iOS guide</Link>.
        </p>
      </div>
    );
  }
  if (os === 'android') {
    return (
      <div>
        <h3 className="text-xl font-bold text-mil-900 mb-2">Android install — In-app import</h3>
        <p className="text-mil-800 mb-3">
          Android's system cert store is locked down for security; for CAC use you typically import certs <strong>into a CAC-aware app</strong> (Sub Rosa, TF Maverick) instead of the system store.
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-2 text-mil-800">
          <li>Install <strong>Sub Rosa</strong> from the Play Store (free).</li>
          <li>From your device's browser, download <a href="https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip" target="_blank" rel="noopener noreferrer" className="underline font-semibold">the DoD bundle (.zip)</a>.</li>
          <li>Open Sub Rosa → <strong>Settings → Certificates → Import</strong> → select the bundle.</li>
          <li>Now use Sub Rosa (not stock Chrome) as your CAC-aware browser.</li>
        </ol>
        <p className="text-mil-700 text-sm">
          Stock Android Chrome does <strong>not</strong> support CAC card readers reliably. See our <Link href="/guides/android" className="underline font-semibold">Android guide</Link>.
        </p>
      </div>
    );
  }
  if (os === 'chromeos') {
    return (
      <div>
        <h3 className="text-xl font-bold text-mil-900 mb-2">ChromeOS install — Authorities</h3>
        <ol className="list-decimal pl-6 mb-4 space-y-2 text-mil-800">
          <li>Install <strong>Smart Card Connector</strong> + <strong>CACKey</strong> from the Chrome Web Store.</li>
          <li>Download <a href="https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip" target="_blank" rel="noopener noreferrer" className="underline font-semibold">the DoD bundle (.zip)</a>.</li>
          <li>Open the .zip in the Files app and extract each <code className="bg-mil-100 px-1 rounded">.cer</code>.</li>
          <li>Open <code className="bg-mil-100 px-1 rounded">chrome://settings/certificates</code> → <strong>Authorities</strong> → <strong>Import</strong> → select each cert → check "Trust this certificate for identifying websites".</li>
          <li>If your Chromebook is managed by a school/work organization, the admin may block these extensions — contact your IT admin.</li>
        </ol>
        <p className="text-mil-700 text-sm">
          See our <Link href="/guides/chromeos" className="underline font-semibold">ChromeOS guide</Link> for more.
        </p>
      </div>
    );
  }
  return null;
}

export default function InstallCertsClient() {
  const [os, setOs] = useState('windows');
  useEffect(() => { setOs(detectOS()); }, []);
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
        <ScriptInstaller os={os} />
      </div>
    </div>
  );
}
