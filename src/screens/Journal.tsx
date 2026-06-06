import { useState } from 'react';
import { ScreenType } from '../types';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface JournalProps {
  onBack: () => void;
}

export default function Journal({ onBack }: JournalProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSave = async () => {
    if (!text.trim() || !auth.currentUser) return;
    setLoading(true);
    setResult(null);

    try {
      // Analyze with Gemini
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      
      if (data.emotion) {
        // Save to firestore
        await addDoc(collection(db, `users/${auth.currentUser.uid}/journals`), {
          text,
          emotion: data.emotion,
          stressTrigger: data.stressTrigger,
          confidenceLevel: data.confidenceLevel,
          energy: data.energy,
          createdAt: serverTimestamp()
        });
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-surface text-on-surface overflow-hidden relative z-40">
      <header className="bg-surface sticky top-0 flex items-center justify-between px-6 py-4 w-full z-40">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-[18px] font-bold text-on-surface">Reflection</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
        <div className="flex flex-col">
          <label className="text-[14px] font-semibold text-on-surface-variant mb-2">Write freely. AI will understand.</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || !!result}
            className="w-full h-48 bg-surface-container-lowest rounded-2xl p-4 text-[16px] border border-outline-variant/30 focus:border-primary outline-none resize-none disabled:opacity-70"
            placeholder="Today I felt..."
          ></textarea>
        </div>

        {!result && (
          <button 
            onClick={handleSave}
            disabled={loading || !text.trim()}
            className="w-full bg-primary-container text-on-primary rounded-full py-4 text-[16px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Save Reflection'}
          </button>
        )}

        {result && (
          <div className="bg-tertiary-fixed rounded-2xl p-6 border border-white/40 mt-4 animate-[fadeInUp_0.4s_ease-out_forwards]">
            <h3 className="text-[18px] font-bold text-on-tertiary-fixed mb-4">Bandhu's Understanding</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-on-tertiary-fixed-variant">Emotion detected</span>
                <span className="font-semibold bg-surface/50 px-3 py-1 rounded-full">{result.emotion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-tertiary-fixed-variant">Stress trigger</span>
                <span className="font-semibold text-right max-w-[60%]">{result.stressTrigger}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-tertiary-fixed-variant">Confidence</span>
                <span className="font-semibold bg-surface/50 px-3 py-1 rounded-full">{result.confidenceLevel}</span>
              </div>
            </div>
            
            <button 
              onClick={onBack}
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
