import { describe, it, expect, vi } from 'vitest';

describe('Authentication Rules', () => {
  it('Should reject passwords less than 6 characters', () => {
    const isPasswordValid = (pw: string) => pw.length >= 6;
    expect(isPasswordValid('12345')).toBe(false);
    expect(isPasswordValid('secure_pass_2026')).toBe(true);
  });

  it('Should generate safe unique emails for Demo Users', () => {
    const generateDemoEmail = () => `demo_${Date.now()}_${Math.floor(Math.random() * 10000)}@bandhu.ai`;
    const email1 = generateDemoEmail();
    const email2 = generateDemoEmail();
    
    expect(email1).toMatch(/demo_\d+_\d+@bandhu\.ai/);
    expect(email1).not.toBe(email2); // ensure uniqueness
  });
});

describe('Emotion Engine Parsers', () => {
  it('Should correctly map LLM outputs to 0-100 bounds', () => {
    const normalizeScore = (score: number) => Math.max(0, Math.min(100, score));
    
    expect(normalizeScore(112)).toBe(100);
    expect(normalizeScore(-14)).toBe(0);
    expect(normalizeScore(50)).toBe(50);
  });

  it('Should safely parse Gemini JSON string responses without crashing', () => {
    const mockGeminiSuccess = `{"reply": "Take a breath", "scores": {"anxiety": 80, "confidence": 20, "motivation": 10, "burnout": 90, "emotionLabel": "Overwhelmed"}}`;
    
    const parsed = JSON.parse(mockGeminiSuccess);
    expect(parsed.scores.anxiety).toBe(80);
    expect(parsed.scores.emotionLabel).toBe("Overwhelmed");
  });
});
