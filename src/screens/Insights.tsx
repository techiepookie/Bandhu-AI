import { ScreenType } from '../types';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

export default function Insights({ onNavigate }: ViewProps) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full pb-32">
      <div className="fixed top-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary-fixed-dim blur-[80px] rounded-full opacity-40 -z-10"></div>
      <div className="fixed bottom-[20%] right-[-5%] w-[250px] h-[250px] bg-secondary-fixed-dim blur-[80px] rounded-full opacity-40 -z-10"></div>

      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-outline hover:bg-surface-variant/50 transition-colors" onClick={() => onNavigate('home')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-[20px] font-bold text-primary">Bandhu</h1>
        <div className="w-10"></div>
      </header>

      <main className="px-6 pt-4 flex flex-col gap-10">
        <section>
          <h2 className="text-[16px] text-on-surface-variant mb-1">Insights</h2>
          <h3 className="text-[32px] font-bold text-on-background leading-tight">
            Understanding your <br/> <span className="text-primary">inner world</span>
          </h3>
        </section>

        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] border border-outline-variant/20">
          <div className="w-full flex justify-between items-start absolute top-6 left-6 right-6">
            <div>
              <h4 className="text-[18px] font-semibold text-on-surface">Anxiety Fingerprint</h4>
              <p className="text-[14px] text-on-surface-variant">Daily intensity patterns</p>
            </div>
            <span className="material-symbols-outlined text-outline-variant">fingerprint</span>
          </div>

          <div className="w-48 h-48 rounded-full mt-12 relative flex items-center justify-center border border-outline-variant/20" style={{ background: "radial-gradient(circle at center, transparent 30%, #f6f3f0 100%), repeating-radial-gradient(circle at center, transparent, transparent 8px, rgba(117, 120, 111, 0.1) 9px, rgba(117, 120, 111, 0.1) 12px)" }}>
            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary-container/60 rounded-full blur-md"></div>
            <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-secondary-container/60 rounded-full blur-md"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-secondary-fixed-dim/40 rounded-full blur-lg"></div>
            
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-surface/80 backdrop-blur rounded-full text-[10px] uppercase text-on-surface-variant shadow-sm border border-outline-variant/30">Morning</div>
            <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 px-2 py-0.5 bg-surface/80 backdrop-blur rounded-full text-[10px] uppercase text-on-surface-variant shadow-sm border border-outline-variant/30">Afternoon</div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-surface/80 backdrop-blur rounded-full text-[10px] uppercase text-on-surface-variant shadow-sm border border-outline-variant/30">Evening</div>
          </div>
        </section>

        <section className="bg-primary-fixed rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-[18px] font-semibold text-on-primary-fixed">Resilience Score</h4>
            <p className="text-[14px] text-on-primary-fixed-variant opacity-80 mt-1">Your bounce-back power</p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8"></circle>
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-primary" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="37.68"></circle>
            </svg>
            <span className="absolute text-[32px] font-bold text-primary">85</span>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/20 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>lightbulb</span>
            <span className="text-[12px] font-bold text-secondary uppercase tracking-wider">AI Insight</span>
          </div>
          <p className="text-[16px] text-on-surface leading-relaxed">
              You recover fastest after a bad mock test when you talk to your <span className="font-semibold text-primary">Study Tribe</span>.
          </p>
        </section>
      </main>
    </div>
  );
}
