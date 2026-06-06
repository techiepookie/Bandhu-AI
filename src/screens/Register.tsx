import { useState } from 'react';
import type { FormEvent } from 'react';
import { ScreenType } from '../types';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getHumanErrorMessage } from '../utils/error';

interface RegisterProps {
  onNavigate: (s: ScreenType) => void;
  onSuccess: () => void;
}

export default function Register({ onNavigate, onSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
        setError('Password should be at least 6 characters');
        return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const userRef = doc(db, 'users', userCred.user.uid);
      await setDoc(userRef, {
        name: formData.name,
        email: formData.email,
        energyScore: 82,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(getHumanErrorMessage(err, 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-8 pb-12 px-6 w-full h-full text-left overflow-y-auto no-scrollbar">
      <button onClick={() => onNavigate('login')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low mb-6">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <h1 className="text-[28px] font-bold text-on-surface mb-2">Create Account</h1>
      <p className="text-[16px] text-on-surface-variant mb-6">Join Bandhu to start your wellness journey.</p>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label htmlFor="name-input" className="block text-[14px] font-medium text-on-surface mb-1">Full Name</label>
            <input id="name-input" aria-required="true" required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] text-on-surface focus:border-primary disabled:opacity-50" placeholder="e.g. Nikhil" disabled={loading} />
        </div>
        
        <div>
            <label htmlFor="email-input-reg" className="block text-[14px] font-medium text-on-surface mb-1">Email</label>
            <input id="email-input-reg" aria-required="true" required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] text-on-surface focus:border-primary disabled:opacity-50" placeholder="Email Address" disabled={loading} />
        </div>

        <div>
            <label htmlFor="pw-input-reg" className="block text-[14px] font-medium text-on-surface mb-1">Password</label>
            <input id="pw-input-reg" aria-required="true" required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] text-on-surface focus:border-primary disabled:opacity-50" placeholder="Create a password" disabled={loading} />
        </div>

        <div>
            <label htmlFor="pw-confirm-reg" className="block text-[14px] font-medium text-on-surface mb-1">Confirm Password</label>
            <input id="pw-confirm-reg" aria-required="true" required type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[16px] text-on-surface focus:border-primary disabled:opacity-50" placeholder="Confirm your password" disabled={loading} />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-primary text-on-primary rounded-full py-4 text-[16px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform shadow-primary/20 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Continue to Profile'}
        </button>
        <p className="text-center text-[14px] mt-4 text-on-surface-variant">
            Already have an account? <span onClick={() => onNavigate('login')} className="font-bold text-primary cursor-pointer hover:underline" tabIndex={0} role="button">Log in</span>
        </p>
      </form>
    </div>
  );
}
