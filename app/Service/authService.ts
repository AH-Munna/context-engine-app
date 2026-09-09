import api, {setTokens, clearTokens, formatApiError} from './api';
import {
  UserProfile,
  CreatorProfile,
  OrganizationProfile,
  OrganizationOnboardingPayload,
  CreatorOnboardingPayload,
  TokenResponse,
  RegisterFormInputs,
} from '../types';

export const authService = {
  /**
   * Log in user with username (email) and password via OAuth2 Form
   */
  async login(email: string, password: string): Promise<TokenResponse> {
    try {
      const params = new URLSearchParams();
      params.append('username', email.trim());
      params.append('password', password);

      const response = await api.post<TokenResponse>('/auth/login', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      await setTokens(response.data);
      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Register a new user account
   */
  async register(inputs: RegisterFormInputs): Promise<UserProfile> {
    try {
      const fullName =
        inputs.accountType === 'organization'
          ? (inputs.organizationName || '').trim()
          : `${(inputs.firstName || '').trim()} ${(inputs.lastName || '').trim()}`.trim();

      const payload = {
        email: inputs.email.trim(),
        password: inputs.password,
        full_name: fullName || undefined,
      };

      const response = await api.post<UserProfile>('/auth/register', payload);
      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>('/users/me');
      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Fetch current user's Creator Profile (returns null if not a creator)
   */
  async getCreatorProfile(): Promise<CreatorProfile | null> {
    try {
      const response = await api.get<CreatorProfile>('/creators/me');
      return response.data;
    } catch (err: any) {
      // 404 or 204 indicates user is not onboarded as creator
      if (err.response?.status === 404 || err.response?.status === 204) {
        return null;
      }
      return null;
    }
  },

  /**
   * Fetch current user's Organization Profile (returns null if not in an org)
   */
  async getOrganizationProfile(): Promise<OrganizationProfile | null> {
    try {
      const response = await api.get<OrganizationProfile>('/organizations/me');
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404 || err.response?.status === 204) {
        return null;
      }
      return null;
    }
  },

  /**
   * Complete Creator Onboarding (niches, goals, socials)
   */
  async completeCreatorOnboarding(
    payload: CreatorOnboardingPayload
  ): Promise<CreatorProfile> {
    try {
      const response = await api.post<CreatorProfile>('/creators/onboarding', {
        niches: payload.niches,
        goals: payload.goals,
      });
      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Complete Organization Onboarding
   */
  async completeOrganizationOnboarding(
    payload: OrganizationOnboardingPayload
  ): Promise<OrganizationProfile> {
    try {
      const body: Record<string, any> = {
        type: payload.type,
        name: payload.name.trim(),
        slug: payload.slug.trim(),
      };
      if (payload.industry) body.industry = payload.industry;
      if (payload.country) body.country = payload.country;
      if (payload.timezone) body.timezone = payload.timezone;
      if (payload.website) body.website = payload.website;

      const response = await api.post<OrganizationProfile>(
        '/organizations/onboarding',
        body
      );

      // Also send invites if any email addresses were provided
      if (payload.invitedEmails && payload.invitedEmails.length > 0) {
        for (const email of payload.invitedEmails) {
          if (email.trim()) {
            try {
              await api.post('/organizations/me/invites', {
                email: email.trim(),
                role: 'member',
              });
            } catch (inviteErr) {
              console.warn('[Onboarding] Failed to invite email:', email, inviteErr);
            }
          }
        }
      }

      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Clear local session & tokens
   */
  async logout(): Promise<void> {
    await clearTokens();
  },
};

export default authService;
