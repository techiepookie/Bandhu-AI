import { useState, useCallback } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { JournalAnalysis } from '../types';

interface JournalProps {
  onBack: () => void;
}

export default function Journal({ onBack }: JournalProps) {
  const [text,    setText]    = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<JournalAnalysis | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!text.trim() || !auth.currentUser) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data: JournalAnalysis = await res.json();

      if (data.emotion) {
        await addDoc(collection(db, `users/${auth.currentUser.uid}/journals`), {
          text,
          emotion: data.emotion,
          stressTrigger: data.stressTrigger,
          confidenceLevel: data.confidenceLevel,
          energy: data.energy,
          createdAt: serverTimestamp(),
        });
        setResult(data);
      }
    } catch (err) {
      console.error('[Journal] handleSave error:', err);
      setError('Could not analyze your reflection. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [text]);

  return (
    <div className="flex flex-col h-full w-full bg-surface text-on-surface overflow-hidden relative z-40">
      <header className="bg-surface sticky top-0 flex items-center justify-between px-6 py-4 w-full z-40">
        <button
          onClick={onBack}
          aria-label="Close journal"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-[18px] font-bold text-on-surface">Reflection</h1>
        <div className="w-10" aria-hidden="true" />
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="journal-textarea" className="text-[14px] font-semibold text-on-surface-variant mb-2">
            Write freely. AI will understand.
          </label>
          <textarea
            id="journal-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || !!result}
            aria-label="Journal reflection text"
            aria-multiline="true"
            className="w-full h-48 bg-surface-container-lowest rounded-2xl p-4 text-[16px] border border-outline-variant/30 focus:border-primary outline-none resize-none disabled:opacity-70"
            placeholder="Today I felt..."
          />
        </div>

        {/* Error banner */}
        {error && (
          <div role="alert" className="bg-error-container text-on-error-container p-4 rounded-xl text-[14px]">
            {error}
          </div>
        )}

        {!result && (
          <button
            onClick={handleSave}
            disabled={loading || !text.trim()}
            aria-label="Save and analyze my reflection"
            aria-busy={loading}
            className="w-full bg-primary-container text-on-primary rounded-full py-4 text-[16px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Save Reflection'}
          </button>
        )}

        {result && (
          <div
            className="bg-tertiary-fixed rounded-2xl p-6 border border-white/40 mt-4 animate-[fadeInUp_0.4s_ease-out_forwards]"
            role="region"
            aria-label="Bandhu's analysis of your reflection"
          >
            <h2 className="text-[18px] font-bold text-on-tertiary-fixed mb-4">Bandhu's Understanding</h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-on-tertiary-fixed-variant">Emotion detected</dt>
                <dd className="font-semibold bg-surface/50 px-3 py-1 rounded-full">{result.emotion}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-on-tertiary-fixed-variant">Stress trigger</dt>
                <dd className="font-semibold text-right max-w-[60%]">{result.stressTrigger}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-on-tertiary-fixed-variant">Confidence</dt>
                <dd className="font-semibold bg-surface/50 px-3 py-1 rounded-full">{result.confidenceLevel}</dd>
              </div>
            </dl>

            <button
              onClick={onBack}
              aria-label="Done, go back"
              className="mt-6 w-full bg-tertiary text-on-tertiary rounded-full py-3 text-[14px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
