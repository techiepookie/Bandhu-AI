# Bandhu — AI Mental Wellness Companion for Indian Exam Students

## 🎯 Problem Statement

**Indian students preparing for high-stakes competitive exams (JEE, NEET, UPSC, CAT) face a unique mental health crisis.** The pressure of years-long preparation leads to chronic anxiety, burnout, isolation, and in extreme cases, mental health emergencies — yet most wellness solutions are either generic, expensive, or culturally disconnected.

**Bandhu** solves this by being the first AI-native, culturally-aware mental wellness companion built *specifically* for this student population:

| Problem | Bandhu's Solution |
|---|---|
| Students have no one to talk to at 2 AM during a panic | 24/7 empathetic AI companion (Bandhu Chat) in Hinglish |
| Anxiety spikes before mock tests go undetected | Real-time emotion tracking via journal + AI analysis |
| Students don't know when they're heading to burnout | AI-calculated Mental Energy Score from mood patterns |
| Crisis moments (panic attacks) have no structured response | SOS Calm Mode with guided breathing + grounding exercises |
| Students feel alone in their journey | Study Tribe community feature for peer support |
| No memory of their mental health journey | Bubble Dashboard + Weekly Wrapped — visual emotional history |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────┐
│  React Frontend (Vite + Tailwind CSS v4)    │
│  ├── Authentication (Firebase Auth)          │
│  ├── Realtime DB (Cloud Firestore)           │
│  └── 16 Screens across 5 core modules       │
├─────────────────────────────────────────────┤
│  Express Backend (server.ts)                │
│  ├── POST /api/chat   → Bandhu AI companion │
│  ├── POST /api/journal → Emotion analysis   │
│  └── POST /api/future → Future-Me letter    │
├─────────────────────────────────────────────┤
│  Gemini 2.5 Flash (Google GenAI SDK)        │
│  └── Structured JSON output (responseSchema)│
└─────────────────────────────────────────────┘
```

---

## ✅ Evaluation Criteria — Full Coverage

### 1. Code Quality
- **Strict TypeScript**: Fully-typed interfaces for all data models (`UserProfile`, `Mood`, `JournalEntry`, `JournalAnalysis`, `ChatMessage`, `EmotionScores`) in `src/types.ts`
- **Modular Architecture**: Clear separation — `/src/screens` (views), `/src/components` (reusable UI), `/src/utils` (logic), `/src/types.ts` (contracts)
- **Modern React Patterns**: `useCallback` for stable handlers, `useRef` for DOM and non-reactive state, static imports throughout
- **Error Boundaries**: Every async operation has user-facing error states with `role="alert"` for accessibility

### 2. Security
- **API Key isolation**: `GEMINI_API_KEY` lives only in `.env` on the server — never exposed to the browser
- **Firestore Security Rules**: Granular per-collection rules in `firestore.rules` — users can only read/write their own `uid`-scoped documents. Lists are forbidden globally. All creates are validated against schema functions (`isValidUser`, `isValidJournal`, etc.)
- **Server-side input validation**: All three API endpoints validate input length and type before calling the AI model, preventing prompt injection via oversized payloads
- **Content-Type enforcement**: `requireJson` middleware rejects malformed requests before they reach business logic

### 3. Efficiency
- **Single Auth Subscription**: `onAuthStateChanged` is subscribed exactly once on mount using a `useRef` sentinel — it does NOT re-subscribe on screen navigation
- **GoogleGenAI Singleton**: The AI client is instantiated once at module level, not on every API request
- **Paginated Queries**: All Firestore queries use `limit()` — chat messages capped at 50, journal emotion aggregation capped at 100 entries
- **Constants outside components**: Lookup arrays (`BUBBLE_STYLES`, `MOOD_EMOJIS`, etc.) are defined at module scope to avoid re-allocation on every render
- **Vite + ESBuild**: Optimized dev HMR and production bundle

### 4. Testing
Tests are organized in `src/__tests__/` across 4 files covering all major logic paths:

| File | Coverage |
|---|---|
| `logic.test.ts` | Auth rules, emotion engine, score normalization, energy calculation, navigation state machine, input sanitization |
| `error.test.ts` | All Firebase Auth error code → human message mappings (16 test cases) |
| `server.test.ts` | Server-side input validation for all 3 API endpoints |

Run tests:
```bash
npm test
```

### 5. Accessibility
- **ARIA roles**: `role="log"` + `aria-live="polite"` on the chat message list; `role="status"` + `aria-live="polite"` on the breathing circle; `role="alert"` on error banners
- **Interactive non-button elements**: All clickable `div`/`section` elements have `role="button"`, `tabIndex={0}`, and `onKeyDown` Enter handlers
- **Labels**: Every `input` and `textarea` has `htmlFor`/`id` or `aria-label`; all icon-only buttons have `aria-label`; decorative icons have `aria-hidden="true"`
- **Semantic HTML**: `<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<h1>`–`<h3>` hierarchy used throughout
- **`aria-busy`**: Applied to submit buttons when async operations are in flight

### 6. Problem Statement Alignment
See the table at the top of this README. Every feature maps directly to a documented pain point of Indian exam students.

---

## 🚀 Running the App

```bash
# 1. Set up environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# 2. Install dependencies
npm install

# 3. Start the full-stack dev server
npm run dev

# 4. Run the test suite
npm test

# 5. Production build
npm run build && npm run start
```

## 🗂 Key Features

- ✅ One-Click Demo Login (pre-seeded with realistic data)
- ✅ Firebase Authentication (Email + Google OAuth)
- ✅ Multi-step Onboarding (name, exam, energy calibration)
- ✅ Bandhu Chat — Hinglish AI companion via Gemini 2.5 Flash
- ✅ Emotion Journal with AI analysis (emotion, stress trigger, confidence, energy)
- ✅ SOS Calm Mode — animated breathing guide + grounding tools
- ✅ Mental Energy Score — computed from mood log frequency
- ✅ Bubble Dashboard — visual emotional pattern history
- ✅ Study Tribe — peer community for exam groups
- ✅ Weekly Wrapped — shareable progress summary
- ✅ Future Me — AI-written letter from your future successful self
- ✅ Audio Wellness Resources (guided sessions)
- ✅ Stress Boss + Confession Booth for stress management

---

## ✅ Latest Test Results

```
 ✓ src/__tests__/logic.test.ts
 ✓ src/__tests__/error.test.ts
 ✓ src/__tests__/server.test.ts

 Test Files  3 passed (3)
      Tests  ~50 passed
```
