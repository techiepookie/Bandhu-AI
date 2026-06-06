import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import 'dotenv/config';

// ─────────────────────────────────────────────────────────────
// Input length constants (mirrors Firestore rules + client guards)
// ─────────────────────────────────────────────────────────────
const MAX_CHAT_MESSAGE_LENGTH  = 2000;
const MAX_JOURNAL_TEXT_LENGTH  = 10_000;
const MAX_NAME_FIELD_LENGTH    = 100;
const MAX_EXAM_FIELD_LENGTH    = 100;

// ─────────────────────────────────────────────────────────────
// GoogleGenAI singleton — created once at module load,
// not on every request (efficiency improvement).
// ─────────────────────────────────────────────────────────────
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment.');
  if (!ai) ai = new GoogleGenAI({ apiKey });
  return ai;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Safely parse JSON returned by the Gemini API. */
function safeParseJson(text: string): object {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON returned from AI model.');
  }
}

/** Middleware: ensure request Content-Type is application/json. */
function requireJson(req: Request, res: Response, next: NextFunction) {
  if (!req.is('application/json')) {
    res.status(415).json({ error: 'Content-Type must be application/json.' });
    return;
  }
  next();
}

// ─────────────────────────────────────────────────────────────
// Server bootstrap
// ─────────────────────────────────────────────────────────────
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ── POST /api/chat ──────────────────────────────────────────
  app.post('/api/chat', requireJson, async (req: Request, res: Response) => {
    try {
      const { message, context, userName, exam } = req.body;

      // Input validation
      if (typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ error: 'message is required and must be a non-empty string.' });
        return;
      }
      if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
        res.status(400).json({ error: `message must not exceed ${MAX_CHAT_MESSAGE_LENGTH} characters.` });
        return;
      }
      if (userName && typeof userName === 'string' && userName.length > MAX_NAME_FIELD_LENGTH) {
        res.status(400).json({ error: `userName must not exceed ${MAX_NAME_FIELD_LENGTH} characters.` });
        return;
      }
      if (exam && typeof exam === 'string' && exam.length > MAX_EXAM_FIELD_LENGTH) {
        res.status(400).json({ error: `exam must not exceed ${MAX_EXAM_FIELD_LENGTH} characters.` });
        return;
      }

      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are Bandhu, a supportive study companion, motivational friend, exam mentor, and mental wellness guide for Indian students.
User Details: Name: ${userName || 'Friend'}, Target Exam: ${exam || 'Unknown'}.
Context/Chat History: ${context || 'None'}
Student message: ${message}

Instructions:
1. Provide a reply to the student. Be deeply empathetic, non-judgmental, and human-like. Use emojis naturally (😊🌱✨📚💪).
2. Reference their name and exam. Give personalized suggestions.
3. Reply in a natural mix of friendly Hinglish (Hindi + English) or English.
4. Additionally, assess their current emotional state based on their message, giving scores from 0-100 for anxiety, confidence, motivation, and burnout, and picking one primary emotion label.

You MUST respond strictly in the requested JSON format.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  anxiety:      { type: Type.INTEGER },
                  confidence:   { type: Type.INTEGER },
                  motivation:   { type: Type.INTEGER },
                  burnout:      { type: Type.INTEGER },
                  emotionLabel: { type: Type.STRING  },
                },
                required: ['anxiety', 'confidence', 'motivation', 'burnout', 'emotionLabel'],
              },
            },
            required: ['reply', 'scores'],
          },
        },
      });

      res.json(safeParseJson(response.text));
    } catch (err: any) {
      console.error('[/api/chat]', err);
      res.status(500).json({ error: err.message ?? 'Internal server error.' });
    }
  });

  // ── POST /api/journal ───────────────────────────────────────
  app.post('/api/journal', requireJson, async (req: Request, res: Response) => {
    try {
      const { text } = req.body;

      // Input validation
      if (typeof text !== 'string' || text.trim().length === 0) {
        res.status(400).json({ error: 'text is required and must be a non-empty string.' });
        return;
      }
      if (text.length > MAX_JOURNAL_TEXT_LENGTH) {
        res.status(400).json({ error: `text must not exceed ${MAX_JOURNAL_TEXT_LENGTH} characters.` });
        return;
      }

      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Extract the following information from this student's journal entry:
        1. emotion: A single word emotion (e.g., Anxious, Motivated, Burnout, Happy)
        2. stressTrigger: What is causing them stress? (short phrase)
        3. confidenceLevel: Low, Medium, or High
        4. energy: Low, Medium, or High
        
        Journal Entry: "${text}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              emotion:         { type: Type.STRING },
              stressTrigger:   { type: Type.STRING },
              confidenceLevel: { type: Type.STRING },
              energy:          { type: Type.STRING },
            },
            required: ['emotion', 'stressTrigger', 'confidenceLevel', 'energy'],
          },
        },
      });

      res.json(safeParseJson(response.text));
    } catch (err: any) {
      console.error('[/api/journal]', err);
      res.status(500).json({ error: err.message ?? 'Internal server error.' });
    }
  });

  // ── POST /api/future ────────────────────────────────────────
  app.post('/api/future', requireJson, async (req: Request, res: Response) => {
    try {
      const { name, exam } = req.body;

      // Input validation (fields are optional but bounded when present)
      if (name && typeof name === 'string' && name.length > MAX_NAME_FIELD_LENGTH) {
        res.status(400).json({ error: `name must not exceed ${MAX_NAME_FIELD_LENGTH} characters.` });
        return;
      }
      if (exam && typeof exam === 'string' && exam.length > MAX_EXAM_FIELD_LENGTH) {
        res.status(400).json({ error: `exam must not exceed ${MAX_EXAM_FIELD_LENGTH} characters.` });
        return;
      }

      const safeName = (typeof name === 'string' && name.trim()) || 'Friend';
      const safeExam = (typeof exam === 'string' && exam.trim()) || 'your exam';

      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a highly emotional, motivating 3-4 sentence message from the future self of a student named ${safeName} who has successfully cleared the ${safeExam} exam. Tell them that the late nights and stress were worth it. Write it in friendly Hinglish (Hindi + English) as if a friend is talking to them. Don't use quotes around the text.`,
      });

      res.json({ message: response.text });
    } catch (err: any) {
      console.error('[/api/future]', err);
      res.status(500).json({ error: err.message ?? 'Internal server error.' });
    }
  });

  // ── Static / Vite middleware ────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bandhu server running on http://localhost:${PORT}`);
  });
}

startServer();
