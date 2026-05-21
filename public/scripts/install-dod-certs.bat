@echo off
:: ===========================================================================
:: CAC.help - DoD Certificate Installer (Windows)
:: ---------------------------------------------------------------------------
:: Double-click this file to install the DoD root and intermediate
:: certificates into your USER certificate store. No admin required.
::
:: If Windows shows "Windows protected your PC" - that's SmartScreen reacting
:: to an unsigned file from the internet. Click "More info" then "Run anyway".
:: That happens for any download not signed by a known publisher.
::
:: Audit before running:  https://github.com/Reuroq/cac-help
:: ===========================================================================
title CAC.help - DoD Certificate Installer
mode con: cols=84 lines=32
color 1F
cls

echo.
echo   +================================================================+
echo   ^|                                                                ^|
echo   ^|         CAC.help  -  DoD Certificate Installer                ^|
echo   ^|                                                                ^|
echo   +================================================================+
echo.
echo   This will install the DoD Root and Intermediate CA certificates
echo   into your USER certificate store so .mil websites and CAC sign-in
echo   work in Chrome, Edge, and other Windows-aware browsers.
echo.
echo   - No administrator/UAC prompt needed
echo   - Certificates downloaded fresh from public.cyber.mil
echo   - Nothing else is modified on your system
echo.
echo   --------------------------------------------------------------
echo.
echo   Press any key to begin, or close this window to cancel.
pause >nul

cls
echo.
echo   Working... this usually takes 10-30 seconds.
echo.

powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop'; try { $src = (New-Object System.Net.WebClient).DownloadString('https://cac-help.onrender.com/scripts/install-dod-certs.ps1'); Invoke-Expression $src } catch { Write-Host ''; Write-Host '   ERROR: ' $_.Exception.Message -ForegroundColor Red; Write-Host ''; Write-Host '   Possible causes:' -ForegroundColor Yellow; Write-Host '     - No internet connection' -ForegroundColor Yellow; Write-Host '     - Firewall blocking https://cac-help.onrender.com or public.cyber.mil' -ForegroundColor Yellow; Write-Host '     - Antivirus blocking the script' -ForegroundColor Yellow }"

echo.
echo   --------------------------------------------------------------
echo   Done. Restart your browser (close ALL windows), insert your
echo   CAC, and visit a .mil site to confirm.
echo.
echo   Need help? Visit:  https://cac-help.onrender.com
echo.
echo   Press any key to close this window.
pause >nul
