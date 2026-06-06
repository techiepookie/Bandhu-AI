import { ScreenType } from '../types';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

export default function ConfessionBooth({ onNavigate }: ViewProps) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full pb-32">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[200px] bg-secondary-fixed opacity-40 blur-3xl rounded-full pointer-events-none -z-10"></div>
      
      <header className="flex justify-between items-center w-full px-6 py-6 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-bold text-primary">Bandhu</h1>
        </div>
        <button className="p-2 text-outline hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-[24px]">settings</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col px-6 pt-4">
        <section className="mb-8 items-center text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full mb-4 shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <h2 className="text-[32px] font-bold text-on-background mb-2 tracking-tight">Confession Booth</h2>
          <p className="text-[16px] text-on-surface-variant">Say the unsayable. It's completely anonymous.</p>
        </section>

        <section className="mb-8">
          <div className="bg-secondary-fixed-dim/30 backdrop-blur-sm rounded-[24px] p-6 shadow-sm border border-outline-variant/30 focus-within:shadow-md focus-within:border-secondary/30 transition-all">
            <textarea className="w-full bg-transparent border-none resize-none outline-none text-on-surface text-[16px] placeholder-on-surface-variant/60 min-h-[120px]" placeholder="What's weighing on you today? No names, no judgment..."></textarea>
            <div className="flex justify-end items-end mt-4">
              <button className="bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors rounded-full px-6 py-3 text-[16px] font-semibold flex items-center gap-2 shadow-sm active:scale-95">
                <span>Release</span>
                <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              </button>
            </div>
          </div>
        </section>

        <section className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[18px] font-semibold text-on-background">Recent Whispers</h3>
            <span className="text-[12px] font-bold text-on-surface-variant px-3 py-1 bg-surface-container rounded-full tracking-wider uppercase">Live</span>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-highest">
              <p className="text-[16px] text-on-surface mb-4 leading-relaxed">I'm terrified of failing my finals and disappointing my parents. I haven't told anyone how much I'm struggling.</p>
              <div className="flex justify-end">
                <button className="inline-flex items-center gap-2 text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-full transition-colors text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  <span>Me too (42)</span>
                </button>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-highest">
              <p className="text-[16px] text-on-surface mb-4 leading-relaxed">I haven't slept in 3 days. The anxiety is eating me alive but I pretend everything is fine when I see my friends.</p>
              <div className="flex justify-end">
                <button className="inline-flex items-center gap-2 text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-full transition-colors text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  <span>Me too (89)</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
