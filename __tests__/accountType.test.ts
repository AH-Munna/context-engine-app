import {
  hasOrganizationCompletedOnboarding,
  isOrgOnboardingComplete,
  resolvePostAuthRoute,
  ORG_ONBOARDING_COMPLETED_AT_KEY,
} from '../app/utils/accountType';

describe('accountType utils', () => {
  describe('hasOrganizationCompletedOnboarding', () => {
    it('returns false when organization is null or metadata is missing', () => {
      expect(hasOrganizationCompletedOnboarding(null)).toBe(false);
      expect(hasOrganizationCompletedOnboarding(undefined)).toBe(false);
      expect(hasOrganizationCompletedOnboarding({metadata_json: null})).toBe(false);
      expect(hasOrganizationCompletedOnboarding({metadata_json: {}})).toBe(false);
    });

    it('returns true when onboarding_completed_at is present in metadata_json', () => {
      expect(
        hasOrganizationCompletedOnboarding({
          metadata_json: {[ORG_ONBOARDING_COMPLETED_AT_KEY]: '2026-09-12T10:00:00Z'},
        }),
      ).toBe(true);
    });
  });

  describe('isOrgOnboardingComplete', () => {
    it('returns true if storedComplete is true', () => {
      expect(isOrgOnboardingComplete('user-1', null, true)).toBe(true);
    });

    it('returns true if metadata_json has onboarding_completed_at', () => {
      expect(
        isOrgOnboardingComplete(
          'user-1',
          {metadata_json: {[ORG_ONBOARDING_COMPLETED_AT_KEY]: '2026-09-12T10:00:00Z'}},
          false,
        ),
      ).toBe(true);
    });

    it('returns false if neither storage nor metadata has completed timestamp', () => {
      expect(isOrgOnboardingComplete('user-1', {metadata_json: {}}, false)).toBe(false);
    });
  });

  describe('resolvePostAuthRoute', () => {
    it('routes to Home if hasCreatorProfile is true', () => {
      expect(
        resolvePostAuthRoute({
          accountType: 'creator',
          hasCreatorProfile: true,
          hasCompletedOrgOnboarding: false,
        }),
      ).toBe('Home');
    });

    it('routes to Home if hasCompletedOrgOnboarding is true', () => {
      expect(
        resolvePostAuthRoute({
          accountType: 'organization',
          hasCreatorProfile: false,
          hasCompletedOrgOnboarding: true,
        }),
      ).toBe('Home');
    });

    it('routes to CreatorOnboarding if creator account type without profile', () => {
      expect(
        resolvePostAuthRoute({
          accountType: 'creator',
          hasCreatorProfile: false,
          hasCompletedOrgOnboarding: false,
        }),
      ).toBe('CreatorOnboarding');
    });

    it('routes to OrgOnboarding if organization account type without completed org onboarding', () => {
      expect(
        resolvePostAuthRoute({
          accountType: 'organization',
          hasCreatorProfile: false,
          hasCompletedOrgOnboarding: false,
        }),
      ).toBe('OrgOnboarding');
    });

    it('routes to ChooseAccountType if accountType is null', () => {
      expect(
        resolvePostAuthRoute({
          accountType: null,
          hasCreatorProfile: false,
          hasCompletedOrgOnboarding: false,
        }),
      ).toBe('ChooseAccountType');
    });
  });
});
