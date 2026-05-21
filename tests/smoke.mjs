#!/usr/bin/env node
// Smoke tests for CAC.help. Usage:
//   BASE_URL=http://localhost:3000 node tests/smoke.mjs
//   BASE_URL=https://cac-help.onrender.com node tests/smoke.mjs

const BASE = process.env.BASE_URL || 'http://localhost:3000';

const ROUTES = [
  ['/', 200, 'CAC'],
  ['/guides', 200, 'Setup Guides'],
  ['/guides/windows', 200, 'Windows'],
  ['/guides/macos', 200, 'macOS'],
  ['/guides/linux', 200, 'Linux'],
  ['/guides/ios', 200, 'iPhone'],
  ['/errors', 200, 'Error Code'],
  ['/errors/403.7', 200, '403.7'],
  ['/errors/2148073485', 200, '2148073485'],
  ['/install-certs', 200, 'DoD Certificate'],
  ['/readers', 200, 'CAC Reader'],
  ['/help-desks', 200, 'Help Desk'],
  ['/about', 200, 'About CAC'],
  ['/disclaimer', 200, 'Disclaimer'],
  ['/privacy', 200, 'Privacy'],
  ['/terms', 200, 'Terms'],
  ['/sitemap.xml', 200, '<urlset'],
  ['/robots.txt', 200, 'Sitemap'],
  ['/nonexistent-page', 404, '404'],
];

let pass = 0, fail = 0;
for (const [path, expectStatus, expectText] of ROUTES) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const text = await res.text();
    const statusOK = res.status === expectStatus;
    const textOK = !expectText || text.includes(expectText);
    if (statusOK && textOK) {
      console.log(`  ok   ${path}  [${res.status}]`);
      pass++;
    } else {
      console.log(`  FAIL ${path}  [${res.status}, expected ${expectStatus}] ${textOK ? '' : `(missing "${expectText}")`}`);
      fail++;
    }
  } catch (err) {
    console.log(`  ERR  ${path}  ${err.message}`);
    fail++;
  }
}

console.log(`\n  ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
