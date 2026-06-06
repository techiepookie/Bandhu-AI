import { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenType } from './types';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';

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

/** Screens that should NOT display the bottom navigation bar. */
const HIDE_NAV_SCREENS: ScreenType[] = ['login', 'register', 'onboarding', 'chat', 'sos', 'journal'];

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('login');
  const [loading, setLoading] = useState(true);
  // Track whether we have already resolved the initial auth state to prevent
  // re-subscribing the listener on every screen navigation (efficiency fix).
  const authResolved = useRef(false);

  const navigate = useCallback((s: ScreenType) => setScreen(s), []);

  useEffect(() => {
    // Subscribe to auth state changes ONCE — the listener is stable because
    // we use a ref to track the initial resolution, not `screen` as a dep.
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (authResolved.current) {
        // After the first resolution, only handle sign-out
        if (!user) setScreen('login');
        return;
      }
      authResolved.current = true;

      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && snap.data().onboardingComplete) {
            setScreen('home');
          } else {
            setScreen('onboarding');
          }
        } catch {
          setScreen('onboarding');
        }
      } else {
        setScreen('login');
      }
      setLoading(false);
    });

    return () => unsub();
    // Empty dep array: subscribe once on mount, unsubscribe on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div
        className="w-full min-h-screen bg-surface-container-high flex flex-col items-center justify-center text-on-surface gap-4"
        role="status"
        aria-label="Loading Bandhu"
      >
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-sm text-on-surface-variant font-medium">Loading Bandhu...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-surface-container-high flex justify-center overflow-auto sm:py-6">
      <div
        className="w-full max-w-md bg-background relative flex flex-col shadow-2xl overflow-hidden text-on-background font-body sm:rounded-[3rem] sm:border-[8px] border-surface-container-highest"
        style={{ height: '100dvh', maxHeight: '900px' }}
      >
        {screen === 'login'      && <Login onNavigate={navigate} onSuccess={() => navigate('onboarding')} />}
        {screen === 'register'   && <Register onNavigate={navigate} onSuccess={() => navigate('onboarding')} />}
        {screen === 'onboarding' && <Onboarding onContinue={() => navigate('home')} />}

        {/* Core navigable screens */}
        {screen === 'home'     && <Home onNavigate={navigate} />}
        {screen === 'tribe'    && <StudyTribe onNavigate={navigate} />}
        {screen === 'boss'     && <StressBoss onNavigate={navigate} />}
        {screen === 'insights' && <Insights onNavigate={navigate} />}
        {screen === 'snaps'    && <EmotionSnaps onNavigate={navigate} />}

        {/* Sub-screens */}
        {screen === 'chat'       && <Chat onBack={() => navigate('home')} />}
        {screen === 'sos'        && <SOS onBack={() => navigate('home')} onChat={() => navigate('chat')} />}
        {screen === 'journal'    && <Journal onBack={() => navigate('home')} />}
        {screen === 'bubbles'    && <BubbleDashboard onNavigate={navigate} />}
        {screen === 'wrapped'    && <WeeklyWrapped onNavigate={navigate} />}
        {screen === 'future_me'  && <FutureMe onNavigate={navigate} />}
        {screen === 'twins'      && <DigitalTwin onNavigate={navigate} />}
        {screen === 'confession' && <ConfessionBooth onNavigate={navigate} />}

        {/* Global bottom nav — only on core dashboard views */}
        {!HIDE_NAV_SCREENS.includes(screen) && (
          <BottomNav current={screen} onNavigate={navigate} />
        )}
      </div>
    </div>
  );
}
