#!/usr/bin/env bash
# CAC.help - DoD Certificate Installer (macOS, double-clickable)
# This is a .command file - on macOS double-click runs it in Terminal.
# On first run macOS Gatekeeper may block with "cannot be opened because
# Apple cannot check it for malicious software". Right-click -> Open ->
# Open to bypass (a one-time approval).
#
# Audit before running: https://github.com/Reuroq/cac-help

set -euo pipefail

clear
cat <<'BANNER'

   +============================================================+
   |                                                            |
   |     CAC.help  -  DoD Certificate Installer (macOS)        |
   |                                                            |
   +============================================================+

   Installs DoD Root and Intermediate CA certificates into your
   LOGIN keychain so .mil sites and CAC sign-in work in Safari.

   - macOS will prompt for your account password (not your CAC PIN)
     so it can add certificates to your login keychain
   - You may see multiple "always allow" prompts; click Always Allow
   - Nothing else on your system is modified

BANNER

read -p "   Press Enter to begin, or Ctrl+C to cancel..." _

echo ""
echo "   Downloading and running installer..."
echo ""

curl -fsSL https://cac-help.onrender.com/scripts/install-dod-certs.sh | bash

echo ""
echo "   --------------------------------------------------------"
echo "   Done. Restart Safari, insert your CAC, visit a .mil site."
echo ""
echo "   Need help? Visit https://cac-help.onrender.com"
echo ""
read -p "   Press Enter to close this window..." _
