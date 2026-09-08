// ─── Context Engine App — Core Type Definitions ───

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  role?: string;
  bio?: string;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export type ThemePreference = 'system' | 'light' | 'dark';
