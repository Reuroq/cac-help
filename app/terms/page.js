export const metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-10 prose-cac">
      <h1>Terms of Use</h1>
      <p><strong>Last updated:</strong> {new Date().toISOString().slice(0, 10)}</p>

      <h2>Acceptance</h2>
      <p>
        By using CAC.help, you agree to these Terms of Use. If you don't agree, please don't use the site.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree NOT to use CAC.help to:</p>
      <ul>
        <li>Submit information protected by classification (Confidential, Secret, Top Secret) or CUI.</li>
        <li>Submit personally identifying information about yourself or others (names, EDIPIs, SSNs, addresses).</li>
        <li>Attempt to bypass DoD security controls, circumvent CAC authentication on systems you're not authorized to access, or otherwise violate the DoD Acceptable Use Policy.</li>
        <li>Submit harassing, threatening, or illegal content.</li>
        <li>Scrape, abuse, or overload the AI assistant beyond normal personal use.</li>
      </ul>

      <h2>No legal advice</h2>
      <p>
        CAC.help is a technical troubleshooting resource. We do not provide legal advice, security clearance advice, military justice advice,
        or HR advice. If you need those, consult appropriate counsel or your chain of command.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Content on CAC.help (excluding user-submitted chat input and AI-generated responses) is © CAC.help. You may quote and share with attribution.
        AI-generated responses to your queries are yours to use freely; we claim no ownership.
      </p>

      <h2>Disclaimer of warranties</h2>
      <p>
        CAC.help is provided "as-is" without warranty of any kind. See our <a href="/disclaimer">full disclaimer</a> for details.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, CAC.help and its operators are not liable for any damages arising from your use of the site.
        Total liability for any claim shall not exceed $100 USD.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Nevada, United States, without regard to conflict-of-law principles.
        Any disputes shall be resolved in the state or federal courts located in Clark County, Nevada.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms at any time. Continued use of the site after changes constitutes acceptance.
      </p>
    </article>
  );
}
