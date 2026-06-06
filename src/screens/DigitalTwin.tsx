import { ScreenType } from '../types';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

export default function DigitalTwin({ onNavigate }: ViewProps) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full pb-32">
      <header className="flex justify-between items-center w-full px-6 py-6 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <button onClick={() => onNavigate('home')} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-[20px] font-bold text-primary">Bandhu</div>
        <div className="w-10"></div>
      </header>
      
      <main className="px-6 flex flex-col gap-10 mt-4 relative z-10 w-full pt-4">
        <section className="flex flex-col gap-2 text-center items-center">
            <h1 className="text-[24px] font-bold text-on-surface">Your Digital Twin</h1>
            <p className="text-[16px] text-on-surface-variant max-w-[250px]">AI model built from your patterns</p>
        </section>

        <section className="bg-secondary-container rounded-3xl p-6 flex flex-col gap-6 border border-secondary-fixed-dim/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="flex flex-col items-center gap-2 relative z-10">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="fill-none stroke-surface-container-high" strokeWidth="3.8" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <path className="fill-none stroke-secondary" strokeWidth="3.8" strokeLinecap="round" strokeDasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-[40px] font-bold text-on-secondary-container leading-none">68<span className="text-[18px]">%</span></span>
                        <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider mt-1">Burnout Risk</span>
                    </div>
                </div>
                <p className="text-[12px] font-semibold text-on-secondary-container/80 mt-2 bg-on-secondary/40 px-3 py-1 rounded-full uppercase tracking-wide">Based on 14 days of data</p>
            </div>

            <div className="flex flex-col gap-4 w-full relative z-10 mt-2">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] text-on-secondary-container font-medium flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">bedtime</span> Sleep deficit</span>
                        <span className="text-[12px] font-bold text-secondary tracking-wider uppercase">High</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-error rounded-full w-[80%]"></div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] text-on-secondary-container font-medium flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">menu_book</span> Study overload</span>
                        <span className="text-[12px] font-bold text-secondary tracking-wider uppercase">Med</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full w-[60%]"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] text-on-secondary-container font-medium flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">mood_bad</span> Low mood streak</span>
                        <span className="text-[12px] font-bold text-secondary tracking-wider uppercase">Med</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-fixed-dim rounded-full w-[50%]"></div>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-primary-container rounded-2xl p-6 flex items-center gap-5 border border-primary-fixed/20 shadow-sm">
            <div className="w-16 h-16 shrink-0 rounded-full bg-primary-fixed-dim flex items-center justify-center overflow-hidden border border-primary-fixed">
                <span className="material-symbols-outlined text-on-primary-container text-[32px]">self_improvement</span>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-[18px] font-semibold text-on-primary-container leading-tight">Take tomorrow morning off...</h3>
                <p className="text-[14px] text-on-primary-container/80 leading-snug mt-1">Your brain needs recovery to process this week's input.</p>
            </div>
        </section>

        <section className="flex flex-col gap-4 w-full">
            <button className="w-full bg-primary text-on-primary font-bold text-[16px] rounded-full py-4 px-6 hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center gap-2 shadow-sm">
                Adjust my plan <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
            <button className="w-full border-2 border-primary text-primary font-bold text-[16px] rounded-full py-4 px-6 hover:bg-primary/5 transition-colors active:scale-95 flex items-center justify-center gap-2">
                View full prediction report
            </button>
        </section>
      </main>
    </div>
  )
}
