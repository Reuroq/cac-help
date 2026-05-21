import Link from 'next/link';

export const metadata = {
  title: 'About CAC.help',
  description: 'CAC.help is an independent, AI-powered guide for setting up your Common Access Card. Free, ad-free, no accounts.',
};

export default function AboutPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-10 prose-cac">
      <h1>About CAC.help</h1>
      <p>
        CAC.help is a modern replacement for the legendary <a href="https://militarycac.com" target="_blank" rel="noopener noreferrer">militarycac.com</a> —
        the same hard-won knowledge, but with an AI assistant that talks back, walks you through the fix step by step, and adapts to your specific OS.
      </p>

      <h2>What it does</h2>
      <ul>
        <li>Diagnoses CAC setup and troubleshooting problems in plain English</li>
        <li>Tailors fixes to your detected operating system</li>
        <li>Walks you through ActivClient, InstallRoot, Keychain, OpenSC, and every other middleware you might hit</li>
        <li>Looks up CAC error codes with practical fixes</li>
        <li>Points you to the right help desk when the problem is bigger than software</li>
      </ul>

      <h2>What it isn't</h2>
      <p>
        CAC.help is <strong>not affiliated with the U.S. Department of Defense</strong>, any branch of the military, or any federal agency.
        We are not a substitute for your local IT support, your unit's S6/G6, or an official help desk. We don't have access to your DEERS record,
        your account, or any classified system. We are an independent community resource — like a friendly veteran helping you over a beer.
      </p>

      <h2>Privacy</h2>
      <p>
        We do not collect your CAC PIN. We do not collect your name, EDIPI, or any personally identifying information.
        Chat messages are sent to Anthropic's Claude API to generate responses; per Anthropic's policy they are not used to train models.
        See our <Link href="/privacy">Privacy Policy</Link> for details.
      </p>

      <h2>How it's built</h2>
      <p>
        CAC.help is a Next.js application deployed on Render. The AI assistant is powered by Anthropic's Claude.
        The knowledge base is curated from a decade of community-documented CAC issues, with regular updates as systems change.
      </p>

      <h2>Found a mistake?</h2>
      <p>
        CAC issues mutate constantly — agencies change vendors, browsers update, Windows ships new builds.
        If you see outdated information, the simplest way to flag it is to ask the AI a follow-up question explaining what's different now —
        we review chat transcripts in aggregate (without PII) to catch knowledge drift.
      </p>
    </article>
  );
}
