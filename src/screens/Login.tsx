import { useState } from 'react';
import { ScreenType } from '../types';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getHumanErrorMessage } from '../utils/error';

interface LoginProps {
  onNavigate: (s: ScreenType) => void;
  onSuccess: () => void;
}

export default function Login({ onNavigate, onSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(getHumanErrorMessage(err, 'Could not log in. Check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, 'users', userCred.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: userCred.user.displayName || 'Friend',
          email: userCred.user.email,
          energyScore: 82,
          exam: "JEE", // default fallback
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(getHumanErrorMessage(err, 'Google Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { collection, addDoc, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      // Generate a unique demo account to bypass anonymous auth restrictions
      const demoEmail = `demo_${Date.now()}_${Math.floor(Math.random() * 10000)}@bandhu.ai`;
      const demoPassword = 'demo123456';
      const userCred = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
      const uid = userCred.user.uid;
      
      // Update the user profile
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        name: 'Nikhil',
        email: demoEmail,
        exam: 'JEE',
        energyScore: 88,
        onboardingComplete: true, // skip onboarding for demo
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Insert some mock moods
      const moodsRef = collection(db, `users/${uid}/moods`);
      await addDoc(moodsRef, { emoji: '😌', createdAt: new Date(Date.now() - 86400000 * 1) });
      await addDoc(moodsRef, { emoji: '😊', createdAt: new Date(Date.now() - 86400000 * 2) });
      await addDoc(moodsRef, { emoji: '😣', createdAt: new Date(Date.now() - 86400000 * 3) });
      await addDoc(moodsRef, { emoji: '⭐', createdAt: new Date(Date.now() - 86400000 * 4) });
      
      // Insert some mock journals
      const journalsRef = collection(db, `users/${uid}/journals`);
      await addDoc(journalsRef, { emotion: 'Anxious', content: 'Feeling stressed about mock tests.', createdAt: new Date(Date.now() - 86400000 * 1) });
      await addDoc(journalsRef, { emotion: 'Calm', content: 'Had a breakthrough in Physics today.', createdAt: new Date(Date.now() - 86400000 * 2) });
      await addDoc(journalsRef, { emotion: 'Focus', content: 'Studied for 8 hours without distraction.', createdAt: new Date(Date.now() - 86400000 * 3) });
      await addDoc(journalsRef, { emotion: 'Burnout', content: 'Too tired to continue right now.', createdAt: new Date(Date.now() - 86400000 * 4) });

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(getHumanErrorMessage(err, 'Demo Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-12 pb-12 px-6 w-full h-full justify-center items-center text-center overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-center gap-2 text-primary-container mb-8">
        <svg fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="48">
          <path d="M12 22c-4-4-6-8.5-6-13a6 6 0 0 1 12 0c0 4.5-2 9-6 13z"></path>
          <path d="M12 22V9"></path>
          <path d="M12 15c-2-2-4-2-4-2"></path>
          <path d="M12 11c2-2 4-2 4-2"></path>
        </svg>
      </div>

      <h1 className="text-[40px] font-bold text-primary mb-2">Bandhu</h1>
      <p className="text-[18px] text-on-surface-variant mb-8 max-w-[250px]">Your calm space in the exam chaos.</p>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-[14px] w-full">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="w-full flex flex-col gap-4 mb-6">
        <label htmlFor="email-input" className="sr-only">Email Address</label>
        <input 
          id="email-input"
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          aria-required="true"
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-4 text-[16px] text-on-surface focus:border-primary disabled:opacity-50 text-left"
        />
        <label htmlFor="password-input" className="sr-only">Password</label>
        <input 
          id="password-input"
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          aria-required="true"
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-4 text-[16px] text-on-surface focus:border-primary disabled:opacity-50 text-left"
        />
        <button 
          type="submit"
          disabled={loading}
          aria-label="Log in to Bandhu"
          className="w-full bg-primary text-on-primary rounded-full py-4 text-[16px] font-bold flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 shadow-primary/20 mt-2"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="flex items-center gap-4 w-full mb-6">
        <div className="flex-1 h-[1px] bg-outline-variant/50"></div>
        <span className="text-[12px] font-medium text-on-surface-variant uppercase">OR</span>
        <div className="flex-1 h-[1px] bg-outline-variant/50"></div>
      </div>

      <button 
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        aria-label="Secure One-Click Demo Login"
        className="w-full bg-[#1A1A1A] text-white rounded-full py-4 text-[16px] font-bold flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 mb-4"
      >
        <span className="material-symbols-outlined" aria-hidden="true">rocket_launch</span>
        One-Click Demo Login
      </button>

      <button 
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        aria-label="Continue with Google"
        className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-full py-4 text-[16px] font-bold flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google Logo" className="w-6 h-6 object-contain" />
        Continue with Google
      </button>

      <p className="text-center text-[14px] mt-8 text-on-surface-variant">
        Don't have an account? <span onClick={() => onNavigate('register')} className="font-bold text-primary cursor-pointer hover:underline">Sign up</span>
      </p>
    </div>
  );
}
