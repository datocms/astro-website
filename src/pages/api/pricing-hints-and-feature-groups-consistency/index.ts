import { buildClient as buildCmaClient, type RawApiTypes } from '@datocms/cma-client-node';
import { buildClient as buildDashboardClient } from '@datocms/dashboard-client';
import type { APIRoute } from 'astro';
import { DATOCMS_API_TOKEN, SECRET_API_TOKEN } from 'astro:env/server';
import { type AnyModel, type PlanFeature, type PricingHint } from '~/lib/cma-schema';
import { handleUnexpectedError, invalidRequestResponse, json, withCORS } from '../_utils';

const ITEM_TYPE_IDS = {
  PLAN_FEATURE: '2086759',
  PRICING_HINT: '810916',
} as const;

const PER_SITE_PLAN_RESERVED_ATTRIBUTES = [
  'name',
  'active',
  'monthly_price',
  'yearly_price',
  'extra_packets',
  'auto_packets',
];

const VALID_FEATURE_LIMIT_TYPES = ['activable_feature', 'boolean_system_limit'];

type AnyItem = AnyModel extends infer M
  ? M extends AnyModel
    ? RawApiTypes.Item<M>
    : never
  : never;

type Payload = {
  entity: AnyItem;
  related_entities: [RawApiTypes.ItemType];
};

const cmaClient = buildCmaClient({ apiToken: DATOCMS_API_TOKEN });
const dashboardClient = buildDashboardClient({ apiToken: undefined } as any);

function validResponse(message: string) {
  return json({ status: 'valid', message }, withCORS());
}

function errorResponse(message: string) {
  return json({ status: 'error', message }, withCORS());
}

async function fetchPricingPlans() {
  const [{ data: perOwnerPlans }, { data: perSitePlans }] = await Promise.all([
    dashboardClient.perOwnerPricingPlans.rawList(),
    dashboardClient.sitePlans.rawList(),
  ]);

  return {
    perOwnerLimits: perOwnerPlans[0]!.attributes.limits,
    perSiteAttributes: perSitePlans[0]!.attributes,
  };
}

function isValidLimitId(
  limitId: string | null,
  perOwnerLimits: { id: string }[],
  perSiteAttributes: Record<string, unknown>,
): boolean {
  if (!limitId) return false;

  const existsInPerOwnerPlan = perOwnerLimits.some((limit) => limit.id === limitId);
  const existsInPerSitePlan =
    limitId in perSiteAttributes && !PER_SITE_PLAN_RESERVED_ATTRIBUTES.includes(limitId);

  return existsInPerOwnerPlan && existsInPerSitePlan;
}

async function handlePricingHint(pricingHint: RawApiTypes.Item<PricingHint>, dryMode: boolean) {
  const { perOwnerLimits, perSiteAttributes } = await fetchPricingPlans();
  const limitId = pricingHint.attributes.api_id;

  if (!isValidLimitId(limitId, perOwnerLimits, perSiteAttributes)) {
    if (!dryMode) {
      await cmaClient.items.destroy(pricingHint.id);
    }
    return errorResponse(`Limit "${limitId}" is invalid`);
  }

  return validResponse('All good!');
}

async function handlePlanFeature(planFeature: RawApiTypes.Item<PlanFeature>, dryMode: boolean) {
  if (!planFeature.attributes.related_pricing_hint) {
    return validResponse('Does not have a related pricing hint');
  }

  const hint = await cmaClient.items.find<PricingHint>(planFeature.attributes.related_pricing_hint);
  const limitId = hint.api_id;

  const { data: plans } = await dashboardClient.perOwnerPricingPlans.rawList();
  const limit = plans[0]!.attributes.limits.find((l) => l.id === limitId);

  const isValidLimitType = limit && VALID_FEATURE_LIMIT_TYPES.includes(limit.type);

  if (!isValidLimitType) {
    const errorMessage = !limit ? 'Limit not found' : `Invalid limit type: ${limit.type}`;

    if (!dryMode) {
      await cmaClient.items.rawUpdate<PlanFeature>(planFeature.id, {
        data: {
          id: planFeature.id,
          type: 'item',
          attributes: { related_pricing_hint: null },
          meta: { current_version: planFeature.meta.current_version },
        },
      });
    }

    return errorResponse(errorMessage);
  }

  return validResponse('All good!');
}

export const OPTIONS: APIRoute = () => {
  return new Response('OK', withCORS());
};

export const POST: APIRoute = async ({ url, request }) => {
  try {
    const token = url.searchParams.get('token');
    const dryMode = Boolean(url.searchParams.get('dry'));

    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    const { entity: item } = (await request.json()) as Payload;

    item.__itemTypeId = item.relationships.item_type.data.id;

    switch (item.__itemTypeId) {
      case ITEM_TYPE_IDS.PLAN_FEATURE:
        return handlePlanFeature(item, dryMode);
      case ITEM_TYPE_IDS.PRICING_HINT:
        return handlePricingHint(item, dryMode);
      default:
        return validResponse(`Item type not handled: ${item.__itemTypeId}`);
    }
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
