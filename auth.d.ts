// auth.d.ts
declare module '#auth-utils' {
  interface User {
    id: number;
    email: string;
    technician: {
      id: number;
    } | null;
  }

  interface UserSession {
    // Add any fields relevant to the session here, if needed
  }

  interface SecureSessionData {
    // Add any fields for secure session data here, if needed
  }
}

export {};
