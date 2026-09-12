// ─── Context Engine — Core Type Definitions ───

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  status: string | null;
  is_active: boolean;
  is_superuser: boolean;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AccountType = 'creator' | 'organization';

export const ORG_ONBOARDING_COMPLETED_AT_KEY = 'onboarding_completed_at';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  full_name?: string;
  accountType: AccountType;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  creator_type: string;
  display_name: string | null;
  username: string | null;
  headline: string | null;
  bio: string | null;
  country: string | null;
  languages_json: string[];
  categories_json: string[];
  niches_json: string[];
  profile_visibility: string;
  verification_status: string;
  portfolio_visibility: string;
  marketplace_visibility: string;
  created_at: string;
}

export interface CreatorOnboardingPayload {
  niches: string[];
  goals: string[];
  socials?: {
    instagram?: string | boolean;
    facebook?: string | boolean;
    tiktok?: string | boolean;
    xcom?: string | boolean;
    youtube?: string | boolean;
  };
}

export type OrganizationType = 'brand' | 'agency' | 'creator_collective' | 'enterprise';

export interface OrganizationProfile {
  id: string;
  type: OrganizationType;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  country: string | null;
  timezone: string | null;
  metadata_json: Record<string, unknown> | null;
  created_by: string;
  created_at: string;
  managed_by_agency_id?: string | null;
  managed_by_agency_name?: string | null;
}

export interface OrganizationOnboardingPayload {
  type: OrganizationType;
  name: string;
  slug: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  country?: string;
  timezone?: string;
  invitedEmails?: string[];
}

export interface OrganizationUpdatePayload {
  type?: OrganizationType;
  name?: string;
  slug?: string;
  logo_url?: string | null;
  website?: string | null;
  industry?: string | null;
  country?: string | null;
  timezone?: string | null;
}

export interface OrganizationMember {
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'member';
  joined_at: string | null;
}

export interface OrganizationInvite {
  id: string;
  organization_id: string;
  email: string;
  status: string;
  invited_by_user_id: string;
  invitee_user_id: string | null;
  organization_name?: string | null;
  created_at: string;
  accepted_at: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export type ThemePreference = 'system' | 'light' | 'dark';
