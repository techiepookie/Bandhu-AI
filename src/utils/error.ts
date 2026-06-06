export function getHumanErrorMessage(err: any, defaultMsg: string = 'Something went wrong. Please try again.'): string {
  if (!err || !err.code) return defaultMsg;
  
  switch (err.code) {
      case 'auth/invalid-email':
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
          return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
          return 'An account with this email already exists. Try logging in instead.';
      case 'auth/weak-password':
          return 'Your password is too weak. Please use at least 6 characters.';
      case 'auth/operation-not-allowed':
      case 'auth/admin-restricted-operation':
          return 'This login method is temporarily restricted. Please use standard email/password.';
      case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection and try again.';
      case 'auth/too-many-requests':
          return 'Too many login attempts. Please wait a moment and try again.';
      case 'auth/popup-closed-by-user':
          return 'Authentication popup was closed before completing.';
      default:
          return defaultMsg;
  }
}
