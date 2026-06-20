import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { Markdown, Spinner } from '../components/ui';

export default function Coach() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  async function loadConversations() {
    const list = await api.listConversations().catch(() => []);
    setConversations(list);
  }

  async function openConversation(id) {
    setActiveId(id);
    const convo = await api.getConversation(id);
    setMessages(convo.messages);
  }

  function newChat() {
    setActiveId(null);
    setMessages([]);
    textareaRef.current?.focus();
  }

  async function removeConversation(id, e) {
    e.stopPropagation();
    await api.deleteConversation(id);
    if (id === activeId) newChat();
    loadConversations();
  }

  async function send(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setMessages((m) => [...m, { id: `tmp-${Date.now()}`, role: 'user', content: text }]);
    setSending(true);
    try {
      const res = await api.sendMessage({ conversation_id: activeId, message: text });
      setActiveId(res.conversation_id);
      const convo = await api.getConversation(res.conversation_id);
      setMessages(convo.messages);
      loadConversations();
    } catch (err) {
      setMessages((m) => [
        ...m,
        { id: `err-${Date.now()}`, role: 'assistant', content: `**Error:** ${err.message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const PROMPTS = [
    'How do I prepare for a senior engineering interview?',
    'Help me negotiate a higher salary offer.',
    'How do I switch from finance to tech?',
    'What skills should I build next for a PM role?',
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink/[0.07] bg-white md:flex">
        <div className="p-3">
          <button
            onClick={newChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet py-2.5 text-sm font-semibold text-white shadow-violet hover:bg-violet-soft transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {conversations.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-ink/35">No conversations yet.</p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => openConversation(c.id)}
              className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                c.id === activeId
                  ? 'bg-violet-faint text-violet font-medium'
                  : 'text-ink/60 hover:bg-ink/[0.04] hover:text-ink'
              }`}
            >
              <span className="truncate">{c.title}</span>
              <button
                onClick={(e) => removeConversation(c.id, e)}
                className="ml-2 hidden shrink-0 rounded p-0.5 text-ink/25 hover:text-coral group-hover:block"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          {messages.length === 0 && !sending && (
            <EmptyState prompts={PROMPTS} onPrompt={(p) => { setInput(p); textareaRef.current?.focus(); }} />
          )}

          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((m) =>
              m.role === 'user' ? (
                <UserMessage key={m.id} text={m.content} />
              ) : (
                <AssistantMessage key={m.id} text={m.content} />
              )
            )}
            {sending && <TypingIndicator />}
            <div ref={endRef} />
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-ink/[0.07] bg-white px-4 py-4 md:px-8">
          <form onSubmit={send} className="mx-auto max-w-3xl">
            <div className="flex items-end gap-3 rounded-2xl border-[1.5px] border-ink/12 bg-sand/50 px-4 py-3 focus-within:border-violet focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(91,75,219,0.1)] transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your coach anything… (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-ink placeholder-ink/30 outline-none"
                style={{ maxHeight: '140px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet text-white shadow-violet hover:bg-violet-soft disabled:opacity-40 transition-all"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-ink/25">
              AI responses may not be accurate. Verify important decisions independently.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ prompts, onPrompt }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-16 text-center animate-rise">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet to-violet-soft shadow-violet text-3xl">
        💬
      </div>
      <h2 className="font-display text-2xl font-bold text-ink">Ask your career coach</h2>
      <p className="mt-2 max-w-md text-sm text-ink/50">
        Interviews, switching fields, salary, growth plans — anything career-related.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 w-full max-w-xl">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt(p)}
            className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-left text-sm text-ink/60 hover:border-violet/30 hover:bg-violet-faint hover:text-violet transition-colors shadow-card"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function UserMessage({ text }) {
  return (
    <div className="flex justify-end gap-3 animate-rise-fast">
      <div className="max-w-[78%] rounded-3xl rounded-tr-lg bg-ink px-5 py-3.5 text-sm text-white shadow-sm">
        {text}
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/10 text-xs font-bold text-ink/60 mt-1">
        You
      </div>
    </div>
  );
}

function AssistantMessage({ text }) {
  return (
    <div className="flex justify-start gap-3 animate-rise-fast">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-violet-soft text-xs font-bold text-white shadow-sm mt-1">
        AI
      </div>
      <div className="max-w-[82%] rounded-3xl rounded-tl-lg border border-ink/[0.07] bg-white px-5 py-4 shadow-card">
        <Markdown text={text} />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-violet-soft text-xs font-bold text-white shadow-sm mt-1">
        AI
      </div>
      <div className="flex items-center gap-1.5 rounded-3xl rounded-tl-lg border border-ink/[0.07] bg-white px-5 py-4 shadow-card">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-2 w-2 rounded-full bg-violet/60 animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
