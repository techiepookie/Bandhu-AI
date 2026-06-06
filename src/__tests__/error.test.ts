import { describe, it, expect } from 'vitest';
import { getHumanErrorMessage } from '../utils/error';

describe('getHumanErrorMessage — Firebase Auth Error Mapping', () => {
  it('should return a friendly message for invalid credentials', () => {
    const result = getHumanErrorMessage({ code: 'auth/invalid-credential' });
    expect(result).toBe('Invalid email or password. Please try again.');
  });

  it('should return a friendly message for invalid email format', () => {
    const result = getHumanErrorMessage({ code: 'auth/invalid-email' });
    expect(result).toBe('Invalid email or password. Please try again.');
  });

  it('should return a friendly message for user-not-found', () => {
    const result = getHumanErrorMessage({ code: 'auth/user-not-found' });
    expect(result).toBe('Invalid email or password. Please try again.');
  });

  it('should return a friendly message for wrong-password', () => {
    const result = getHumanErrorMessage({ code: 'auth/wrong-password' });
    expect(result).toBe('Invalid email or password. Please try again.');
  });

  it('should return a friendly message for email-already-in-use', () => {
    const result = getHumanErrorMessage({ code: 'auth/email-already-in-use' });
    expect(result).toBe('An account with this email already exists. Try logging in instead.');
  });

  it('should return a friendly message for weak-password', () => {
    const result = getHumanErrorMessage({ code: 'auth/weak-password' });
    expect(result).toBe('Your password is too weak. Please use at least 6 characters.');
  });

  it('should return a friendly message for operation-not-allowed', () => {
    const result = getHumanErrorMessage({ code: 'auth/operation-not-allowed' });
    expect(result).toBe('This login method is temporarily restricted. Please use standard email/password.');
  });

  it('should return a friendly message for admin-restricted-operation', () => {
    const result = getHumanErrorMessage({ code: 'auth/admin-restricted-operation' });
    expect(result).toBe('This login method is temporarily restricted. Please use standard email/password.');
  });

  it('should return a friendly message for network-request-failed', () => {
    const result = getHumanErrorMessage({ code: 'auth/network-request-failed' });
    expect(result).toBe('Network error. Please check your internet connection and try again.');
  });

  it('should return a friendly message for too-many-requests', () => {
    const result = getHumanErrorMessage({ code: 'auth/too-many-requests' });
    expect(result).toBe('Too many login attempts. Please wait a moment and try again.');
  });

  it('should return a friendly message for popup-closed-by-user', () => {
    const result = getHumanErrorMessage({ code: 'auth/popup-closed-by-user' });
    expect(result).toBe('Authentication popup was closed before completing.');
  });

  it('should return the default message for an unknown error code', () => {
    const result = getHumanErrorMessage({ code: 'auth/unknown-code-xyz' });
    expect(result).toBe('Something went wrong. Please try again.');
  });

  it('should return the custom default message when provided', () => {
    const result = getHumanErrorMessage({ code: 'auth/unknown-code' }, 'Custom fallback message.');
    expect(result).toBe('Custom fallback message.');
  });

  it('should return the default message when error is null', () => {
    const result = getHumanErrorMessage(null);
    expect(result).toBe('Something went wrong. Please try again.');
  });

  it('should return the default message when error has no code', () => {
    const result = getHumanErrorMessage({ message: 'some error without code' });
    expect(result).toBe('Something went wrong. Please try again.');
  });

  it('should return the default message when error is undefined', () => {
    const result = getHumanErrorMessage(undefined);
    expect(result).toBe('Something went wrong. Please try again.');
  });
});
