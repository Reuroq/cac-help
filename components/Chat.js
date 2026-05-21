'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SUGGESTED_PROBLEMS } from '@/lib/cac-knowledge';

const MD_COMPONENTS = {
  a: (p) => <a {...p} target="_blank" rel="noopener noreferrer" className="underline text-mil-700 hover:text-mil-900" />,
  code: ({ inline, ...p }) => inline
    ? <code className="bg-mil-100 text-mil-900 px-1.5 py-0.5 rounded font-mono text-[0.9em]" {...p} />
    : <code className="block bg-mil-900 text-mil-50 p-3 rounded-md font-mono text-sm overflow-x-auto my-2" {...p} />,
  pre: (p) => <pre className="bg-mil-900 text-mil-50 p-3 rounded-md overflow-x-auto my-3 text-sm" {...p} />,
  ul: (p) => <ul className="list-disc pl-5 my-2 space-y-1" {...p} />,
  ol: (p) => <ol className="list-decimal pl-5 my-2 space-y-1" {...p} />,
  li: (p) => <li className="leading-relaxed" {...p} />,
  p: (p) => <p className="my-2 leading-relaxed" {...p} />,
  h1: (p) => <h1 className="text-xl font-bold mt-3 mb-2" {...p} />,
  h2: (p) => <h2 className="text-lg font-bold mt-3 mb-2" {...p} />,
  h3: (p) => <h3 className="text-base font-bold mt-2 mb-1" {...p} />,
  strong: (p) => <strong className="font-semibold" {...p} />,
  hr: () => <hr className="my-3 border-mil-200" />,
  blockquote: (p) => <blockquote className="border-l-4 border-gold-400 pl-3 italic my-2 text-mil-700" {...p} />,
};

export default function Chat({ initialPrompt = '' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialPrompt);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  async function send(text) {
    const userText = (text ?? input).trim();
    if (!userText || streaming) return;

    const next = [...messages, { role: 'user', content: userText }];
    setMessages(next);
    setInput('');
    setStreaming(true);

    setMessages((m) => [...m, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: acc };
          return copy;
        });
      }
    } catch (err) {
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        const errText = `\n\n_Couldn't reach the assistant. ${err?.message || 'Network error'}. Try refreshing._`;
        copy[copy.length - 1] = { role: 'assistant', content: (last?.content || '') + errText };
        return copy;
      });
    } finally {
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    send();
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-mil-900 mb-2 text-center">
              What's wrong with your CAC?
            </h2>
            <p className="text-mil-700 text-center mb-8">
              Describe the problem in plain English. I'll walk you through the fix.
            </p>
            <form onSubmit={onSubmit} className="mb-6">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={3}
                  autoFocus
                  placeholder="e.g. My CAC reader isn't being recognized on Windows 11..."
                  className="w-full px-4 py-3 pr-24 rounded-xl border-2 border-mil-200 focus:border-mil-600 focus:ring-2 focus:ring-mil-600/20 outline-none resize-none text-mil-900 placeholder-mil-400 bg-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  className="absolute right-2 bottom-2 bg-mil-700 hover:bg-mil-800 disabled:bg-mil-200 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Diagnose
                </button>
              </div>
            </form>
            <div>
              <p className="text-sm font-semibold text-mil-700 mb-2">Or pick a common problem:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROBLEMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    disabled={streaming}
                    className="text-sm bg-white hover:bg-mil-100 border border-mil-200 text-mil-800 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-mil-50">
            <div className="max-w-3xl mx-auto w-full space-y-4">
              {messages.map((m, i) => (
                <div key={i} className="flex">
                  <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
                    {m.content ? (
                      m.role === 'user'
                        ? m.content
                        : <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>{m.content}</ReactMarkdown>
                    ) : (streaming && i === messages.length - 1 ? (
                      <div className="flex gap-1 py-1">
                        <span className="typing-dot">●</span>
                        <span className="typing-dot">●</span>
                        <span className="typing-dot">●</span>
                      </div>
                    ) : '')}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={onSubmit} className="border-t border-mil-200 bg-white px-4 py-3">
            <div className="max-w-3xl mx-auto flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Follow-up question..."
                className="flex-1 px-3 py-2 rounded-lg border-2 border-mil-200 focus:border-mil-600 outline-none resize-none text-mil-900 placeholder-mil-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                className="bg-mil-700 hover:bg-mil-800 disabled:bg-mil-200 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
