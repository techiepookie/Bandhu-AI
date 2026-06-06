import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context, userName, exam } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key missing.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are Bandhu, a supportive study companion, motivational friend, exam mentor, and mental wellness guide for Indian students.
User Details: Name: ${userName || 'Friend'}, Target Exam: ${exam || 'Unknown'}.
Context/Chat History: ${context}
Student message: ${message}

Instructions:
1. Provide a reply to the student. Be deeply empathetic, non-judgmental, and human-like. Use emojis naturally (😊🌱✨📚💪).
2. Reference their name and exam. Give personalized suggestions.
3. Reply in a natural mix of friendly Hinglish (Hindi + English) or English.
4. Additionally, assess their current emotional state based on their message, giving scores from 0-100 for anxiety, confidence, motivation, and burnout, and picking one primary emotion label.

You MUST respond strictly in the requested JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  anxiety: { type: Type.INTEGER },
                  confidence: { type: Type.INTEGER },
                  motivation: { type: Type.INTEGER },
                  burnout: { type: Type.INTEGER },
                  emotionLabel: { type: Type.STRING }
                },
                required: ["anxiety", "confidence", "motivation", "burnout", "emotionLabel"]
              }
            },
            required: ["reply", "scores"]
          }
        }
      });

      res.json(JSON.parse(response.text));
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/journal', async (req, res) => {
    try {
      const { text } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key missing.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Extract the following information from this student's journal entry:
        1. emotion: A single word emotion (e.g., Anxious, Motivated, Burnout, Happy)
        2. stressTrigger: What is causing them stress? (short phrase)
        3. confidenceLevel: Low, Medium, or High
        4. energy: Low, Medium, or High
        
        Journal Entry: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              emotion: { type: Type.STRING },
              stressTrigger: { type: Type.STRING },
              confidenceLevel: { type: Type.STRING },
              energy: { type: Type.STRING },
            },
            required: ["emotion", "stressTrigger", "confidenceLevel", "energy"]
          }
        }
      });

      res.json(JSON.parse(response.text));
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/future', async (req, res) => {
    try {
      const { name, exam } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key missing.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a highly emotional, motivating 3-4 sentence message from the future self of a student named ${name} who has successfully cleared the ${exam} exam. Tell them that the late nights and stress were worth it. Write it in friendly Hinglish (Hindi + English) as if a friend is talking to them. Don't use quotes around the text.`
      });

      res.json({ message: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
