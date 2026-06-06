import { ScreenType } from '../types';

interface SOSProps {
  onBack: () => void;
  onChat: () => void;
}

export default function SOS({ onBack, onChat }: SOSProps) {
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-primary-fixed/50 to-surface text-on-surface overflow-hidden relative z-50">
      {/* Top Header / Close Action */}
      <header className="w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-sm px-4 py-2 rounded-full border border-surface-variant/30">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-dot"></div>
          <span className="text-[18px] font-medium text-on-surface">SOS Calm Mode</span>
        </div>
        <button 
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center bg-surface/50 backdrop-blur-sm rounded-full text-on-surface hover:bg-surface-container transition-colors border border-surface-variant/30"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
      </header>

      {/* Main Breathing Guide Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full px-6">
        {/* Breathing Visualizer */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-12 mt-12">
          {/* Animated Outer Ring */}
          <div className="absolute inset-0 rounded-full bg-primary-fixed blur-md animate-breathe"></div>
          <div className="absolute inset-[-20px] rounded-full border border-primary-fixed/50 animate-breathe" style={{ animationDelay: '1s' }}></div>
          
          {/* Core Circle */}
          <div className="relative z-10 w-48 h-48 rounded-full bg-primary-fixed text-on-primary-fixed flex flex-col items-center justify-center shadow-[inset_0_4px_20px_rgba(255,255,255,0.4)] border border-primary-fixed-dim/50">
            <span className="material-symbols-outlined mb-2 text-[32px]">air</span>
            <span className="text-[24px] font-semibold text-primary">Breathe in...</span>
          </div>
        </div>

        {/* Action Cards Grid (2x2 Bento) */}
        <div className="w-full max-w-md grid grid-cols-2 gap-4 z-10 mt-auto mb-10">
          {/* Card 1: Box Breathing */}
          <button className="bg-primary-fixed text-on-primary-fixed rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 shadow-sm border border-white/40 hover:bg-primary-fixed-dim transition-colors active:scale-95 group">
            <div className="w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">radio_button_unchecked</span>
            </div>
            <span className="text-[16px] font-medium text-center">Box Breathing</span>
          </button>

          {/* Card 2: Grounding */}
          <button className="bg-tertiary-fixed text-on-tertiary-fixed rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 shadow-sm border border-white/40 active:scale-95 group">
            <div className="w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-tertiary">pan_tool</span>
            </div>
            <span className="text-[16px] font-medium text-center leading-tight">5-4-3-2-1<br/>Grounding</span>
          </button>

          {/* Card 3: Talk to Bandhu */}
          <button 
            onClick={onChat}
            className="bg-surface-container-highest text-on-surface rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 shadow-sm border border-white/40 active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-lowest flex items-center justify-center group-hover:scale-110 transition-transform bg-surface-bright">
              <span className="material-symbols-outlined text-on-surface-variant">chat_bubble</span>
            </div>
            <span className="text-[16px] font-medium text-center">Talk to Bandhu</span>
          </button>

          {/* Card 4: Motivational Note */}
          <button className="bg-secondary-fixed text-on-secondary-fixed rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 shadow-sm border border-white/40 active:scale-95 group">
            <div className="w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-secondary">favorite</span>
            </div>
            <span className="text-[16px] font-medium text-center leading-tight">Motivational<br/>Note</span>
          </button>
        </div>
      </main>

      {/* Bottom Reassurance Text */}
      <footer className="w-full text-center pb-8 px-6 z-10">
        <p className="text-[16px] font-normal text-on-surface-variant italic opacity-80 tracking-wide">
          "You are safe. This feeling will pass."
        </p>
      </footer>
    </div>
  );
}
