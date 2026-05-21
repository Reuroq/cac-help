# CAC.help

AI-powered Common Access Card (CAC) setup and troubleshooting. A modern, conversational replacement for militarycac.com.

## Stack

- Next.js 14 (App Router) + React 18
- Tailwind CSS
- Anthropic Claude API (streaming)
- Deployed to Render

## Local development

```bash
cp .env.example .env.local   # fill in ANTHROPIC_API_KEY
npm install
npm run dev
# open http://localhost:3000
```

## Tests

```bash
npm run dev &
BASE_URL=http://localhost:3000 npm run test:smoke
```

## Project layout

```
app/
  page.js                  homepage (chatbot hero)
  api/chat/route.js        streaming Anthropic endpoint
  guides/                  OS-specific guides (SSG)
  errors/                  error code reference (SSG)
  readers/                 recommended CAC readers
  help-desks/              military help desk numbers
  about,disclaimer,...     legal/info
components/
  Chat.js                  client-side streaming chat UI
  Header.js, Footer.js     layout chrome
lib/
  cac-knowledge.js         system prompt, suggested problems, UA detection
data/
  errors.json              50+ CAC error codes with fixes
  guides.json              per-OS setup walkthroughs
tests/
  smoke.mjs                end-to-end route smoke tests
```

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | yes | Server-side only. Used by `/api/chat`. |
| `CAC_HELP_MODEL` | no | Defaults to `claude-sonnet-4-6`. Set to `claude-haiku-4-5-20251001` for cheaper/faster. |
| `NEXT_PUBLIC_SITE_URL` | no | Used in sitemap & OG metadata. Defaults to `https://cac.help`. |

## License

Source available; content © CAC.help. Independent project — not affiliated with the U.S. Department of Defense.
