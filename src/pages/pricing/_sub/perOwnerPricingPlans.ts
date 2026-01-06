import type { RawApiTypes } from '@datocms/dashboard-client';
import ky from 'ky';
import { dataSource } from '~/lib/dataSource';

export const [fetchPerOwnerPricingPlans, maybeInvalidatePerOwnerPricingPlans] = dataSource(
  'per-owner-pricing-plans',
  async () => {
    const { data } = await ky<{ data: RawApiTypes.PerOwnerPricingPlan[] }>(
      'https://account-api.datocms.com/per-owner-pricing-plans',
      {
        headers: { accept: 'application/json' },
      },
    ).json();

    return data;
  },
);

type PerOwnerPricingPlan = RawApiTypes.PerOwnerPricingPlan;

export type { PerOwnerPricingPlan };

export type Limit = RawApiTypes.PerOwnerPricingPlan['attributes']['limits'][number];

// Extract limit types for reuse
export type OwnerManagedResourceLimit = Extract<Limit, { type: 'owner_managed_resource' }>;
export type PerSiteQuotaManagedSiteResourceLimit = Extract<
  Limit,
  { type: 'per_site_quota_managed_site_resource' }
>;
export type PerEnvironmentQuotaManagedSiteResourceLimit = Extract<
  Limit,
  { type: 'per_environment_quota_managed_site_resource' }
>;
export type SharedQuotaManagedSiteResourceLimit = Extract<
  Limit,
  { type: 'shared_quota_managed_site_resource' }
>;
export type SharedQuotaMeteredSiteResourceLimit = Extract<
  Limit,
  { type: 'shared_quota_metered_site_resource' }
>;

// Union type for all managed resource limits
export type ManagedResourceLimit =
  | OwnerManagedResourceLimit
  | PerSiteQuotaManagedSiteResourceLimit
  | PerEnvironmentQuotaManagedSiteResourceLimit
  | SharedQuotaManagedSiteResourceLimit;
