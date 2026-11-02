/**
 * The role line of a review: "Role at Company". The company is a separate
 * field of the review. A review with no company shows only the role.
 */
export function reviewRole(role: string | null, company: string | null) {
  const trimmedRole = role?.trim();
  const trimmedCompany = company?.trim();
  if (trimmedRole && trimmedCompany) return `${trimmedRole} at ${trimmedCompany}`;
  return trimmedRole || trimmedCompany || null;
}
