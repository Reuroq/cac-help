#!/usr/bin/env bash
# CAC.help - DoD Certificate Installer (macOS / Linux)
# Downloads the official DoD bundle from public.cyber.mil and installs.
#
# Audit: https://github.com/Reuroq/cac-help

set -euo pipefail

UNAME=$(uname -s)
BUNDLE_URL='https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip'
WORK_DIR=$(mktemp -d)
trap "rm -rf '$WORK_DIR'" EXIT

echo "   [1/4] Downloading DoD certificate bundle..."
curl -fsSL "$BUNDLE_URL" -o "$WORK_DIR/certs.zip"

echo "   [2/4] Extracting..."
unzip -q "$WORK_DIR/certs.zip" -d "$WORK_DIR"

echo "   [3/4] Splitting PKCS#7 bundle..."
P7B=$(find "$WORK_DIR" -name '*.p7b' | head -1)
INDIV="$WORK_DIR/individual"
mkdir -p "$INDIV"

if [ -n "$P7B" ]; then
    openssl pkcs7 -inform DER -in "$P7B" -print_certs -out "$INDIV/all.pem"
    awk -v d="$INDIV" '
      /-----BEGIN CERTIFICATE-----/ { n++; out = sprintf("%s/cert-%03d.pem", d, n) }
      out { print > out }
    ' "$INDIV/all.pem"
    CERTS=("$INDIV"/cert-*.pem)
else
    mapfile -t CERTS < <(find "$WORK_DIR" -name '*.cer' -o -name '*.crt' -o -name '*.pem')
fi

echo "   Found ${#CERTS[@]} certificate(s)."

INSTALLED=0
if [ "$UNAME" = "Darwin" ]; then
    echo "   [4/4] Installing into macOS login keychain..."
    KEYCHAIN="$HOME/Library/Keychains/login.keychain-db"
    for c in "${CERTS[@]}"; do
        [ -f "$c" ] || continue
        SUBJECT=$(openssl x509 -in "$c" -noout -subject 2>/dev/null | sed 's/subject=//' | head -c 70)
        if security add-trusted-cert -k "$KEYCHAIN" -p ssl -p smime "$c" 2>/dev/null; then
            INSTALLED=$((INSTALLED+1))
            echo "     + $SUBJECT"
        else
            security import "$c" -k "$KEYCHAIN" 2>/dev/null && INSTALLED=$((INSTALLED+1)) || true
        fi
    done
else
    echo "   [4/4] Installing into Linux NSS database (~/.pki/nssdb)..."
    if ! command -v certutil >/dev/null 2>&1; then
        echo "   ERROR: certutil not found. Install:"
        echo "     Ubuntu/Debian: sudo apt install libnss3-tools"
        echo "     Fedora:        sudo dnf install nss-tools"
        exit 1
    fi
    mkdir -p "$HOME/.pki/nssdb"
    NSSDB="sql:$HOME/.pki/nssdb"
    if [ ! -f "$HOME/.pki/nssdb/cert9.db" ]; then
        certutil -N -d "$NSSDB" --empty-password
    fi
    for c in "${CERTS[@]}"; do
        SUBJECT=$(openssl x509 -in "$c" -noout -subject 2>/dev/null | sed 's/subject=//')
        NICK=$(echo "$SUBJECT" | sed 's/.*CN *= *\([^,]*\).*/\1/' | tr -d '"' | xargs)
        [ -z "$NICK" ] && NICK="DoD Cert $INSTALLED"
        if certutil -A -d "$NSSDB" -n "$NICK" -t "CT,C,C" -i "$c" 2>/dev/null; then
            INSTALLED=$((INSTALLED+1))
            echo "     + $NICK"
        fi
    done
fi

echo ""
echo "   Done. Installed: $INSTALLED certificate(s)."
echo "   Restart your browser, insert your CAC, visit a .mil site."
