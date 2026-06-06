import { Timestamp } from 'firebase/firestore';

/**
 * All navigable screens within the Bandhu app.
 */
export type ScreenType =
  | 'login'
  | 'register'
  | 'onboarding'
  | 'home'
  | 'chat'
  | 'sos'
  | 'journal'
  | 'twins'
  | 'confession'
  | 'snaps'
  | 'insights'
  | 'future_me'
  | 'tribe'
  | 'bubbles'
  | 'wrapped'
  | 'boss';

/**
 * Firestore user document structure (/users/{userId}).
 */
export interface UserProfile {
  name: string;
  email: string;
  exam?: string;
  energyScore?: number;
  onboardingComplete?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * A single mood log entry (/users/{userId}/moods/{moodId}).
 */
export interface Mood {
  id: string;
  emoji: string;
  createdAt: Timestamp | Date;
}

/**
 * A journal entry with optional AI-analysed fields
 * (/users/{userId}/journals/{journalId}).
 */
export interface JournalEntry {
  id?: string;
  text?: string;
  emotion?: string;
  stressTrigger?: string;
  confidenceLevel?: 'Low' | 'Medium' | 'High';
  energy?: 'Low' | 'Medium' | 'High';
  /** Numeric emotion scores added by the chat AI */
  confidence?: number;
  anxiety?: number;
  motivation?: number;
  burnout?: number;
  content?: string;
  createdAt: Timestamp | Date;
}

/**
 * The shape returned by the Gemini journal analysis API (/api/journal).
 */
export interface JournalAnalysis {
  emotion: string;
  stressTrigger: string;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  energy: 'Low' | 'Medium' | 'High';
}

/**
 * A chat message stored in Firestore (/users/{userId}/chatMessages/{messageId}).
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt: Timestamp | null;
}

/**
 * The emotion score object returned by the Gemini chat API (/api/chat).
 */
export interface EmotionScores {
  anxiety: number;
  confidence: number;
  motivation: number;
  burnout: number;
  emotionLabel: string;
}

/**
 * The full response from the Gemini chat API (/api/chat).
 */
export interface ChatApiResponse {
  reply: string;
  scores: EmotionScores;
}
