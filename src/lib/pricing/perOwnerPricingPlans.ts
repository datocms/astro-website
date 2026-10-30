import { buildClient, type RawApiTypes } from '@datocms/dashboard-client';
import { dataSource } from '~/lib/dataSource';

export const [fetchPerOwnerPricingPlans, maybeInvalidatePerOwnerPricingPlans] = dataSource(
  'per-owner-pricing-plans',
  async () => {
    const client = buildClient({ apiToken: undefined } as any);
    const { data } = await client.perOwnerPricingPlans.rawList();

    return data;
  },
);

export type Limit = RawApiTypes.PerOwnerPricingPlanAttributes['limits'][0];
