import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, detectOSFromUserAgent } from '@/lib/cac-knowledge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = process.env.CAC_HELP_MODEL || 'claude-sonnet-4-6';
const MAX_TURNS = 12;
const MAX_INPUT_CHARS = 4000;

function sanitizeMessages(messages, detectedOS) {
  if (!Array.isArray(messages)) return [];
  const cleaned = [];
  for (const m of messages.slice(-MAX_TURNS)) {
    if (!m || typeof m.content !== 'string') continue;
    if (m.role !== 'user' && m.role !== 'assistant') continue;
    const content = m.content.slice(0, MAX_INPUT_CHARS).trim();
    if (!content) continue;
    cleaned.push({ role: m.role, content });
  }
  if (cleaned.length && cleaned[0].role !== 'user') cleaned.shift();
  if (cleaned.length && detectedOS) {
    const first = cleaned[0];
    if (first.role === 'user' && !/(windows|macos|mac os|linux|ubuntu|fedora|iphone|ipad|ios|android|chromebook|chromeos)/i.test(first.content)) {
      cleaned[0] = {
        role: 'user',
        content: `[user is on ${detectedOS} — auto-detected from browser]\n\n${first.content}`,
      };
    }
  }
  return cleaned;
}

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server not configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body;
  try { body = await req.json(); }
  catch { return new Response('Bad JSON', { status: 400 }); }

  const ua = req.headers.get('user-agent') || '';
  const detectedOS = detectOSFromUserAgent(ua);
  const messages = sanitizeMessages(body.messages, detectedOS);
  if (!messages.length) {
    return new Response(JSON.stringify({ error: 'No messages' }), { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const apiStream = await client.messages.stream({
          model: MODEL,
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages,
        });
        for await (const event of apiStream) {
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const msg = err?.message || 'Upstream error';
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}. Please try again or try a different browser.]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    },
  });
}
