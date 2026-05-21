export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-10 prose-cac">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> {new Date().toISOString().slice(0, 10)}</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Chat messages</strong> you send to the AI assistant.</li>
        <li><strong>Browser User-Agent string</strong>, used to auto-detect your operating system so we can tailor responses.</li>
        <li><strong>Basic web server logs</strong> (IP address, request path, timestamp) for security and abuse prevention.</li>
      </ul>

      <h2>What we DON'T collect</h2>
      <ul>
        <li>Your name, email, EDIPI, DoD ID, rank, unit, or any other personally identifying information.</li>
        <li>Your CAC PIN. We never ask for this and the AI is instructed to refuse if you try to share it.</li>
        <li>Cookies for tracking or advertising. We use no third-party analytics or ad networks at this time.</li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        To generate AI responses, your chat messages are transmitted to <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">Anthropic</a>'s
        Claude API. Per Anthropic's policy, API inputs and outputs are not used to train their models.
        We do not transmit your User-Agent or IP address to Anthropic; that data stays on our servers.
      </p>

      <h2>Data retention</h2>
      <p>
        Chat transcripts are not persisted to a user-linked database. We may retain aggregate, anonymized logs of common questions and
        error categories to improve the knowledge base. Web server logs are rotated and discarded within 30 days.
      </p>

      <h2>Children's privacy</h2>
      <p>
        CAC.help is intended for adult military, civilian, and contractor users of DoD systems. We do not knowingly collect information
        from children under 13.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy as the service evolves. Material changes will be reflected in the "Last updated" date at the top.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions: <a href="mailto:privacy@cac.help">privacy@cac.help</a>
      </p>
    </article>
  );
}
