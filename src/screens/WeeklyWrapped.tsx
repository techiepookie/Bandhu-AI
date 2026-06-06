import { useState, useEffect, useRef } from 'react';
import { ScreenType } from '../types';
import { db, auth } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import html2canvas from 'html2canvas';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

export default function WeeklyWrapped({ onNavigate }: ViewProps) {
  const [moodCount, setMoodCount] = useState(0);
  const [targetExam, setTargetExam] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  
  const wrappedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
        if (!auth.currentUser) return;
        try {
            const uid = auth.currentUser.uid;
            
            // fetch profile
            const { getDoc, doc } = await import('firebase/firestore');
            const userSnap = await getDoc(doc(db, 'users', uid));
            if (userSnap.exists()) {
                setTargetExam(userSnap.data().exam || '');
                setUserName(userSnap.data().name || '');
            }

            // fetch moods
            const q = query(collection(db, `users/${uid}/moods`), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setMoodCount(snap.docs.length || 0);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, []);

  const handleShare = async () => {
      if (!wrappedRef.current) return;
      
      try {
          const canvas = await html2canvas(wrappedRef.current, { backgroundColor: '#3a4c2d' });
          const dataUrl = canvas.toDataURL('image/png');
          
          const link = document.createElement('a');
          link.download = `bandhu_wrapped_${userName}.png`;
          link.href = dataUrl;
          link.click();
      } catch (err) {
          console.error("Error generating wrapped image:", err);
      }
  };

  return (
    <div className="flex-1 overflow-hidden relative w-full h-full flex flex-col bg-[#3a4c2d] text-white">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 20%, rgba(212, 233, 192, 0.15) 0%, transparent 60%)" }}></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <img alt="background" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AP1WRLvmnLw0oQJOdpSeKTpcADzKL-N3h4Km1sxl2Q3lcK-5fH20i7tO82rFeg2iUMnAZ52c6Mre4-CrzjSK8AC0nWbNq7xnceswuqKUn9rA8Td-yXegX45WHXFAp_H9s53X_Z0akA_gk3-sWwDXoZ5OuwkWPxtyC8UmUArwIgiHgZWkimXx_r_p_o4HdfxwvAcAxtLPgvkfqnViP3k1sVLUsh1NTBj-G2R70z9Q-2xTnZ6iQVl1hfM7tfrOu2g" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 py-8 h-full">
        <header className="flex justify-between items-center shrink-0 pt-4">
            <button onClick={() => onNavigate('home')} className="p-2">
                <span className="material-symbols-outlined text-primary-fixed hover:scale-110 active:scale-95 transition-transform">arrow_back</span>
            </button>
            <span className="text-[18px] font-bold text-primary-fixed tracking-widest opacity-90">
                Bandhu.
            </span>
            <div className="w-10"></div>
        </header>

        <main className="flex-1 flex flex-col justify-center items-center text-center w-full my-4">
            {loading ? (
                <div className="animate-pulse text-primary-fixed opacity-80">Re-living your week...</div>
            ) : (
                <div ref={wrappedRef} className="space-y-6 bg-[#3a4c2d]/50 backdrop-blur-sm p-6 rounded-3xl border border-primary-fixed/20 w-full relative">
                    <h1 className="text-[40px] font-bold text-primary-fixed leading-tight pt-4">
                        This week,<br/>
                        you logged<br/>
                        <span className="text-secondary-fixed block mt-2 text-[48px]">{moodCount}</span>
                        mood check-ins
                    </h1>
                    <p className="text-[20px] font-semibold text-primary-fixed-dim opacity-90 max-w-[280px] mx-auto pb-4">
                        Targeting {targetExam} takes courage, {userName}.
                    </p>
                    <div className="absolute bottom-4 right-4 text-[12px] text-primary-fixed opacity-50 font-bold tracking-widest">BANDHU APP</div>
                </div>
            )}
        </main>

        <footer className="flex flex-col items-center shrink-0 w-full max-w-md mx-auto pb-4 gap-8">
            <button onClick={handleShare} className="w-full bg-secondary-fixed text-on-secondary-fixed text-[14px] font-bold tracking-wide rounded-full py-5 active:scale-95 transition-transform shadow-[0_8px_32px_rgba(255,218,214,0.15)] hover:shadow-[0_8px_40px_rgba(255,218,214,0.3)] flex justify-center items-center gap-3">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    download
                </span>
                Download Wrapped
            </button>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-fixed"></div>
                <div className="w-2 h-2 rounded-full bg-primary-fixed/30"></div>
                <div className="w-2 h-2 rounded-full bg-primary-fixed/30"></div>
            </div>
        </footer>
      </div>
    </div>
  );
}
