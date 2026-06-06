import { useRef, useEffect, useState, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  limit,
  getDoc,
  doc,
} from 'firebase/firestore';
import type { ChatMessage, ChatApiResponse } from '../types';

interface ChatProps {
  onBack: () => void;
}

const QUICK_REPLIES = [
  { label: 'Mock test kharab gaya', color: 'text-secondary hover:border-secondary' },
  { label: 'Bas demotivated hoon',  color: 'text-tertiary hover:border-tertiary'  },
  { label: 'Parent pressure hai',   color: 'text-primary hover:border-primary'    },
] as const;

/** Maximum number of chat messages to fetch at one time. */
const CHAT_FETCH_LIMIT = 50;

export default function Chat({ onBack }: ChatProps) {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // Static subscription — depends on nothing from state
  useEffect(() => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const q = query(
      collection(db, `users/${userId}/chatMessages`),
      orderBy('createdAt', 'asc'),
      limit(CHAT_FETCH_LIMIT)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
      setMessages(msgs);
    });
    return () => unsub();
  }, []); // intentionally empty — auth.currentUser is stable within a session

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !auth.currentUser || loading) return;

    const userId = auth.currentUser.uid;
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Persist the user's message
      await addDoc(collection(db, `users/${userId}/chatMessages`), {
        role: 'user',
        content: text,
        createdAt: serverTimestamp(),
      });

      // Fetch user profile for personalization
      const userSnap = await getDoc(doc(db, 'users', userId));
      const userData = userSnap.data();

      // Call the Bandhu AI backend
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: 'Bandhu AI companion session',
          userName: userData?.name,
          exam: userData?.exam,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data: ChatApiResponse = await res.json();

      // Persist Bandhu's reply
      if (data.reply) {
        await addDoc(collection(db, `users/${userId}/chatMessages`), {
          role: 'model',
          content: data.reply,
          createdAt: serverTimestamp(),
        });
      }

      // Persist emotion snapshot as a journal entry for BubbleDashboard
      if (data.scores) {
        const { emotionLabel, confidence, anxiety, motivation, burnout } = data.scores;
        await addDoc(collection(db, `users/${userId}/journals`), {
          emotion: emotionLabel,
          content: `AI Chat Reflection: ${emotionLabel}`,
          confidence,
          anxiety,
          motivation,
          burnout,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('[Chat] sendMessage error:', err);
      setError('Could not send message. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSend = useCallback(() => sendMessage(input), [input, sendMessage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex flex-col h-full w-full bg-background text-on-background overflow-hidden relative z-40">
      {/* Header */}
      <header className="bg-surface/90 backdrop-blur-md flex items-center justify-between px-6 py-4 w-full z-40 border-b border-surface-container-highest/50">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-on-surface"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-bold text-on-surface">Bandhu</h1>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(81,100,67,0.5)]" aria-hidden="true" />
          </div>
          <p className="text-[12px] font-semibold tracking-wider text-on-surface-variant opacity-80 mt-0.5">
            Your AI companion
          </p>
        </div>

        <div className="w-10 h-10" aria-hidden="true" />
      </header>

      {/* Chat messages — role=log for screen readers */}
      <main
        ref={scrollRef}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-32 flex flex-col gap-6 relative"
      >
        <div className="w-full flex justify-center mb-2">
          <span className="bg-surface-container-low text-on-surface-variant text-[12px] font-semibold px-4 py-1.5 rounded-full border border-surface-container-high">
            Today
          </span>
        </div>

        {messages.length === 0 && !loading && (
          <div className="text-center text-on-surface-variant mt-10" aria-live="polite">
            Say hi to Bandhu!
          </div>
        )}

        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end w-full animate-[fadeInUp_0.4s_ease-out_forwards]">
              <div className="max-w-[85%] bg-primary text-on-primary p-4 rounded-3xl rounded-tr-sm shadow-sm">
                <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-start w-full gap-3 animate-[fadeInUp_0.4s_ease-out_forwards]">
              <div className="flex-shrink-0 mt-auto mb-1" aria-hidden="true">
                <div className="w-10 h-10 bg-surface-container-highest diamond-avatar flex items-center justify-center shadow-sm relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed mix-blend-multiply opacity-90 blur-sm" />
                </div>
              </div>
              <div className="max-w-[80%] bg-surface-container-high text-on-surface p-4 rounded-3xl rounded-tl-sm shadow-sm">
                <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start w-full gap-3" aria-label="Bandhu is typing" role="status">
            <div className="flex-shrink-0 mt-auto mb-1" aria-hidden="true">
              <div className="w-10 h-10 bg-surface-container-highest diamond-avatar flex items-center justify-center shadow-sm relative overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed mix-blend-multiply opacity-90 blur-sm animate-pulse" />
              </div>
            </div>
            <div className="max-w-[80%] bg-surface-container-high text-on-surface p-4 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
      </main>

      {/* Fixed bottom action area */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col bg-gradient-to-t from-surface via-surface to-transparent pt-8 pb-6 px-6 z-50">
        {/* Error banner */}
        {error && (
          <div role="alert" className="mb-3 bg-error-container text-on-error-container text-[13px] px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        {/* Quick replies */}
        <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-3 pb-4 snap-x" role="group" aria-label="Quick reply suggestions">
          {QUICK_REPLIES.map(({ label, color }) => (
            <button
              key={label}
              onClick={() => sendMessage(label)}
              disabled={loading}
              aria-label={`Quick reply: ${label}`}
              className={`snap-start flex-shrink-0 bg-surface-bright border border-outline-variant/50 ${color} px-5 py-3 rounded-full text-[14px] shadow-sm transition-all active:scale-95 whitespace-nowrap disabled:opacity-50`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Input dock */}
        <div className="flex items-end gap-3 bg-surface-container p-2 pl-4 rounded-[2rem] shadow-lg border border-surface-container-highest transition-all">
          <button
            aria-label="Voice input (coming soon)"
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-primary hover:bg-primary-fixed/50 transition-colors mb-1"
          >
            <span className="material-symbols-outlined">mic</span>
          </button>

          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <textarea
            id="chat-input"
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-[16px] text-on-surface placeholder:text-on-surface-variant/60 py-3 mb-0.5"
            placeholder="Type your message..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Chat message input"
            aria-multiline="true"
            style={{ minHeight: '48px' }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            aria-busy={loading}
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-md hover:opacity-90 transition-all active:scale-90 mb-0.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined -mt-px ml-1">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
