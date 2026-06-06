import { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Onboarding({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('jee');
  const [studyHours, setStudyHours] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [challenge, setChallenge] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [confidence, setConfidence] = useState<string>('');

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else handleFinish();
  };

  const handleFinish = async () => {
    if (!auth.currentUser) {
      onContinue();
      return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: firstName || 'Friend',
        age: age,
        exam: selectedExam,
        studyHours: Number(studyHours),
        sleepHours: Number(sleepHours),
        biggestAcademicConcern: challenge,
        onboardingMood: mood,
        onboardingConfidence: confidence,
        onboardingComplete: true
      });
      onContinue();
    } catch (err) {
      console.error(err);
      onContinue(); // fallback
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-6 animate-[fadeInUp_0.4s_ease-out_forwards]">
            <h1 className="text-[28px] font-bold text-on-surface leading-tight mb-2">Welcome! Let's get to know you.</h1>
            <div>
              <label className="block text-[14px] font-medium text-on-surface mb-2">First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-outline-variant rounded-xl px-4 py-4 focus:border-primary text-on-surface bg-surface-container-low" placeholder="What should we call you?" />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-on-surface mb-2">Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full border border-outline-variant rounded-xl px-4 py-4 focus:border-primary text-on-surface bg-surface-container-low" placeholder="Your age" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6 w-full animate-[fadeInUp_0.4s_ease-out_forwards]">
            <h1 className="text-[28px] font-bold text-on-surface leading-tight mb-2">Which exam are you preparing for?</h1>
            <div className="grid grid-cols-2 gap-4">
              {['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'Boards', 'Other'].map(exam => (
                <button
                  key={exam}
                  onClick={() => setSelectedExam(exam)}
                  className={`p-4 rounded-2xl border text-left font-bold text-[16px] transition-all 
                  ${selectedExam === exam ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant bg-surface-container-low text-on-surface'}`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-6 animate-[fadeInUp_0.4s_ease-out_forwards]">
            <h1 className="text-[28px] font-bold text-on-surface leading-tight mb-2">Tell us about your routine</h1>
            <div>
              <label className="block text-[14px] font-medium text-on-surface mb-2">Daily Study Hours</label>
              <input type="number" value={studyHours} onChange={e => setStudyHours(e.target.value)} className="w-full border border-outline-variant rounded-xl px-4 py-4 focus:border-primary text-on-surface bg-surface-container-low" placeholder="e.g. 8" />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-on-surface mb-2">Average Sleep Hours</label>
              <input type="number" value={sleepHours} onChange={e => setSleepHours(e.target.value)} className="w-full border border-outline-variant rounded-xl px-4 py-4 focus:border-primary text-on-surface bg-surface-container-low" placeholder="e.g. 6" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6 w-full animate-[fadeInUp_0.4s_ease-out_forwards]">
            <h1 className="text-[28px] font-bold text-on-surface leading-tight mb-2">What is your biggest challenge right now?</h1>
            <div className="flex flex-col gap-3">
              {['Exam Anxiety', 'Lack of Motivation', 'Burnout', 'Fear of Failure', 'Parent Pressure', 'Time Management', 'Focus Issues'].map(item => (
                <button
                  key={item}
                  onClick={() => setChallenge(item)}
                  className={`p-4 rounded-xl border text-left font-medium transition-all
                  ${challenge === item ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant bg-surface-container-low text-on-surface'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-6 animate-[fadeInUp_0.4s_ease-out_forwards]">
            <h1 className="text-[28px] font-bold text-on-surface leading-tight mb-2">How are you feeling today?</h1>
            <div>
              <label className="block text-[14px] font-medium text-on-surface mb-4">Current Mood</label>
              <div className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {['😊', '😌', '😣', '⭐', '😅', '⚡'].map((emoji) => (
                  <button 
                    key={emoji}
                    onClick={() => setMood(emoji)}
                    className={`w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-3xl shadow-sm transition-transform ${mood === emoji ? 'bg-primary border-4 border-surface-container-lowest ring-2 ring-primary scale-110' : 'bg-surface-container hover:scale-105'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-medium text-on-surface mb-4 mt-6">Confidence Level</label>
              <input type="range" min="1" max="100" value={confidence || "50"} onChange={(e) => setConfidence(e.target.value)} className="w-full accent-primary h-2 bg-surface-container-high rounded-full outline-none" />
              <div className="flex justify-between mt-2 text-on-surface-variant text-[12px] font-medium">
                  <span>Low</span>
                  <span>High</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col pt-8 pb-32 px-6 relative z-10 w-full h-full bg-background transition-colors duration-500">
      <header className="flex items-center justify-between mb-8 w-full">
         <button onClick={() => setStep(step > 1 ? step - 1 : 1)} className={`w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-variant transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
             <span className="material-symbols-outlined text-on-surface">arrow_back</span>
         </button>
         <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : i < step ? 'bg-primary' : 'bg-surface-variant'}`} />
            ))}
         </div>
         <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 flex flex-col w-full">
        {renderStep()}
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pt-12 pb-8 flex justify-center z-50">
        <button 
          onClick={nextStep}
          disabled={loading || (step === 1 && !firstName) || (step === 4 && !challenge) || (step === 5 && !mood)}
          className="w-full max-w-sm bg-primary text-on-primary rounded-full py-4 text-[16px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Initializing Profile...' : step === 5 ? 'Start Journey' : 'Continue'}
          {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
        </button>
      </div>
    </div>
  );
}
