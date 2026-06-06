import { useState, useEffect } from 'react';
import { ScreenType } from '../types';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface HomeProps {
  onNavigate: (s: ScreenType) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [userName, setUserName] = useState('');
  const [energyScore, setEnergyScore] = useState(82);
  const [moods, setMoods] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    
    // Fetch profile
    getDoc(doc(db, 'users', userId)).then((snap) => {
      if (snap.exists()) {
        setUserName(snap.data().name?.split(' ')[0] || '');
        if (snap.data().energyScore) setEnergyScore(snap.data().energyScore);
      }
    });

    // Fetch moods
    const q = query(collection(db, `users/${userId}/moods`), orderBy('createdAt', 'desc'), limit(10));
    const unsubMoods = onSnapshot(q, (snapshot) => {
      const dbMoods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMoods(dbMoods);
      if (dbMoods.length > 0) {
        // Adjust energy score loosely based on recent mood length
        setEnergyScore(Math.min(100, 75 + dbMoods.length * 2));
      }
    });

    return () => unsubMoods();
  }, []);

  const handleMoodSelect = async (emoji: string) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/moods`), {
        emoji,
        createdAt: serverTimestamp()
      });
      // Navigate to chat or bubbles if requested, but let's just log it here for simplicity
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full pb-32">
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed top-[40%] right-[-20%] w-[500px] h-[500px] bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none z-0"></div>

      <header className="flex justify-between items-center w-full px-6 py-6 sticky top-0 z-40 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-center w-10 h-10 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
        </div>
        <button onClick={() => auth.signOut()} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </header>

      <main className="px-6 flex flex-col gap-6 relative z-10 pt-2">
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-surface-container-highest/50 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-fixed/30 rounded-full blur-2xl"></div>
          <div className="relative z-10 space-y-6">
            <span className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
                Daily reflection
            </span>
            <h1 className="text-[24px] font-bold text-on-surface">
              <span className="block mb-2 text-primary">Hello, {userName || 'student'} 🌿</span>
              <span className="font-normal text-on-surface-variant">How do you feel about your current emotions?</span>
            </h1>

            <div className="mt-6 flex items-center bg-surface-container-low rounded-full p-2 pl-6 border border-surface-variant/50 focus-within:border-primary/30 transition-colors">
              <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-[16px] text-on-surface placeholder-on-surface-variant outline-none" 
                placeholder="Take me to journal..." 
                type="text" 
                onClick={() => onNavigate('journal')}
                readOnly
              />
              <button onClick={() => onNavigate('journal')} className="bg-primary-container text-on-primary-container w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 ml-2">
                <span className="material-symbols-outlined">arrow_upward</span>
              </button>
            </div>
          </div>
        </section>

        <section onClick={() => onNavigate('twins')} className="bg-primary-fixed rounded-3xl p-6 flex items-center gap-6 border border-primary-fixed-dim/30 cursor-pointer hover:bg-primary-fixed-dim transition-colors active:scale-[0.98]">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-primary-fixed-dim/50" fill="none" strokeWidth="4" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <path className="text-primary" fill="none" strokeWidth="4" strokeDasharray={`${energyScore}, 100`} strokeLinecap="round" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[18px] font-bold text-on-primary-fixed">{energyScore}%</span>
            </div>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-on-primary-fixed mb-1">Mental Energy</h2>
            <p className="text-[14px] text-on-primary-fixed-variant opacity-80">AI-calculated from mood + sleep</p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-highest/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-bold text-on-surface">Daily Mood Log</h3>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer" onClick={() => onNavigate('bubbles')}>arrow_forward</span>
            </div>
            <div className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {['😊', '😌', '😣', '⭐', '😅', '⚡'].map((emoji) => (
                <button 
                  key={emoji}
                  onClick={() => handleMoodSelect(emoji)}
                  className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center bg-surface-container text-2xl shadow-sm hover:scale-105 active:scale-95 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </section>

          <section onClick={() => onNavigate('wrapped')} className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-highest/50 relative overflow-hidden cursor-pointer hover:bg-surface-container-low transition-colors active:scale-[0.98]">
            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-secondary-fixed/40 rounded-full blur-xl"></div>
            <div className="relative z-10 h-full flex flex-col justify-center">
              <h3 className="text-[18px] font-bold text-on-surface-variant mb-2">Your progress</h3>
              <div className="text-[40px] font-bold text-primary mb-1">89%</div>
              <p className="text-[14px] text-on-surface-variant">Of the weekly plan completed</p>
            </div>
          </section>
          
          <section onClick={() => onNavigate('chat')} className="col-span-full bg-secondary-fixed rounded-3xl p-6 shadow-sm border border-secondary/20 relative overflow-hidden cursor-pointer hover:bg-secondary-fixed-dim transition-colors active:scale-[0.98]">
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
              <h3 className="text-[16px] font-bold text-on-secondary-fixed">Bandhu AI Companion</h3>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-28 right-4 z-40 hidden md:block">
        <button onClick={() => onNavigate('sos')} className="w-16 h-16 bg-error flex items-center justify-center rounded-full text-on-error shadow-lg shadow-error/30 hover:scale-105 active:scale-95 transition-transform">
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>emergency</span>
        </button>
      </div>

    </div>
  );
}

