import { describe, it, expect } from 'vitest';

// ============================================================
// Auth & Validation Logic
// ============================================================
describe('Authentication Rules', () => {
  it('should reject passwords shorter than 6 characters', () => {
    const isPasswordValid = (pw: string) => pw.length >= 6;
    expect(isPasswordValid('12345')).toBe(false);
    expect(isPasswordValid('secure_pass_2026')).toBe(true);
    expect(isPasswordValid('abc')).toBe(false);
    expect(isPasswordValid('123456')).toBe(true);
  });

  it('should accept passwords exactly 6 characters (boundary check)', () => {
    const isPasswordValid = (pw: string) => pw.length >= 6;
    expect(isPasswordValid('abcdef')).toBe(true);
    expect(isPasswordValid('abcde')).toBe(false);
  });

  it('should detect password mismatch correctly', () => {
    const passwordsMatch = (a: string, b: string) => a === b;
    expect(passwordsMatch('secure123', 'secure123')).toBe(true);
    expect(passwordsMatch('secure123', 'secure456')).toBe(false);
    expect(passwordsMatch('', '')).toBe(true);
    expect(passwordsMatch(' abc', 'abc')).toBe(false); // whitespace matters
  });

  it('should generate unique demo emails matching the expected format', () => {
    const generateDemoEmail = () =>
      `demo_${Date.now()}_${Math.floor(Math.random() * 10000)}@bandhu.ai`;
    const email1 = generateDemoEmail();
    const email2 = generateDemoEmail();
    expect(email1).toMatch(/^demo_\d+_\d+@bandhu\.ai$/);
    expect(email2).toMatch(/^demo_\d+_\d+@bandhu\.ai$/);
    expect(email1).not.toBe(email2);
  });

  it('should validate email format', () => {
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(isValidEmail('test@bandhu.ai')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });

  it('should reject empty name fields', () => {
    const isValidName = (name: string) => name.trim().length > 0 && name.trim().length <= 100;
    expect(isValidName('')).toBe(false);
    expect(isValidName('   ')).toBe(false);
    expect(isValidName('Nikhil')).toBe(true);
    expect(isValidName('A'.repeat(100))).toBe(true);
    expect(isValidName('A'.repeat(101))).toBe(false);
  });
});

// ============================================================
// Emotion Engine Parsers
// ============================================================
describe('Emotion Engine Parsers', () => {
  it('should correctly clamp scores to 0-100 bounds', () => {
    const normalizeScore = (score: number) => Math.max(0, Math.min(100, score));
    expect(normalizeScore(112)).toBe(100);
    expect(normalizeScore(-14)).toBe(0);
    expect(normalizeScore(50)).toBe(50);
    expect(normalizeScore(0)).toBe(0);
    expect(normalizeScore(100)).toBe(100);
    expect(normalizeScore(100.1)).toBe(100);
  });

  it('should safely parse a valid Gemini JSON chat response', () => {
    const mockResponse = `{"reply":"Take a breath","scores":{"anxiety":80,"confidence":20,"motivation":10,"burnout":90,"emotionLabel":"Overwhelmed"}}`;
    const parsed = JSON.parse(mockResponse);
    expect(parsed.reply).toBe('Take a breath');
    expect(parsed.scores.anxiety).toBe(80);
    expect(parsed.scores.confidence).toBe(20);
    expect(parsed.scores.motivation).toBe(10);
    expect(parsed.scores.burnout).toBe(90);
    expect(parsed.scores.emotionLabel).toBe('Overwhelmed');
  });

  it('should handle Gemini journal analysis response correctly', () => {
    const mockJournalResponse = `{"emotion":"Anxious","stressTrigger":"Mock test results","confidenceLevel":"Low","energy":"Medium"}`;
    const parsed = JSON.parse(mockJournalResponse);
    expect(parsed.emotion).toBe('Anxious');
    expect(parsed.stressTrigger).toBe('Mock test results');
    expect(['Low', 'Medium', 'High']).toContain(parsed.confidenceLevel);
    expect(['Low', 'Medium', 'High']).toContain(parsed.energy);
  });

  it('should handle malformed JSON from AI without crashing', () => {
    const safeJsonParse = (text: string): object | null => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    };
    expect(safeJsonParse('{"valid": true}')).toEqual({ valid: true });
    expect(safeJsonParse('not json')).toBeNull();
    expect(safeJsonParse('')).toBeNull();
    expect(safeJsonParse('{broken:')).toBeNull();
  });

  it('should produce a valid emotion bubble size within min/max bounds', () => {
    const getBubbleSize = (count: number) => Math.min(130, 60 + count * 15);
    expect(getBubbleSize(0)).toBe(60);
    expect(getBubbleSize(1)).toBe(75);
    expect(getBubbleSize(5)).toBe(130); // 60+75=135, capped at 130
    expect(getBubbleSize(10)).toBe(130); // well above cap
    expect(getBubbleSize(0)).toBeGreaterThanOrEqual(60);
    expect(getBubbleSize(100)).toBeLessThanOrEqual(130);
  });

  it('should aggregate emotion counts from journal entries correctly', () => {
    const journals = [
      { emotion: 'Anxious' },
      { emotion: 'Calm' },
      { emotion: 'Anxious' },
      { emotion: 'Focus' },
      { emotion: 'Anxious' },
    ];
    const counts: Record<string, number> = {};
    journals.forEach(({ emotion }) => {
      if (emotion) counts[emotion] = (counts[emotion] || 0) + 1;
    });
    expect(counts['Anxious']).toBe(3);
    expect(counts['Calm']).toBe(1);
    expect(counts['Focus']).toBe(1);
    expect(counts['Burnout']).toBeUndefined();
  });
});

// ============================================================
// Input Validation (Server-side logic replicated as pure fns)
// ============================================================
describe('API Input Validation', () => {
  const MAX_CHAT_LENGTH = 2000;
  const MAX_JOURNAL_LENGTH = 10000;
  const MAX_NAME_LENGTH = 100;

  it('should reject chat messages exceeding max length', () => {
    const isValidChatMessage = (msg: string) =>
      typeof msg === 'string' && msg.trim().length > 0 && msg.length <= MAX_CHAT_LENGTH;
    expect(isValidChatMessage('Hello')).toBe(true);
    expect(isValidChatMessage('')).toBe(false);
    expect(isValidChatMessage('   ')).toBe(false);
    expect(isValidChatMessage('A'.repeat(MAX_CHAT_LENGTH))).toBe(true);
    expect(isValidChatMessage('A'.repeat(MAX_CHAT_LENGTH + 1))).toBe(false);
  });

  it('should reject journal text exceeding max length', () => {
    const isValidJournal = (text: string) =>
      typeof text === 'string' && text.trim().length > 0 && text.length <= MAX_JOURNAL_LENGTH;
    expect(isValidJournal('Today I felt anxious...')).toBe(true);
    expect(isValidJournal('')).toBe(false);
    expect(isValidJournal('A'.repeat(MAX_JOURNAL_LENGTH))).toBe(true);
    expect(isValidJournal('A'.repeat(MAX_JOURNAL_LENGTH + 1))).toBe(false);
  });

  it('should reject name/exam fields exceeding max length', () => {
    const isValidField = (val: string) =>
      typeof val === 'string' && val.trim().length > 0 && val.length <= MAX_NAME_LENGTH;
    expect(isValidField('Nikhil')).toBe(true);
    expect(isValidField('JEE')).toBe(true);
    expect(isValidField('')).toBe(false);
    expect(isValidField('A'.repeat(MAX_NAME_LENGTH))).toBe(true);
    expect(isValidField('A'.repeat(MAX_NAME_LENGTH + 1))).toBe(false);
  });

  it('should strip dangerous characters from user input (XSS prevention)', () => {
    const sanitize = (input: string) =>
      input.replace(/<[^>]*>/g, '').trim();
    expect(sanitize('<script>alert(1)</script>')).toBe('alert(1)'); // tags stripped, inner text preserved
    expect(sanitize('<b>Hello</b>')).toBe('Hello');
    expect(sanitize('Normal text')).toBe('Normal text');
    expect(sanitize('  spaces  ')).toBe('spaces');
  });
});

// ============================================================
// Navigation State Machine
// ============================================================
describe('Navigation State Machine', () => {
  type ScreenType = 'login' | 'register' | 'onboarding' | 'home' | 'chat' | 'sos' |
    'journal' | 'twins' | 'confession' | 'snaps' | 'insights' | 'future_me' |
    'tribe' | 'bubbles' | 'wrapped' | 'boss';

  const hideNavScreens: ScreenType[] = ['login', 'register', 'onboarding', 'chat', 'sos', 'journal'];
  const shouldShowNav = (screen: ScreenType) => !hideNavScreens.includes(screen);

  it('should hide bottom nav on auth/utility screens', () => {
    expect(shouldShowNav('login')).toBe(false);
    expect(shouldShowNav('register')).toBe(false);
    expect(shouldShowNav('onboarding')).toBe(false);
    expect(shouldShowNav('chat')).toBe(false);
    expect(shouldShowNav('sos')).toBe(false);
    expect(shouldShowNav('journal')).toBe(false);
  });

  it('should show bottom nav on all core dashboard screens', () => {
    expect(shouldShowNav('home')).toBe(true);
    expect(shouldShowNav('tribe')).toBe(true);
    expect(shouldShowNav('boss')).toBe(true);
    expect(shouldShowNav('insights')).toBe(true);
    expect(shouldShowNav('snaps')).toBe(true);
    expect(shouldShowNav('bubbles')).toBe(true);
    expect(shouldShowNav('wrapped')).toBe(true);
    expect(shouldShowNav('future_me')).toBe(true);
    expect(shouldShowNav('twins')).toBe(true);
    expect(shouldShowNav('confession')).toBe(true);
  });

  it('should route authenticated users with completed onboarding to home', () => {
    const getPostAuthScreen = (onboardingComplete: boolean): ScreenType =>
      onboardingComplete ? 'home' : 'onboarding';
    expect(getPostAuthScreen(true)).toBe('home');
    expect(getPostAuthScreen(false)).toBe('onboarding');
  });

  it('should route unauthenticated users to login', () => {
    const getScreenForUnauthUser = (currentScreen: ScreenType): ScreenType =>
      currentScreen !== 'register' ? 'login' : 'register';
    expect(getScreenForUnauthUser('home')).toBe('login');
    expect(getScreenForUnauthUser('insights')).toBe('login');
    expect(getScreenForUnauthUser('register')).toBe('register'); // stay on register
  });
});

// ============================================================
// Energy Score Calculation
// ============================================================
describe('Energy Score Calculation', () => {
  it('should compute energy score within valid 0-100 bounds', () => {
    const computeEnergyScore = (moodCount: number) =>
      Math.min(100, 75 + moodCount * 2);
    expect(computeEnergyScore(0)).toBe(75);
    expect(computeEnergyScore(1)).toBe(77);
    expect(computeEnergyScore(10)).toBe(95);
    expect(computeEnergyScore(20)).toBe(100); // capped
    expect(computeEnergyScore(100)).toBe(100); // still capped
    // All results must be within valid range
    [0, 1, 5, 10, 13, 50].forEach(n => {
      const score = computeEnergyScore(n);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
