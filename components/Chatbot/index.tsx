'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';

const API_URL = 'https://chat-bot-mustafa.vercel.app/api/chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 150, 300].map(delay => (
        <span
          key={delay}
          className="w-[7px] h-[7px] rounded-full bg-[#555] animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

export default function Chatbot() {
  const { t } = useI18n();
  const cb = t.chatbot;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const taRef     = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setChipsVisible(false);
    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput('');
    if (taRef.current) taRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.reply ?? data.error ?? cb.error }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: cb.connError }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="chatbot" className="py-24 bg-[#a855f7]/[0.03]">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-bold mb-2 bg-gradient-to-br from-white to-[#a855f7] bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          {cb.heading}
        </h2>
        <p className="text-[#888] text-[1.05rem] mb-8 max-w-[540px]">
          {cb.intro}
        </p>

        <div className="max-w-[700px] mx-auto bg-white/[0.04] border border-white/[0.09] rounded-[14px] backdrop-blur-xl overflow-hidden flex flex-col">

          {/* Suggestion chips */}
          {chipsVisible && (
            <div className="flex flex-wrap gap-2 p-4 pb-0">
              {cb.chips.map(c => (
                <button
                  key={c.label}
                  onClick={() => send(c.q)}
                  disabled={loading}
                  className="bg-[#a855f7]/10 border border-[#a855f7]/25 text-[#c084fc] text-[0.8rem] px-3.5 py-1.5 rounded-full hover:bg-[#a855f7]/20 hover:border-[#a855f7]/50 transition-colors whitespace-nowrap disabled:opacity-40"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Chat window */}
          <div className="h-[380px] overflow-y-auto flex flex-col gap-3 p-5 scroll-smooth">
            <div className="flex">
              <div className="max-w-[78%] bg-white/[0.06] border border-white/[0.09] text-white text-[0.9rem] leading-relaxed rounded-[12px] rounded-bl-[4px] px-4 py-2.5">
                {cb.welcome}
              </div>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}>
                <div
                  className={`max-w-[78%] text-[0.9rem] leading-relaxed px-4 py-2.5 rounded-[12px] ${
                    m.role === 'user'
                      ? 'bg-[#a855f7] text-white rounded-br-[4px]'
                      : 'bg-white/[0.06] border border-white/[0.09] text-white rounded-bl-[4px]'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex">
                <div className="bg-white/[0.06] border border-white/[0.09] rounded-[12px] rounded-bl-[4px]">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="flex items-end gap-2 p-4 border-t border-white/[0.09]">
            <textarea
              ref={taRef}
              value={input}
              disabled={loading}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              placeholder={cb.placeholder}
              rows={1}
              maxLength={1000}
              className="flex-1 bg-white/5 border border-white/[0.09] rounded-[10px] px-3.5 py-2.5 text-white text-[0.9rem] resize-none outline-none placeholder-[#555] focus:border-[#a855f7] transition-colors max-h-[120px] font-[inherit] disabled:opacity-40"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="w-[38px] h-[38px] flex-shrink-0 bg-[#a855f7] rounded-[9px] text-white text-xl flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ↑
            </button>
          </div>
        </div>

        <p className="text-center text-[#555] text-[0.78rem] mt-4">
          {cb.footer} ·{' '}
          <a href="https://github.com/mustafatur46/ChatBot" target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#a855f7] transition-colors">
            {cb.source}
          </a>
        </p>
      </div>
    </section>
  );
}
