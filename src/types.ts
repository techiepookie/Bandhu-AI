export type ScreenType = 'login' | 'register' | 'onboarding' | 'home' | 'chat' | 'sos' | 'journal' | 'twins' | 'confession' | 'snaps' | 'insights' | 'future_me' | 'tribe' | 'bubbles' | 'wrapped' | 'boss';

export interface User {
  name?: string;
  email?: string;
  exam?: string;
  energyLevel?: number;
}


