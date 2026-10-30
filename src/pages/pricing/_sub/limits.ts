// The rows of the limits of the plans: the limits come from the pricing
// plans of the dashboard API, the names and the descriptions from the CMS
// (plain strings).
import type { RawApiTypes } from '@datocms/dashboard-client';
import type { ComparisonCategory, ComparisonRow, PlanValue } from '~/data/pricing';
import type { FragmentOf } from '~/lib/datocms/graphql';
import {
  formatExtra,
  formatLimit,
  formatLimitRaw,
  formatUpperBoundLimitRaw,
} from '~/lib/pricing/planLimitsHelpers';
import type { HintFragment } from '../_graphql';

type Plan = RawApiTypes.PerOwnerPricingPlan;
type Hint = FragmentOf<typeof HintFragment>;

// If you change one of these arrays, change them on the dashboard too
// (src/utils/websiteLimitsGrouping.ts).
const limitGroups = [
  {
    title: 'Plan limits & overages',
    limits: ['sites', 'sandbox_environments', 'users', 'item_types', 'locales', 'items'],
  },
  {
    title: 'Usage-based limits',
    limits: ['traffic_bytes', 'cda_api_calls', 'cma_api_calls', 'mux_streaming_seconds'],
  },
  {
    title: 'Non-extendable limits',
    limits: ['support_level', 'uploadable_bytes', 'history_retention_days'],
  },
];

/** The limits in the dialog that compares the Free plan and the Professional plan. */
const freeLimitIds = [
  ...limitGroups.flatMap((group) => group.limits),
  'indexable_pages', // Site Search: Spiderable pages
];

function findLimit(plan: Plan, limitId: string) {
  return plan.attributes.limits.find((limit) => limit.id === limitId);
}

/** The categories of the limits of the Professional plan. Enterprise is "Custom". */
export function limitCategories(proPlan: Plan, hints: Hint[]): ComparisonCategory[] {
  return limitGroups.map((group) => ({
    title: group.title,
    open: true,
    rows: group.limits.flatMap((limitId): ComparisonRow[] => {
      const hint = hints.find((h) => h.apiId === limitId);
      const limit = findLimit(proPlan, limitId);
      if (!hint?.name || !limit) return [];

      const included = formatLimit(limit);
      const extra = formatExtra(limit);
      const upTo =
        'max_extra_packets' in limit && limit.max_extra_packets
          ? `, up to ${formatUpperBoundLimitRaw(limit)}`
          : '';
      const pro: PlanValue =
        typeof included === 'boolean'
          ? included
          : extra
            ? `${included}\n${extra}${upTo}`
            : included;

      return [
        {
          feature: hint.name,
          info: hint.description || undefined,
          keywords: hint.description || undefined,
          pro,
          enterprise: 'Custom',
        },
      ];
    }),
  }));
}

export interface FreeLimitRow {
  name: string;
  description: string | null;
  free: string | boolean;
  pro: string | boolean;
  proExtra: string | null;
}

/** The rows of the dialog that compares the Free plan and the Professional plan. */
export function freeLimitRows(freePlan: Plan, proPlan: Plan, hints: Hint[]): FreeLimitRow[] {
  return freeLimitIds.flatMap((limitId) => {
    const hint = hints.find((h) => h.apiId === limitId);
    const freeLimit = findLimit(freePlan, limitId);
    const proLimit = findLimit(proPlan, limitId);
    if (!hint?.name || !freeLimit || !proLimit) return [];

    return [
      {
        name: hint.name,
        description: hint.description || null,
        free: formatLimitRaw(freeLimit),
        pro: formatLimitRaw(proLimit),
        proExtra: formatExtra(proLimit),
      },
    ];
  });
}
