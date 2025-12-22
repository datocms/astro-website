import { formatNumberInBytes, formatNumberInMetricSystem } from '~/lib/formatters';
import type { Limit } from './perOwnerPricingPlans';

export const hasUnit = (limitId: string) => {
  return limitId.endsWith('days') || limitId.endsWith('seconds') || limitId.endsWith('bytes');
};

export const limitLabel = (limitId: string) => {
  if (limitId === 'item_types') {
    return 'models';
  }

  if (limitId === 'build_triggers') {
    return 'build triggers';
  }

  if (limitId === 'traffic_bytes') {
    return 'traffic';
  }

  if (limitId === 'api_calls') {
    return 'API calls';
  }

  if (limitId === 'mux_encoding_seconds') {
    return 'uploaded footage';
  }

  if (limitId === 'mux_streaming_seconds') {
    return 'video streaming time';
  }

  if (limitId === 'items') {
    return 'records';
  }

  if (limitId === 'uploadable_bytes') {
    return 'storage';
  }

  if (limitId === 'users') {
    return 'collaborator';
  }

  if (limitId === 'locales') {
    return 'locale';
  }

  if (limitId === 'sites') {
    return 'project';
  }

  return limitId;
};

export const formatValue = (limitId: string, value: number): string => {
  if (limitId === 'support_level') {
    return value === 1 ? 'Community-based' : 'Mon/Fri, response in 24h';
  }

  if (limitId.endsWith('days')) {
    return `${value} days`;
  }

  if (limitId.endsWith('minutes')) {
    return `${value} minutes`;
  }

  if (limitId.endsWith('seconds')) {
    const minutes = Math.round(value / 60);
    const formatted = minutes.toLocaleString('en-US');
    return `${formatted} mins`;
  }

  if (limitId.endsWith('bytes')) {
    return formatNumberInBytes(value);
  }

  return formatNumberInMetricSystem(value);
};

export const perMonth = (name: string, value: string) => {
  if (
    ['api_calls', 'mux_encoding_seconds', 'mux_streaming_seconds', 'traffic_bytes'].includes(name)
  ) {
    return `${value}/mo`;
  }

  return value;
};

export const formatLimit = (limit: Limit) => {
  if (
    limit.type === 'activable_feature' ||
    limit.type === 'boolean_system_limit' ||
    limit.type === 'countable_system_limit' ||
    limit.type === 'possibly_incompatible_countable_system_limit'
  ) {
    return formatLimitRaw(limit);
  }

  if (
    limit.type === 'per_site_quota_managed_site_resource' ||
    limit.type === 'per_environment_quota_managed_site_resource'
  ) {
    return `${formatLimitRaw(limit)} included per project`;
  }

  return limit.extra_packet_amount
    ? `${formatLimitRaw(limit)} included`
    : `${formatLimitRaw(limit)}`;
};

export const formatLimitRaw = (limit: Limit): string | boolean => {
  if (limit.type === 'activable_feature' || limit.type === 'boolean_system_limit') {
    return limit.available;
  }

  if (
    limit.type === 'countable_system_limit' ||
    limit.type === 'possibly_incompatible_countable_system_limit'
  ) {
    return formatValue(limit.id, limit.limit);
  }

  if (limit.type === 'per_site_quota_managed_site_resource') {
    return perMonth(limit.id, formatValue(limit.id, limit.free_of_charge_per_site_usage));
  }

  if (limit.type === 'per_environment_quota_managed_site_resource') {
    return perMonth(limit.id, formatValue(limit.id, limit.free_of_charge_per_environment_usage));
  }

  return perMonth(limit.id, formatValue(limit.id, limit.free_of_charge_usage));
};

export const formatUpperBoundLimitRaw = (limit: Limit) => {
  if (
    limit.type !== 'owner_managed_resource' &&
    limit.type !== 'shared_quota_managed_site_resource' &&
    limit.type !== 'per_site_quota_managed_site_resource' &&
    limit.type !== 'per_environment_quota_managed_site_resource'
  ) {
    return undefined;
  }

  const includedUsage =
    limit.type === 'per_site_quota_managed_site_resource'
      ? limit.free_of_charge_per_site_usage
      : limit.type === 'per_environment_quota_managed_site_resource'
        ? limit.free_of_charge_per_environment_usage
        : limit.free_of_charge_usage;

  return formatValue(
    limit.id,
    includedUsage + (limit.max_extra_packets || 0) * (limit.extra_packet_amount || 0),
  );
};

export const formatExtra = (limit: Limit) => {
  if (!('extra_packet_amount' in limit) || !limit.extra_packet_amount) {
    return null;
  }

  return limit.extra_packet_amount === 1
    ? `€${limit.extra_packet_price}/mo per extra ${limitLabel(limit.id)}`
    : `€${limit.extra_packet_price}/mo every ${formatValue(limit.id, limit.extra_packet_amount)} ${hasUnit(limit.id) ? ' of ' : ' '} extra ${limitLabel(limit.id).replace(/_/g, ' ')}`;
};
