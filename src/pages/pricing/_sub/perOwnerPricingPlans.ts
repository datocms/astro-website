import ky from 'ky';
import { cachedFn } from '~/lib/temporarlyCache';

export const fetchPerOwnerPricingPlans = cachedFn(async () => {
  const { data } = await ky<PricingPlanResponse>(
    'https://account-api.datocms.com/per-owner-pricing-plans',
    {
      headers: { accept: 'application/json' },
    },
  ).json();

  return data;
});

/** Stores the information regarding the current plan for the account. */
export interface Plan {
  type: PerOwnerPricingPlanType;
  id: string;
  attributes: PlanAttributes;
}

/** JSON API data */
interface PricingPlanResponse {
  data: Array<Plan>;
}

/** The only valid type for pricing plans */
type PerOwnerPricingPlanType = 'per_owner_pricing_plan';

interface PlanAttributes {
  /** The name of the plan */
  name: string;
  /** Whether this plan is active */
  active: boolean;
  /** Monthly price for plan (EUR) */
  monthly_price: number;
  /** Yearly price for plan (EUR) */
  yearly_price: number;
  /** Array of plan limits */
  limits: Limit[];
  /** Additional notes */
  notes: string | null;
  /** Additional enterprise features enabled */
  enterprise_features: string[];
}

export type Limit =
  | ActivableFeature
  | BooleanSystemLimit
  | CountableSystemLimit
  | PossiblyIncompatibleCountableSystemLimit
  | OwnerManagedResource
  | PerSiteQuotaManagedSiteResource
  | PerEnvironmentQuotaManagedSiteResource
  | SharedQuotaManagedSiteResource
  | SharedQuotaMeteredSiteResource;

interface BaseLimitProperties {
  id: string;
  type: string;
}

interface ActivableFeature extends BaseLimitProperties {
  type: 'activable_feature';
  available: boolean;
}

interface BooleanSystemLimit extends BaseLimitProperties {
  type: 'boolean_system_limit';
  available: boolean;
}

interface CountableSystemLimit extends BaseLimitProperties {
  type: 'countable_system_limit';
  limit: number;
}

interface PossiblyIncompatibleCountableSystemLimit extends BaseLimitProperties {
  type: 'possibly_incompatible_countable_system_limit';
  limit: number;
}

interface OwnerManagedResource extends BaseLimitProperties {
  type: 'owner_managed_resource';
  free_of_charge_usage: number;
  extra_packets_available_in_some_plan: boolean;
  max_extra_packets: number | null;
  extra_packet_amount: number | null;
  extra_packet_price: number | null;
}

interface PerSiteQuotaManagedSiteResource extends BaseLimitProperties {
  type: 'per_site_quota_managed_site_resource';
  free_of_charge_per_site_usage: number;
  extra_packets_available_in_some_plan: boolean;
  max_extra_packets: number | null;
  extra_packet_amount: number | null;
  extra_packet_price: number | null;
}

interface PerEnvironmentQuotaManagedSiteResource extends BaseLimitProperties {
  type: 'per_environment_quota_managed_site_resource';
  free_of_charge_per_environment_usage: number;
  extra_packets_available_in_some_plan: boolean;
  max_extra_packets: number | null;
  extra_packet_amount: number | null;
  extra_packet_price: number | null;
}

interface SharedQuotaManagedSiteResource extends BaseLimitProperties {
  type: 'shared_quota_managed_site_resource';
  free_of_charge_usage: number;
  extra_packets_available_in_some_plan: boolean;
  max_extra_packets: number | null;
  extra_packet_amount: number | null;
  extra_packet_price: number | null;
}

interface SharedQuotaMeteredSiteResource extends BaseLimitProperties {
  type: 'shared_quota_metered_site_resource';
  free_of_charge_usage: number;
  extra_packet_amount: number | null;
  extra_packet_price: number | null;
}
