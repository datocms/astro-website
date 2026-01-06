import type { PerOwnerPricingPlan } from '@datocms/dashboard-client';
import ky from 'ky';
import { dataSource } from '~/lib/dataSource';

export const [fetchPerOwnerPricingPlans, maybeInvalidatePerOwnerPricingPlans] = dataSource(
  'per-owner-pricing-plans',
  async () => {
    const { data } = await ky<{ data: PerOwnerPricingPlan[] }>(
      'https://account-api.datocms.com/per-owner-pricing-plans',
      {
        headers: { accept: 'application/json' },
      },
    ).json();

    return data;
  },
);

export type { PerOwnerPricingPlan };
export type Limit = PerOwnerPricingPlan['attributes']['limits'][number];
