import { useState, useEffect } from 'react';

interface SOSProps {
  onBack: () => void;
  onChat: () => void;
}

const BREATHE_PHASES = ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'] as const;
const PHASE_DURATION_MS = 4000;

export default function SOS({ onBack, onChat }: SOSProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Cycle through breathing phases automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % BREATHE_PHASES.length);
    }, PHASE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  const currentPhase = BREATHE_PHASES[phaseIndex];

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-primary-fixed/50 to-surface text-on-surface overflow-hidden relative z-50">
      {/* Header */}
      <header className="w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-sm px-4 py-2 rounded-full border border-surface-variant/30">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-dot" aria-hidden="true" />
          <span className="text-[18px] font-medium text-on-surface">SOS Calm Mode</span>
        </div>
        <button
          onClick={onBack}
          aria-label="Close SOS calm mode"
          className="w-12 h-12 flex items-center justify-center bg-surface/50 backdrop-blur-sm rounded-full text-on-surface hover:bg-surface-container transition-colors border border-surface-variant/30"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
      </header>

      {/* Breathing Guide */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full px-6">
        {/* Breathing Visualizer */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-12 mt-12">
          {/* Animated outer ring */}
          <div className="absolute inset-0 rounded-full bg-primary-fixed blur-md animate-breathe" aria-hidden="true" />
          <div className="absolute inset-[-20px] rounded-full border border-primary-fixed/50 animate-breathe" style={{ animationDelay: '1s' }} aria-hidden="true" />

          {/* Core circle — screen reader announces the current phase */}
          <div
            role="status"
            aria-live="polite"
            aria-label={`Breathing exercise: ${currentPhase}`}
            className="relative z-10 w-48 h-48 rounded-full bg-primary-fixed text-on-primary-fixed flex flex-col items-center justify-center shadow-[inset_0_4px_20px_rgba(255,255,255,0.4)] border border-primary-fixed-dim/50"
          >
            <span className="material-symbols-outlined mb-2 text-[32px]" aria-hidden="true">air</span>
            <span className="text-[24px] font-semibold text-primary">{currentPhase}</span>
          </div>
        </div>

        {/* Action cards */}
        <div className="w-full max-w-md grid grid-cols-2 gap-4 z-10 mt-auto mb-10" role="group" aria-label="Calm mode tools">
          <button
            aria-label="Start box breathing exercise"
            className="bg-primary-fixed text-on-primary-fixed rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 shadow-sm border border-white/40 hover:bg-primary-fixed-dim transition-colors active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
              <span className="material-symbols-outlined text-primary">radio_button_unchecked</span>
            </div>
            <span className="text-[16px] font-medium text-center">Box Breathing</span>
          </button>

          <button
            aria-label="Start 5-4-3-2-1 grounding exercise"
            className="bg-tertiary-fixed text-on-tertiary-fixed rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 shadow-sm border border-white/40 active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
              <span className="material-symbols-outlined text-tertiary">pan_tool</span>
            </div>
            <span className="text-[16px] font-medium text-center leading-tight">5-4-3-2-1<br/>Grounding</span>
          </button>

          <button
            onClick={onChat}
            aria-label="Talk to Bandhu AI companion"
            className="bg-surface-container-highest text-on-surface rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 shadow-sm border border-white/40 active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
              <span className="material-symbols-outlined text-on-surface-variant">chat_bubble</span>
            </div>
            <span className="text-[16px] font-medium text-center">Talk to Bandhu</span>
          </button>

          <button
            aria-label="Get a motivational note"
            className="bg-secondary-fixed text-on-secondary-fixed rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 shadow-sm border border-white/40 active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
              <span className="material-symbols-outlined text-secondary">favorite</span>
            </div>
            <span className="text-[16px] font-medium text-center leading-tight">Motivational<br/>Note</span>
          </button>
        </div>
      </main>

      {/* Reassurance footer */}
      <footer className="w-full text-center pb-8 px-6 z-10">
        <p className="text-[16px] font-normal text-on-surface-variant italic opacity-80 tracking-wide">
          "You are safe. This feeling will pass."
        </p>
      </footer>
    </div>
  );
}
