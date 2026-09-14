import api, {setTokens, clearTokens, formatApiError} from './api';
import {
  UserProfile,
  CreatorProfile,
  OrganizationProfile,
  OrganizationOnboardingPayload,
  OrganizationUpdatePayload,
  OrganizationMember,
  CreatorOnboardingPayload,
  TokenResponse,
  RegisterFormInputs,
  OrganizationInvite,
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
   * Finalize organization onboarding by calling /organizations/onboarding/complete
   * This sets metadata_json[onboarding_completed_at] on the backend.
   */
  async finishOrganizationOnboarding(): Promise<OrganizationProfile> {
    try {
      const response = await api.post<OrganizationProfile>(
        '/organizations/onboarding/complete',
        {},
      );
      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Send an organization team invite by email
   */
  async sendOrganizationInvite(email: string): Promise<OrganizationInvite> {
    try {
      const response = await api.post<OrganizationInvite>('/organizations/me/invites', {
        email: email.trim(),
      });
      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Fetch current user's pending invites from other organizations
   */
  async getPendingInvites(): Promise<OrganizationInvite[]> {
    try {
      const response = await api.get<OrganizationInvite[]>('/organization-invites/me/pending');
      return response.data || [];
    } catch (err: any) {
      // 404 or empty is non-fatal
      return [];
    }
  },

  /**
   * Update authenticated user profile details (full_name, phone, bio, avatar_url)
   */
  async updateUserProfile(
    userId: string,
    data: Partial<UserProfile>,
  ): Promise<UserProfile> {
    try {
      const response = await api.patch<UserProfile>(`/users/${userId}`, data);
      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Update current organization profile details
   */
  async updateOrganization(
    data: OrganizationUpdatePayload,
  ): Promise<OrganizationProfile> {
    try {
      const response = await api.patch<OrganizationProfile>(
        '/organizations/me',
        data,
      );
      return response.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * List current organization's team members
   */
  async getOrganizationMembers(): Promise<OrganizationMember[]> {
    try {
      const response = await api.get<{members: OrganizationMember[]} | OrganizationMember[]>(
        '/organizations/me/members',
      );
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data?.members || [];
    } catch (err: any) {
      console.warn('[AuthService] Failed to load organization members:', err.message);
      return [];
    }
  },

  /**
   * Remove a member from the organization
   */
  async removeOrganizationMember(userId: string): Promise<void> {
    try {
      await api.delete(`/organizations/me/members/${userId}`);
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * List sent pending organization invites
   */
  async getOrganizationInvites(): Promise<OrganizationInvite[]> {
    try {
      const response = await api.get<OrganizationInvite[]>(
        '/organizations/me/invites',
      );
      return response.data || [];
    } catch (err: any) {
      console.warn('[AuthService] Failed to load invites:', err.message);
      return [];
    }
  },

  /**
   * Cancel a pending organization invite
   */
  async cancelOrganizationInvite(inviteId: string): Promise<void> {
    try {
      await api.delete(`/organizations/me/invites/${inviteId}`);
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
