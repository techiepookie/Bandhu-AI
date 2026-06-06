import { ScreenType } from '../types';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

export default function StressBoss({ onNavigate }: ViewProps) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full pb-32">
      <header className="flex justify-between items-center w-full px-6 py-6 sticky top-0 z-40">
        <button onClick={() => onNavigate('home')} aria-label="Go back to home" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <div className="text-[20px] font-bold text-primary">Bandhu</div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-2">
        <div className="mb-10 text-center">
            <h1 className="text-[28px] font-bold text-on-surface mb-1">Stress Boss Battle</h1>
            <p className="text-[16px] text-on-surface-variant">Defeat your anxiety!</p>
        </div>

        <section className="mb-10 relative flex flex-col items-center">
            <div className="absolute inset-0 bg-secondary-fixed opacity-40 blur-[40px] rounded-full scale-75 z-0"></div>
            
            <div className="relative z-10 w-full aspect-square max-w-[280px] bg-surface-container-low rounded-[3rem] p-6 flex items-center justify-center border border-surface-variant shadow-sm animate-[subtle-float_6s_ease-in-out_infinite]" style={{ animation: "subtle-float 6s ease-in-out infinite" }}>
                <img alt="Cute anxiety monster" className="w-[80%] h-[80%] object-contain mix-blend-multiply opacity-90" src="https://lh3.googleusercontent.com/aida/AP1WRLs_RYCOo9BqpKugWGCipgJBaa1Br7_A83ks1dgSw9vx0bpv3mCDJcqsdNhNJaxyHT7cMVoVg3Rm5o5TMp1sxGPnXG9MfKZDncOkMhiS7TFEfYcZVukglvnXB7qxqfN3gfQWjQ51KS_WQsy4t6jtbVY8vRERpVGfUj6uyOn_sHQf1QfH-gcEhDhzGU0lein_sAEQJuYa8hIAWBOwLQy5iAfFmGMM5rnmepSNlINTfiGD14hQHX23PzESXmyC" />
            </div>

            <div className="relative z-20 -mt-6 w-[90%] bg-surface rounded-full p-4 shadow-sm border border-surface-variant">
                <div className="flex justify-between items-end mb-2 px-1">
                    <span className="text-[12px] font-bold text-on-surface uppercase tracking-wider">Exam Anxiety</span>
                    <span className="text-[18px] font-bold text-secondary">340 HP</span>
                </div>
                <div className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-container w-[75%] rounded-full transition-all duration-1000 relative">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                    </div>
                </div>
            </div>
        </section>

        <section className="mb-10 w-full">
            <h2 className="text-[12px] font-bold text-on-surface-variant mb-4 uppercase tracking-wider">Choose your attack</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                <button aria-label="Start breathing exercise" className="snap-start flex-shrink-0 w-[140px] flex flex-col items-center p-5 bg-tertiary-container rounded-[2rem] text-on-tertiary-container hover:opacity-90 active:scale-95 transition-all shadow-sm border border-white/20">
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-3 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[24px]">air</span>
                    </div>
                    <span className="text-[14px] font-semibold mb-1 text-center">Breathing</span>
                    <span className="text-[12px] font-bold bg-white/40 px-3 py-1 rounded-full uppercase tracking-wider">-15 HP</span>
                </button>

                <button aria-label="Walk 10 minutes" className="snap-start flex-shrink-0 w-[140px] flex flex-col items-center p-5 bg-primary-container rounded-[2rem] text-on-primary-container hover:opacity-90 active:scale-95 transition-all shadow-sm border border-white/20">
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-3 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[24px]">directions_walk</span>
                    </div>
                    <span className="text-[14px] font-semibold mb-1 text-center">Walk 10m</span>
                    <span className="text-[12px] font-bold bg-white/40 px-3 py-1 rounded-full uppercase tracking-wider">-20 HP</span>
                </button>
            </div>
        </section>

        <section className="mt-auto bg-surface-container-low rounded-[2rem] p-6 border border-surface-variant flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                    <span className="text-[18px] font-bold text-on-surface">Focus Warrior</span>
                </div>
                <span className="text-[12px] font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full uppercase tracking-wider">Level 4</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden my-1">
                <div className="h-full bg-primary w-[60%] rounded-full"></div>
            </div>
            <p className="text-[14px] text-on-surface-variant text-center mt-1">Total HP dealt today: <span className="font-semibold text-on-surface">85</span></p>
        </section>
      </main>
      <style>{`
        @keyframes subtle-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-5px) scale(1.02); }
        }
      `}</style>
    </div>
  );
}
