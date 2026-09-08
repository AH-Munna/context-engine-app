import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  role?: string;
}

export interface AppState {
  isInitialized: boolean;
  themeMode: 'system' | 'light' | 'dark';
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: AppState = {
  isInitialized: true,
  themeMode: 'system',
  user: null,
  isAuthenticated: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'system' | 'light' | 'dark'>) => {
      state.themeMode = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {setInitialized, setThemeMode, setUser, logout} = appSlice.actions;
export default appSlice.reducer;
