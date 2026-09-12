import AsyncStorage from '@react-native-async-storage/async-storage';
import {AccountType, OrganizationProfile} from '../types';
import {RootStackParamList} from '../Navigations/RootStackParamList';

const STORAGE_KEY_PREFIX = '@ce_account_type_';
const ORG_ONBOARDING_COMPLETE_PREFIX = '@ce_org_onboarding_complete_';
export const ORG_ONBOARDING_COMPLETED_AT_KEY = 'onboarding_completed_at';

/**
 * Check if the organization object contains the onboarding completion timestamp in metadata_json
 */
export function hasOrganizationCompletedOnboarding(
  organization: {metadata_json?: Record<string, unknown> | null} | null | undefined,
): boolean {
  if (!organization?.metadata_json) return false;
  return Boolean(organization.metadata_json[ORG_ONBOARDING_COMPLETED_AT_KEY]);
}

/**
 * Get stored organization onboarding completion flag from AsyncStorage
 */
export async function getStoredOrgOnboardingComplete(userId: string): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(`${ORG_ONBOARDING_COMPLETE_PREFIX}${userId}`);
    return val === 'true';
  } catch {
    return false;
  }
}

/**
 * Save organization onboarding completion flag to AsyncStorage
 */
export async function setStoredOrgOnboardingComplete(userId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(`${ORG_ONBOARDING_COMPLETE_PREFIX}${userId}`, 'true');
  } catch {}
}

/**
 * Clear organization onboarding completion flag from AsyncStorage
 */
export async function clearStoredOrgOnboardingComplete(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${ORG_ONBOARDING_COMPLETE_PREFIX}${userId}`);
  } catch {}
}

/**
 * Check if the user's organization has completed onboarding either via metadata or storage
 */
export function isOrgOnboardingComplete(
  userId: string,
  organization: {metadata_json?: Record<string, unknown> | null} | null | undefined,
  storedComplete = false,
): boolean {
  return storedComplete || hasOrganizationCompletedOnboarding(organization);
}

/**
 * Sync AsyncStorage completion state with backend organization profile
 */
export async function syncStoredOrgOnboardingComplete(
  userId: string,
  organization: {metadata_json?: Record<string, unknown> | null} | null | undefined,
): Promise<void> {
  if (hasOrganizationCompletedOnboarding(organization)) {
    await setStoredOrgOnboardingComplete(userId);
  }
}

/**
 * Resolves the destination route matching the web project's resolvePostAuthPath
 */
export function resolvePostAuthRoute({
  accountType,
  hasCreatorProfile,
  hasCompletedOrgOnboarding = false,
}: {
  accountType: AccountType | null;
  hasCreatorProfile: boolean;
  hasCompletedOrgOnboarding?: boolean;
}): keyof RootStackParamList {
  if (hasCreatorProfile) return 'Home';
  if (hasCompletedOrgOnboarding) return 'Home';
  if (!accountType) return 'ChooseAccountType';
  if (accountType === 'organization') return 'OrgOnboarding';
  return 'CreatorOnboarding';
}
