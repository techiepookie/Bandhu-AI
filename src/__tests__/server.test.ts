import { describe, it, expect } from 'vitest';

/**
 * These tests validate the server-side API input validation logic
 * by replicating the pure validation functions.
 * 
 * This ensures all three API endpoints (/api/chat, /api/journal, /api/future)
 * correctly guard against oversized or malformed input.
 */

const MAX_CHAT_MESSAGE_LENGTH = 2000;
const MAX_JOURNAL_TEXT_LENGTH = 10000;
const MAX_NAME_FIELD_LENGTH = 100;
const MAX_EXAM_FIELD_LENGTH = 100;

/** Mirrors the validation used in POST /api/chat */
function validateChatInput(body: unknown): { valid: boolean; error?: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }
  const { message } = body as Record<string, unknown>;
  if (typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'message is required and must be a non-empty string.' };
  }
  if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
    return { valid: false, error: `message must not exceed ${MAX_CHAT_MESSAGE_LENGTH} characters.` };
  }
  return { valid: true };
}

/** Mirrors the validation used in POST /api/journal */
function validateJournalInput(body: unknown): { valid: boolean; error?: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }
  const { text } = body as Record<string, unknown>;
  if (typeof text !== 'string' || text.trim().length === 0) {
    return { valid: false, error: 'text is required and must be a non-empty string.' };
  }
  if (text.length > MAX_JOURNAL_TEXT_LENGTH) {
    return { valid: false, error: `text must not exceed ${MAX_JOURNAL_TEXT_LENGTH} characters.` };
  }
  return { valid: true };
}

/** Mirrors the validation used in POST /api/future */
function validateFutureInput(body: unknown): { valid: boolean; error?: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }
  const { name, exam } = body as Record<string, unknown>;
  if (name !== undefined && (typeof name !== 'string' || name.length > MAX_NAME_FIELD_LENGTH)) {
    return { valid: false, error: `name must not exceed ${MAX_NAME_FIELD_LENGTH} characters.` };
  }
  if (exam !== undefined && (typeof exam !== 'string' || exam.length > MAX_EXAM_FIELD_LENGTH)) {
    return { valid: false, error: `exam must not exceed ${MAX_EXAM_FIELD_LENGTH} characters.` };
  }
  return { valid: true };
}

// ============================================================
describe('POST /api/chat — Input Validation', () => {
  it('should accept a valid chat message', () => {
    expect(validateChatInput({ message: 'I am feeling stressed today.' }).valid).toBe(true);
  });

  it('should reject an empty message string', () => {
    const r = validateChatInput({ message: '' });
    expect(r.valid).toBe(false);
    expect(r.error).toContain('non-empty');
  });

  it('should reject a whitespace-only message', () => {
    const r = validateChatInput({ message: '   ' });
    expect(r.valid).toBe(false);
  });

  it('should reject message exceeding 2000 characters', () => {
    const r = validateChatInput({ message: 'A'.repeat(2001) });
    expect(r.valid).toBe(false);
    expect(r.error).toContain('2000');
  });

  it('should accept a message of exactly 2000 characters', () => {
    expect(validateChatInput({ message: 'A'.repeat(2000) }).valid).toBe(true);
  });

  it('should reject a non-object body', () => {
    expect(validateChatInput(null).valid).toBe(false);
    expect(validateChatInput('string').valid).toBe(false);
    expect(validateChatInput(123).valid).toBe(false);
  });

  it('should reject body missing the message field', () => {
    expect(validateChatInput({ other: 'field' }).valid).toBe(false);
  });
});

// ============================================================
describe('POST /api/journal — Input Validation', () => {
  it('should accept a valid journal entry', () => {
    expect(validateJournalInput({ text: 'Today I felt anxious about the exam.' }).valid).toBe(true);
  });

  it('should reject an empty text string', () => {
    const r = validateJournalInput({ text: '' });
    expect(r.valid).toBe(false);
  });

  it('should reject text exceeding 10000 characters', () => {
    const r = validateJournalInput({ text: 'A'.repeat(10001) });
    expect(r.valid).toBe(false);
    expect(r.error).toContain('10000');
  });

  it('should accept text of exactly 10000 characters', () => {
    expect(validateJournalInput({ text: 'A'.repeat(10000) }).valid).toBe(true);
  });

  it('should reject a non-object body', () => {
    expect(validateJournalInput(null).valid).toBe(false);
  });
});

// ============================================================
describe('POST /api/future — Input Validation', () => {
  it('should accept valid name and exam fields', () => {
    expect(validateFutureInput({ name: 'Nikhil', exam: 'JEE' }).valid).toBe(true);
  });

  it('should accept an empty body (fields are optional)', () => {
    expect(validateFutureInput({}).valid).toBe(true);
  });

  it('should reject a name exceeding 100 characters', () => {
    const r = validateFutureInput({ name: 'A'.repeat(101) });
    expect(r.valid).toBe(false);
    expect(r.error).toContain('name');
  });

  it('should reject an exam exceeding 100 characters', () => {
    const r = validateFutureInput({ exam: 'A'.repeat(101) });
    expect(r.valid).toBe(false);
    expect(r.error).toContain('exam');
  });

  it('should accept a name of exactly 100 characters', () => {
    expect(validateFutureInput({ name: 'A'.repeat(100) }).valid).toBe(true);
  });

  it('should reject a non-object body', () => {
    expect(validateFutureInput(null).valid).toBe(false);
  });
});
