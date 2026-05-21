# CAC.help - DoD Certificate Installer (Windows)
# Downloads the official DoD certificate bundle from public.cyber.mil and
# installs each root and intermediate cert into your USER certificate store
# (Cert:\CurrentUser\Root and Cert:\CurrentUser\CA). No admin required.
#
# Audit before running: https://github.com/Reuroq/cac-help

$ErrorActionPreference = 'Stop'
$BundleUrl = 'https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/zip/certificates_pkcs7_DoD.zip'
$WorkDir   = Join-Path $env:TEMP "dod-certs-$(Get-Random)"
New-Item -ItemType Directory -Path $WorkDir -Force | Out-Null

Write-Host ""
Write-Host "   [1/4] Downloading DoD certificate bundle from public.cyber.mil ..." -ForegroundColor Cyan
$ZipPath = Join-Path $WorkDir 'certs.zip'
try {
    Invoke-WebRequest -Uri $BundleUrl -OutFile $ZipPath -UseBasicParsing
} catch {
    Write-Host "   Direct download failed. The DoD URL may have moved." -ForegroundColor Yellow
    Write-Host "   Manually download from: https://public.cyber.mil/pki-pke/admins/" -ForegroundColor Yellow
    exit 1
}

Write-Host "   [2/4] Extracting bundle ..." -ForegroundColor Cyan
Expand-Archive -Path $ZipPath -DestinationPath $WorkDir -Force

Write-Host "   [3/4] Locating certificate files ..." -ForegroundColor Cyan
$CerFiles = Get-ChildItem -Path $WorkDir -Recurse -Include *.cer,*.crt,*.pem | Where-Object { -not $_.PSIsContainer }
if ($CerFiles.Count -eq 0) {
    $P7B = Get-ChildItem -Path $WorkDir -Recurse -Filter '*.p7b' | Select-Object -First 1
    if ($P7B) {
        $Coll = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
        $Coll.Import($P7B.FullName)
        Write-Host "   Found PKCS#7 bundle with $($Coll.Count) certs." -ForegroundColor Cyan
        $CertSink = Join-Path $WorkDir 'individual'
        New-Item -ItemType Directory -Path $CertSink -Force | Out-Null
        $idx = 0
        foreach ($c in $Coll) {
            $idx++
            $Path = Join-Path $CertSink ("cert-{0:000}.cer" -f $idx)
            [System.IO.File]::WriteAllBytes($Path, $c.RawData)
        }
        $CerFiles = Get-ChildItem -Path $CertSink -Filter '*.cer'
    }
}
Write-Host "   Found $($CerFiles.Count) certificate file(s)." -ForegroundColor Cyan

Write-Host "   [4/4] Installing into Cert:\CurrentUser store ..." -ForegroundColor Cyan
$Installed = 0
$Skipped = 0
foreach ($f in $CerFiles) {
    try {
        $Cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 $f.FullName
        $Subject = $Cert.Subject
        $IsRoot = $Cert.Subject -eq $Cert.Issuer
        $StoreName = if ($IsRoot) { 'Root' } else { 'CA' }
        $Store = New-Object System.Security.Cryptography.X509Certificates.X509Store $StoreName, 'CurrentUser'
        $Store.Open('ReadWrite')
        $Existing = $Store.Certificates | Where-Object { $_.Thumbprint -eq $Cert.Thumbprint }
        if ($Existing) {
            $Skipped++
        } else {
            $Store.Add($Cert)
            $Installed++
            Write-Host "     + [$StoreName] $Subject" -ForegroundColor Green
        }
        $Store.Close()
    } catch {
        Write-Host "     ! Skipped $($f.Name): $_" -ForegroundColor Yellow
    }
}

Remove-Item -Path $WorkDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "   Done. Installed: $Installed  Already-present: $Skipped" -ForegroundColor Green
Write-Host "   Restart your browser, insert your CAC, and visit a .mil site." -ForegroundColor Green
Write-Host ""
