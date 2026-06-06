import { ScreenType } from '../types';

interface NavProps {
  current: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export default function BottomNav({ current, onNavigate }: NavProps) {
  const isActive = (screens: ScreenType[]) => screens.includes(current);

  return (
    <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/20 shadow-lg rounded-full px-6 py-3 min-w-[320px] justify-between">
      <button 
        onClick={() => onNavigate('home')}
        aria-label="Home" 
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${isActive(['home', 'bubbles', 'wrapped']) ? 'bg-inverse-surface text-inverse-on-surface scale-105' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive(['home', 'bubbles', 'wrapped']) ? "'FILL' 1" : "'FILL' 0" }}>home</span>
      </button>

      <button 
        onClick={() => onNavigate('tribe')}
        aria-label="Study Tribe" 
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${isActive(['tribe']) ? 'bg-inverse-surface text-inverse-on-surface scale-105' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive(['tribe']) ? "'FILL' 1" : "'FILL' 0" }}>group</span>
      </button>
      
      <button 
        onClick={() => onNavigate('boss')}
        aria-label="Stress Boss" 
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${isActive(['boss', 'confession']) ? 'bg-inverse-surface text-inverse-on-surface scale-105' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive(['boss', 'confession']) ? "'FILL' 1" : "'FILL' 0" }}>bedtime</span>
      </button>

      <button 
        onClick={() => onNavigate('insights')}
        aria-label="Insights" 
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${isActive(['insights']) ? 'bg-inverse-surface text-inverse-on-surface scale-105' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive(['insights']) ? "'FILL' 1" : "'FILL' 0" }}>psychology</span>
      </button>

      <button 
        onClick={() => onNavigate('snaps')}
        aria-label="Emotion Snaps" 
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${isActive(['snaps', 'twins']) ? 'bg-inverse-surface text-inverse-on-surface scale-105' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive(['snaps', 'twins']) ? "'FILL' 1" : "'FILL' 0" }}>person</span>
      </button>
    </nav>
  );
}
