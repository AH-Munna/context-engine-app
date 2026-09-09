import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  UserProfile,
  CreatorProfile,
  OrganizationProfile,
  AccountType,
} from '../../types';
import {authService} from '../../Service/authService';
import {
  getTokens,
  getStoredAccountType,
  setStoredAccountType,
  clearTokens,
  clearStoredAccountType,
} from '../../Service/api';

export interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: UserProfile | null;
  creator: CreatorProfile | null;
  organization: OrganizationProfile | null;
  accountType: AccountType | null;
  error: string | null;
}

const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  isAuthenticated: false,
  isOnboarded: false,
  user: null,
  creator: null,
  organization: null,
  accountType: null,
  error: null,
};

/**
 * Restore active session from persistent storage & verify with backend
 */
export const restoreSessionThunk = createAsyncThunk(
  'app/restoreSession',
  async (_, {rejectWithValue}) => {
    try {
      const tokens = await getTokens();
      if (!tokens?.accessToken) {
        return null;
      }

      // Fetch user profile from /users/me
      const user = await authService.getCurrentUser();
      const storedAccountType = (await getStoredAccountType(user.id)) as AccountType | null;

      let creator: CreatorProfile | null = null;
      try {
        creator = await authService.getCreatorProfile();
      } catch {}

      let organization: OrganizationProfile | null = null;
      try {
        organization = await authService.getOrganizationProfile();
      } catch {}

      const effectiveAccountType: AccountType | null = organization
        ? 'organization'
        : creator
        ? 'creator'
        : storedAccountType;

      const isOnboarded = !!creator || !!organization;

      return {
        user,
        creator,
        organization,
        accountType: effectiveAccountType,
        isOnboarded,
      };
    } catch (err: any) {
      await clearTokens();
      return rejectWithValue(err.message || 'Session expired');
    }
  }
);

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAccountType: (state, action: PayloadAction<AccountType | null>) => {
      state.accountType = action.payload;
      if (state.user && action.payload) {
        setStoredAccountType(state.user.id, action.payload);
      }
    },
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setCreator: (state, action: PayloadAction<CreatorProfile | null>) => {
      state.creator = action.payload;
      if (action.payload) {
        state.isOnboarded = true;
        state.accountType = 'creator';
      }
    },
    setOrganization: (state, action: PayloadAction<OrganizationProfile | null>) => {
      state.organization = action.payload;
      if (action.payload) {
        state.isOnboarded = true;
        state.accountType = 'organization';
      }
    },
    setAuthSuccess: (
      state,
      action: PayloadAction<{
        user: UserProfile;
        creator?: CreatorProfile | null;
        organization?: OrganizationProfile | null;
        accountType?: AccountType | null;
      }>
    ) => {
      state.user = action.payload.user;
      state.creator = action.payload.creator || null;
      state.organization = action.payload.organization || null;
      state.accountType =
        action.payload.accountType ||
        (action.payload.organization ? 'organization' : action.payload.creator ? 'creator' : null);
      state.isAuthenticated = true;
      state.isOnboarded = !!action.payload.creator || !!action.payload.organization;
      state.isLoading = false;
      state.error = null;
    },
    logout: state => {
      state.user = null;
      state.creator = null;
      state.organization = null;
      state.accountType = null;
      state.isAuthenticated = false;
      state.isOnboarded = false;
      state.isLoading = false;
      state.error = null;
      authService.logout();
      clearStoredAccountType();
    },
  },
  extraReducers: builder => {
    builder
      .addCase(restoreSessionThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(restoreSessionThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.creator = action.payload.creator;
          state.organization = action.payload.organization;
          state.accountType = action.payload.accountType;
          state.isAuthenticated = true;
          state.isOnboarded = action.payload.isOnboarded;
        } else {
          state.isAuthenticated = false;
          state.isOnboarded = false;
        }
      })
      .addCase(restoreSessionThunk.rejected, state => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.isOnboarded = false;
        state.user = null;
      });
  },
});

export const {
  setLoading,
  setError,
  setAccountType,
  setUser,
  setCreator,
  setOrganization,
  setAuthSuccess,
  logout,
} = appSlice.actions;

export default appSlice.reducer;
