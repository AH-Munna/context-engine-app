import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthTokens} from '../types';

// Configurable API base URL (can be updated with .env or remote config)
export const DEFAULT_API_BASE_URL = 'http://localhost:8000';
export const API_BASE_URL = DEFAULT_API_BASE_URL;

const TOKEN_KEY = '@context_engine_auth_tokens';

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

export const setTokens = async (tokens: AuthTokens): Promise<void> => {
  cachedTokens = tokens;
  try {
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
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

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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
