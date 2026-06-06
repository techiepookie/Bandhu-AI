import { useState, useEffect, useRef } from 'react';
import { ScreenType } from '../types';
import { auth, db } from '../firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

interface AudioResourceProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  colorClass: string;
  audioUrl: string;
}

/**
 * Bubble style classes mapped by emotion index (cycles for > 8 emotions).
 * Defined outside the component to avoid re-allocation on every render.
 */
const BUBBLE_STYLES = [
  'bg-tertiary-fixed text-on-tertiary-fixed text-[14px]',
  'bg-primary-container text-on-primary-container text-[18px]',
  'bg-secondary-fixed text-on-secondary-fixed text-[14px]',
  'bg-secondary-container text-on-secondary-container text-[14px]',
  'bg-error-container text-on-error-container text-[14px]',
  'bg-surface-variant text-on-surface-variant text-[12px]',
  'bg-primary-fixed text-on-primary-fixed text-[12px]',
  'bg-tertiary-container text-on-tertiary-container text-[10px]',
] as const;

/** Absolute positions for each bubble slot in the canvas. */
interface BubblePosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

const BUBBLE_POSITIONS: BubblePosition[] = [
  { top: 10,   left: 10  },
  { bottom: 40, right: 10 },
  { top: 80,   right: 30 },
  { bottom: 10, left: 40 },
  { top: 130,  left: 100 },
  { top: 0,    right: 120 },
  { bottom: 90, left: 5  },
  { top: 160,  right: 5  },
];

/** Maximum number of journal entries to fetch for emotion aggregation. */
const EMOTION_FETCH_LIMIT = 100;

function AudioResource({ title, subtitle, imageUrl, colorClass, audioUrl }: AudioResourceProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        setProgress((current / duration) * 100);
    };

    return (
        <div className={`rounded-[2rem] p-4 flex flex-col border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer ${colorClass}`}>
            <div className="flex items-center justify-between z-10 w-full mb-3">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/50 overflow-hidden flex-shrink-0 border border-white/60">
                        <img alt="" className="w-full h-full object-cover mix-blend-multiply" src={imageUrl} />
                    </div>
                    <div>
                        <h4 className="text-[16px] font-bold">{title}</h4>
                        <p className="text-[14px] opacity-80">{subtitle}</p>
                    </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="w-12 h-12 rounded-full bg-white/90 text-on-surface flex items-center justify-center shadow-sm z-10 hover:bg-white transition-colors active:scale-95"
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                </button>
            </div>
            
            {/* Minimalist Progress Bar */}
            <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden mt-1 mb-1">
                <div 
                    className="h-full bg-black/60 rounded-full transition-all duration-300"
                    style={{ width: `${progress || 0}%` }}
                ></div>
            </div>
            
            <audio 
                ref={audioRef} 
                src={audioUrl} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => {setIsPlaying(false); setProgress(0);}}
            />
        </div>
    );
}

export default function BubbleDashboard({ onNavigate }: ViewProps) {
  const [emotions, setEmotions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!auth.currentUser) return;
      try {
        // Limit to most recent 100 entries to prevent large reads
        const q = query(
          collection(db, `users/${auth.currentUser.uid}/journals`),
          orderBy('createdAt', 'desc'),
          limit(EMOTION_FETCH_LIMIT)
        );
        const snap = await getDocs(q);
        const counts: Record<string, number> = {};

        snap.forEach((d) => {
          const emotion = d.data().emotion as string;
          if (emotion) {
            counts[emotion] = (counts[emotion] || 0) + 1;
          }
        });

        // Provide defaults if completely empty to avoid blank canvas
        if (Object.keys(counts).length === 0) {
          counts['Calm'] = 2;
          counts['Anxious'] = 1;
        }

        setEmotions(counts);
      } catch (err) {
        console.error('[BubbleDashboard] loadData error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full pb-32">
      <header className="bg-transparent sticky top-0 z-40 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-6 py-6">
            <button onClick={() => onNavigate('home')} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors group">
                <span className="material-symbols-outlined text-on-surface group-hover:scale-95 transition-transform">arrow_back</span>
            </button>
            <div className="text-[20px] font-bold text-primary">Bandhu</div>
            <div className="w-10"></div>
        </div>
      </header>

      <main className="px-6 flex flex-col pt-4">
        <section className="mb-8 text-center">
            <h2 className="text-[12px] font-bold text-outline uppercase tracking-wider mb-2">Statistics</h2>
            <h1 className="text-[24px] font-bold text-on-surface leading-tight">Based on your daily reflections</h1>
        </section>

        <section className="relative h-[350px] mb-10 flex items-center justify-center">
            {loading ? (
               <div className="animate-pulse flex items-center justify-center text-on-surface-variant">Loading insights...</div>
            ) : (
               <div className="relative w-full max-w-[320px] h-full">
                  {Object.entries(emotions).map(([emotion, count], index) => {
                     const styleIndex = index % BUBBLE_STYLES.length;
                     const pos = BUBBLE_POSITIONS[styleIndex];
                     const numCount = count as number;
                     // Base size 60px + 15px per occurrence, capped at 130px
                     const sizePx = Math.min(130, 60 + numCount * 15);

                     return (
                        <div
                          key={emotion}
                          role="button"
                          tabIndex={0}
                          aria-label={`Emotion: ${emotion}, logged ${numCount} time${numCount > 1 ? 's' : ''}`}
                          onKeyDown={(e) => e.key === 'Enter' && undefined}
                          className={`absolute rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm cursor-pointer z-10 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary ${BUBBLE_STYLES[styleIndex]}`}
                          style={{
                            width: `${sizePx}px`,
                            height: `${sizePx}px`,
                            ...(pos.top !== undefined    ? { top:    `${pos.top}px`    } : {}),
                            ...(pos.bottom !== undefined ? { bottom: `${pos.bottom}px` } : {}),
                            ...(pos.left !== undefined   ? { left:   `${pos.left}px`   } : {}),
                            ...(pos.right !== undefined  ? { right:  `${pos.right}px`  } : {}),
                          }}
                        >
                            <span className="font-semibold text-center leading-tight truncate px-2">{emotion}</span>
                        </div>
                     );
                  })}
               </div>
            )}
        </section>

        <section className="space-y-4">
            <h3 className="text-[18px] font-semibold text-on-surface mb-4">Recommended Resources</h3>
            
            <AudioResource 
                title="Exam Stress" 
                subtitle="Guided session • 5 min" 
                imageUrl="https://lh3.googleusercontent.com/aida/AP1WRLtlYB-vxJt3uqESPqq0b4_6P6PkOhSm5TPMDchX_asMBIBpnL_sFKG5WnL8RrjSRtTIIs_yoZ0qE1I5CC2VYbRHFV2xlKipnidSNw8bIu5rYf_uxtq_jYgyN1pptcRaq7z-SDRMXsSEWIhvjEpp5iTgvfdTQaOhigra96YicF0Pz3g1i5l4XF4uJhA7_JBWmINfZBc0jqCT6RYRUaHAH6ViTE3h4vuLhSRIededlb6XKPhUUpmhBP1hMv8H" 
                colorClass="bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed-dim/20"
                audioUrl="https://amplify1.blob.core.windows.net/amplify-test-assets/example_audio_1.mp3"
            />

            <AudioResource 
                title="Breathing" 
                subtitle="Exercise • 3 min" 
                imageUrl="https://lh3.googleusercontent.com/aida/AP1WRLtwDuBZHkSCSHfzLJKgJf5-G1wEmDHmn-Na6of26Ny1cbPYI1dNigM_OmOcGKHDYQqcUx9I4i4pOWUidfXFrLJWfVFc-iiOZ_hAB0zAUHefANyFwL3XLwY64yJrM7HQT3twYZ2T4U0KrtXpnP_xX1mJH1CQJZj3xiJb4SvEd06YJLL_sRmNKDEb_uiZSWRuXBUxTlf2zmDzKsDdzqwmwsfoAAcpAa1dMYT91r8Jw8opODbvg1093MY68_P9" 
                colorClass="bg-primary-fixed text-on-primary-container border-primary/5"
                audioUrl="https://amplify1.blob.core.windows.net/amplify-test-assets/example_audio_2.mp3"
            />

            <AudioResource 
                title="Motivation Reset" 
                subtitle="Reflection • 10 min" 
                imageUrl="https://lh3.googleusercontent.com/aida/AP1WRLtSLmrkuygQi0mq2d_xFoQ0CkTFgizNMi5i3F-9IM9M96HFMNO_2vKC8I1WEqVvjjiY_0WZavGRQFv1WvEmlQOS2loW7GVGZmJln2V34_7KYuLedjzxhOul9PeOtZN3EI_LXQRt8EzAjidqOHp9jgOg7ELXWwWb56BpkP3fG9TgblgE4WwulqmQ5EnlLHplyK9LDCrXDCTLzkg_dkXWAtPRs6zUf0ih9mEIUlMZNMNUGw2aaSLqdRFuAKVL" 
                colorClass="bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed-dim/20"
                audioUrl="https://amplify1.blob.core.windows.net/amplify-test-assets/example_audio_3.mp3"
            />

        </section>
      </main>
    </div>
  );
}
