import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENV} from '../config/env';
import {AuthTokens, TokenResponse} from '../types';

export const API_BASE_URL = ENV.API_BASE_URL;

const TOKEN_KEY = '@context_engine_auth_tokens';
const ACCOUNT_TYPE_KEY = '@context_engine_account_type';

let cachedTokens: AuthTokens | null = null;

export const getTokens = async (): Promise<AuthTokens | null> => {
  if (cachedTokens) return cachedTokens;
  try {
    const raw = await AsyncStorage.getItem(TOKEN_KEY);
    if (raw) {
      cachedTokens = JSON.parse(raw);
      return cachedTokens;
    }
  } catch (err) {
    console.warn('[API] Error reading auth tokens', err);
  }
  return null;
};

export const setTokens = async (tokens: AuthTokens | TokenResponse): Promise<void> => {
  const normalized: AuthTokens = {
    accessToken: 'access_token' in tokens ? tokens.access_token : tokens.accessToken,
    refreshToken: 'refresh_token' in tokens ? tokens.refresh_token : tokens.refreshToken,
  };
  cachedTokens = normalized;
  try {
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.warn('[API] Error saving auth tokens', err);
  }
};

export const clearTokens = async (): Promise<void> => {
  cachedTokens = null;
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('[API] Error removing auth tokens', err);
  }
};

export const getStoredAccountType = async (userId?: string): Promise<string | null> => {
  try {
    const key = userId ? `${ACCOUNT_TYPE_KEY}_${userId}` : ACCOUNT_TYPE_KEY;
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
};

export const setStoredAccountType = async (userId: string, type: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(`${ACCOUNT_TYPE_KEY}_${userId}`, type);
    await AsyncStorage.setItem(ACCOUNT_TYPE_KEY, type);
  } catch {}
};

export const clearStoredAccountType = async (userId?: string): Promise<void> => {
  try {
    if (userId) {
      await AsyncStorage.removeItem(`${ACCOUNT_TYPE_KEY}_${userId}`);
    }
    await AsyncStorage.removeItem(ACCOUNT_TYPE_KEY);
  } catch {}
};

/**
 * Parses and formats FastAPI backend error responses
 */
export function formatApiError(error: any): string {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail.map((item: any) => item.msg || JSON.stringify(item)).join(', ');
    }
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected network error occurred. Please try again.';
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: ENV.API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const tokens = await getTokens();
  if (tokens?.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    if (error.response?.status === 401) {
      await clearTokens();
    }
    return Promise.reject(error);
  },
);

export default api;
