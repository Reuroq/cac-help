import issues from '@/data/issues.json';

const STOP = new Set(['the','a','an','i','my','your','our','is','am','are','was','were','be','been','being','to','of','in','on','for','with','at','by','from','as','that','this','it','they','them','their','have','has','had','do','does','did','can','could','should','would','will','not','no','but','or','and','if','then','than','so','also','too','about','when','what','how','why','where','which','who','whom','any','some','all','one','two','first','second']);

function tokenize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function indexOf(issue) {
  const parts = [
    issue.title,
    issue.symptoms,
    issue.causes,
    issue.fix,
    (issue.keywords || []).join(' '),
    (issue.related_error_codes || []).join(' '),
    issue.category,
    (issue.platforms || []).join(' '),
  ];
  return new Set(tokenize(parts.join(' ')));
}

const INDEX = issues.map((i) => ({ issue: i, tokens: indexOf(i) }));

function detectPlatform(text) {
  const t = text.toLowerCase();
  if (/iphone|ipad|ios|safari mobile/.test(t)) return 'ios';
  if (/android|samsung|pixel/.test(t)) return 'android';
  if (/chromebook|chromeos|chrome os/.test(t)) return 'chromeos';
  if (/macos|mac os|macbook|imac|safari/.test(t)) return 'macos';
  if (/linux|ubuntu|fedora|debian|arch|opensuse/.test(t)) return 'linux';
  if (/windows|win10|win11/.test(t)) return 'windows';
  return null;
}

export function findRelevantIssues(query, { limit = 5, detectedOS = null } = {}) {
  if (!query) return [];
  const qTokens = tokenize(query);
  if (!qTokens.length) return [];

  const errorCodeMatches = (query.match(/\b\d{2,10}(?:\.\d+)?\b/g) || []);
  const platform = detectPlatform(query) || detectedOS;

  const scored = INDEX.map(({ issue, tokens }) => {
    let score = 0;
    for (const q of qTokens) {
      if (tokens.has(q)) score += 2;
    }
    if (errorCodeMatches.length && issue.related_error_codes) {
      for (const code of errorCodeMatches) {
        if (issue.related_error_codes.includes(code)) score += 10;
      }
    }
    if (platform && issue.platforms?.includes(platform)) score += 3;
    return { issue, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 1).slice(0, limit).map((s) => s.issue);
}

export function summarizeForPrompt(matched) {
  if (!matched?.length) return '';
  const lines = ['', '# Relevant entries from your knowledge base', ''];
  for (const m of matched) {
    lines.push(`## ${m.title}`);
    lines.push(`Platform(s): ${(m.platforms || ['any']).join(', ')}`);
    if (m.symptoms) lines.push(`Symptoms: ${m.symptoms}`);
    if (m.causes) lines.push(`Causes: ${m.causes}`);
    if (m.fix) lines.push(`Fix: ${m.fix}`);
    if (m.related_error_codes?.length) lines.push(`Error codes: ${m.related_error_codes.join(', ')}`);
    lines.push('');
  }
  lines.push('Use these as additional context. Synthesize a clear answer; don\'t parrot verbatim.');
  return lines.join('\n');
}
