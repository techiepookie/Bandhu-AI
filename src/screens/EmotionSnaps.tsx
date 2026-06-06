import { useState, useRef, useEffect } from 'react';
import { ScreenType } from '../types';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

export default function EmotionSnaps({ onNavigate }: ViewProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    setShowCamera(true);
    setPhoto(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please ensure permissions are granted.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
       if (stream) {
           stream.getTracks().forEach(track => track.stop());
       }
    };
  }, [stream]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full pb-32 bg-background">
      {/* Camera Full Screen Overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
           <div className="absolute top-0 w-full p-6 flex justify-end z-50">
               <button onClick={stopCamera} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                   <span className="material-symbols-outlined">close</span>
               </button>
           </div>
           <video ref={videoRef} autoPlay playsInline className="flex-1 w-full h-full object-cover" />
           <div className="absolute bottom-10 w-full flex justify-center z-50">
               <button onClick={capturePhoto} className="w-20 h-20 bg-white/30 rounded-full border-4 border-white flex justify-center items-center backdrop-blur-md">
                   <div className="w-14 h-14 bg-white rounded-full"></div>
               </button>
           </div>
           <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Main UI */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4">
        <button onClick={() => onNavigate('home')} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-[24px] font-bold text-primary tracking-tight">Bandhu</h1>
        <div className="w-10"></div>
      </header>

      <main className="px-6 mt-6">
        <section className="mb-8">
          <h2 className="text-[32px] font-bold text-on-background leading-tight">Emotion Snaps</h2>
          <p className="text-[16px] text-on-surface-variant mt-2">Your visual journey</p>
        </section>

        <section className="columns-2 gap-4">
          {photo && (
            <article className="break-inside-avoid mb-4 shadow-sm bg-surface-container-lowest rounded-2xl overflow-hidden relative group cursor-pointer transition-transform hover:-translate-y-1">
              <div className="relative">
                <img alt="Recent capture" className="w-full h-auto object-cover" src={photo} />
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-[12px] shadow-sm flex items-center gap-1 font-semibold">
                  ✨ Just now
                </div>
              </div>
              <div className="p-3">
                <p className="font-handwriting text-[18px] text-on-surface-variant leading-tight">Living in the moment.</p>
              </div>
            </article>
          )}

          <article className="break-inside-avoid mb-4 shadow-sm bg-surface-container-lowest rounded-2xl overflow-hidden relative group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="relative">
              <img alt="Beach at sunset" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida/AP1WRLt6AZe31m1M5Wv3DSWb8M8YGwQrgLIrLx4xQ79rsrjTHNc7sH0wfw1T4ILK5vcXKZ1hAKT62W3zmilGT8SwSXVUhQgZLXPJ9Ebi4CymWDuyxODSivl5ezW4rnPakKNO6JQ3cEQDD6W-EMPOfCNcuMKwkPr4E3S1Xahbe9os8u7D1cs4MEroWxpGyDhqrv2EClQFT6_suxtyZE1eyWRb7RTROPM7KcOPdfS0l4JN945zT0fQfXkTeQG_amxd" />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-[12px] shadow-sm flex items-center gap-1 font-semibold">
                🌊 Calm
              </div>
            </div>
            <div className="p-3">
              <p className="font-handwriting text-[18px] text-on-surface-variant leading-tight">Morning walk cleared my head completely.</p>
            </div>
          </article>

          <article className="break-inside-avoid mb-4 shadow-sm bg-primary-container rounded-2xl overflow-hidden relative group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="p-5 text-center flex flex-col items-center justify-center min-h-[140px]">
              <span className="material-symbols-outlined text-[32px] text-on-primary-container mb-2 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <p className="text-[16px] font-semibold text-on-primary-container">Took 10 deep breaths today.</p>
              <div className="mt-3 bg-white/40 backdrop-blur-sm rounded-full px-3 py-1 text-[12px] shadow-sm text-on-primary-container font-semibold">
                🌱 Growth
              </div>
            </div>
          </article>

          <article className="break-inside-avoid mb-4 shadow-sm bg-surface-container-lowest rounded-2xl overflow-hidden relative group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="relative">
              <img alt="Cozy dog" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida/AP1WRLsat1jXbzfFO4Hs-saGj4cJyTBQ2qBf4RrTKVnCRjrJCV-WtyqMt8wwH8gUxc1uI8QD8XBHRIO-US6_rha4mjM2eg1_rT_1GmK1aWGq56LgD4B3Z6wfru3mXa3A4kdxNmQnTcoQTmeTXVuTOBWMSJwFPM1QEAFCzRg6c21-mFbq_BwuxtZquwHvCZu0cAUZO3AafXKa6BSUhypfgWhXmLpS4F0LDVLbvXqJLHwiCjHfZvrNXHWbnXoTI6U" />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-[12px] shadow-sm flex items-center gap-1 font-semibold">
                💛 Loved
              </div>
            </div>
            <div className="p-3">
              <p className="font-handwriting text-[18px] text-on-surface-variant leading-tight">Snuggles.</p>
            </div>
          </article>

          <article className="break-inside-avoid mb-4 shadow-sm bg-surface-container-lowest rounded-2xl overflow-hidden relative group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="relative">
              <div className="w-full h-32 bg-gradient-to-br from-tertiary-fixed to-secondary-fixed-dim rounded-t-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[40px] text-white/70" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
              </div>
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-[12px] shadow-sm flex items-center gap-1 font-semibold">
                🎧 Inspired
              </div>
            </div>
            <div className="p-3">
              <p className="font-handwriting text-[18px] text-on-surface-variant leading-tight">Found a new ambient playlist.</p>
            </div>
          </article>
        </section>
      </main>

      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-40 px-6 max-w-md mx-auto">
        <button onClick={startCamera} className="bg-primary text-on-primary rounded-full px-6 py-4 shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>camera</span>
          <span className="text-[16px] font-semibold tracking-wide">Capture a moment</span>
        </button>
      </div>
    </div>
  );
}
