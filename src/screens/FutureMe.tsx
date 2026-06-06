import { useState, useEffect } from 'react';
import { ScreenType } from '../types';
import { auth, db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

export default function FutureMe({ onNavigate }: ViewProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [exam, setExam] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    getDoc(doc(db, 'users', auth.currentUser.uid)).then((snap) => {
      if (snap.exists()) {
         setUserName(snap.data().name || 'Dost');
         setExam(snap.data().exam || 'exam');
      }
    });
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/future', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, exam })
      });
      const data = await res.json();
      if (data.message) {
         setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative w-full h-full bg-background no-scrollbar pb-32">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-secondary-fixed/20 rounded-full blur-[80px] animate-[subtlePulse_8s_infinite] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-tertiary-fixed/20 rounded-full blur-[80px] animate-[subtlePulse_8s_infinite] opacity-60" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="flex justify-between items-center w-full px-6 py-6 bg-transparent sticky top-0 z-40">
        <button onClick={() => onNavigate('home')} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-[20px] font-bold text-primary">Bandhu</div>
        <div className="w-10"></div>
      </header>

      <main className="relative z-10 px-6 pt-10 min-h-full flex flex-col items-center">
        <div className="w-full relative group">
            <div className="p-[1px] rounded-[2rem] bg-gradient-to-br from-surface-variant/80 via-surface-variant/40 to-tertiary-fixed-dim/30 shadow-sm transition-transform">
                <div className="bg-surface rounded-[calc(2rem-1px)] p-8 flex flex-col relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim/50"></div>
                    
                    <div className="flex flex-col items-center text-center space-y-2 mb-8">
                        <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">A message from...</span>
                        <h1 className="text-[40px] font-bold text-on-surface mb-1">Future Me</h1>
                        <p className="text-[14px] text-on-surface-variant/80 flex items-center justify-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            After clearing {exam}
                        </p>
                    </div>
                    
                    <div className="w-12 h-1 rounded-full bg-surface-variant mx-auto mb-8"></div>
                    
                    <div className="relative px-2 mb-8 flex-1 flex items-center justify-center">
                        <span className="material-symbols-outlined absolute -top-4 -left-2 text-surface-variant/50 text-[36px] -scale-x-100" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                        {loading ? (
                             <div className="flex justify-center items-center w-full">
                                <div className="text-[16px] text-on-surface-variant loading-pulse">Consulting the future...</div>
                             </div>
                        ) : (
                            <p className="text-[16px] text-on-surface-variant/90 font-light leading-relaxed italic relative z-10 font-handwriting min-h-[100px]">
                                "{message || "Your future is waiting for you. Tap below to see what your future self has to say."}"
                            </p>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-center gap-1 mt-auto">
                        <span className="material-symbols-outlined text-[14px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        <span className="text-[10px] font-bold tracking-wider text-outline uppercase border-outline/20">Generated by Bandhu AI</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full mt-10 flex flex-col gap-4">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 px-6 rounded-full bg-inverse-surface text-inverse-on-surface text-[18px] font-semibold active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
                <span className="material-symbols-outlined text-[20px]">magic_button</span>
                {loading ? 'Generating...' : (message ? 'Generate New Message' : 'Generate my message')}
            </button>
        </div>
      </main>
      <style>{`
        @keyframes subtlePulse {
            0% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
            100% { opacity: 0.6; transform: scale(1); }
        }
        .loading-pulse {
            animation: textPulse 1.5s infinite ease-in-out;
        }
        @keyframes textPulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
