import { useState, useEffect } from 'react';
import { ScreenType } from './types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Login from './screens/Login';
import Register from './screens/Register';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Chat from './screens/Chat';
import SOS from './screens/SOS';
import Journal from './screens/Journal';
import ConfessionBooth from './screens/ConfessionBooth';
import DigitalTwin from './screens/DigitalTwin';
import EmotionSnaps from './screens/EmotionSnaps';
import Insights from './screens/Insights';
import FutureMe from './screens/FutureMe';
import StudyTribe from './screens/StudyTribe';
import BubbleDashboard from './screens/BubbleDashboard';
import WeeklyWrapped from './screens/WeeklyWrapped';
import StressBoss from './screens/StressBoss';
import BottomNav from './components/BottomNav';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (screen === 'login' || screen === 'register') {
          // Verify if they have completed onboarding
          import('firebase/firestore').then(({ getDoc, doc }) => {
            import('./firebase').then(({ db }) => {
               getDoc(doc(db, 'users', user.uid)).then((snap) => {
                 if (snap.exists() && snap.data().onboardingComplete) {
                   setScreen('home');
                 } else {
                   setScreen('onboarding');
                 }
               }).catch(() => setScreen('onboarding'));
            });
          });
        }
      } else {
        if (screen !== 'register') {
            setScreen('login');
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [screen]);

  if (loading) {
    return <div className="w-full min-h-screen bg-surface-container-high flex items-center justify-center text-on-surface">Loading...</div>;
  }

  const hideNavScreens: ScreenType[] = ['login', 'register', 'onboarding', 'chat', 'sos', 'journal'];

  return (
    <div className="w-full min-h-screen bg-surface-container-high flex justify-center overflow-auto sm:py-6">
      <div 
        className="w-full max-w-md bg-background relative flex flex-col shadow-2xl overflow-hidden text-on-background font-body sm:rounded-[3rem] sm:border-[8px] border-surface-container-highest"
        style={{ height: '100dvh', maxHeight: '900px' }}
      >
        {screen === 'login' && <Login onNavigate={setScreen} onSuccess={() => setScreen('onboarding')} />}
        {screen === 'register' && <Register onNavigate={setScreen} onSuccess={() => setScreen('onboarding')} />}
        {screen === 'onboarding' && <Onboarding onContinue={() => setScreen('home')} />}
        
        {/* Core Navigable Screens */}
        {screen === 'home' && <Home onNavigate={setScreen} />}
        {screen === 'tribe' && <StudyTribe onNavigate={setScreen} />}
        {screen === 'boss' && <StressBoss onNavigate={setScreen} />}
        {screen === 'insights' && <Insights onNavigate={setScreen} />}
        {screen === 'snaps' && <EmotionSnaps onNavigate={setScreen} />}
        
        {/* Sub-screens mapped out */}
        {screen === 'chat' && <Chat onBack={() => setScreen('home')} />}
        {screen === 'sos' && <SOS onBack={() => setScreen('home')} onChat={() => setScreen('chat')} />}
        {screen === 'journal' && <Journal onBack={() => setScreen('home')} />}
        {screen === 'bubbles' && <BubbleDashboard onNavigate={setScreen} />}
        {screen === 'wrapped' && <WeeklyWrapped onNavigate={setScreen} />}
        {screen === 'future_me' && <FutureMe onNavigate={setScreen} />}
        {screen === 'twins' && <DigitalTwin onNavigate={setScreen} />}
        {screen === 'confession' && <ConfessionBooth onNavigate={setScreen} />}

        {/* Global Bottom Navigation only on core dashboard views */}
        {!hideNavScreens.includes(screen) && (
          <BottomNav current={screen} onNavigate={(s) => setScreen(s)} />
        )}
      </div>
    </div>
  );
}


