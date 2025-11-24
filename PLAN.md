# Plan: Duplicate Content Management API Documentation for Dashboard API

## Overview

Create a complete documentation section for the DatoCMS Dashboard API by duplicating the existing Content Management API documentation structure and adapting it to use the Dashboard API schema.

## Key Differences

- **Schema URL**: `https://site-api.datocms.com/docs/account-api-hyperschema.json`
- **URL Path**: `/docs/dashboard-api` instead of `/docs/content-management-api`
- **API Name**: "Dashboard API" (not "Account API") instead of "Content Management API"
- **Kicker Text**: "Dashboard API" instead of "Content Management API"
- **No Errors Section**: Dashboard API does not have documented error codes (skip errors.astro)

## File Structure to Create

```
src/pages/docs/dashboard-api/
├── index.astro                            # Main landing page
├── [slug]/
│   ├── index.astro                        # Dynamic page handler
│   └── _graphql.ts                        # Sitemap/routing utilities
└── resources/
    └── [entitySlug]/
        ├── index.astro                    # Resource overview page
        ├── _style.module.css              # Shared styles (can reuse)
        ├── _graphql.ts                    # Sitemap for resource endpoints
        └── [endpointRel]/
            ├── index.astro                # Individual endpoint page
            └── _graphql.ts                # Sitemap for endpoints
```

## Implementation Steps

### 0. Refactor existing code to separate shared vs API-specific logic

**Goal**: Move API-specific code out of the generic `restApi` components into separate `cmaApi` and `dashboardApi` modules.

#### 0.1. Create CMA-specific modules

- **Create**: `src/components/docs/cmaApi/fetchSchema.ts`

  - Move current `fetchSchema.ts` content here
  - Keep URL: `https://site-api.datocms.com/docs/site-api-hyperschema.json`
  - **Rename functions** for clarity:
    - `fetchSchema` → `fetchCmaSchema`
    - `maybeInvalidateSiteApiHyperschema` → `maybeInvalidateCmaHyperschema`
    - `findEntity` → `findCmaEntity`
    - `findJobResultSelfEndoint` → `findCmaJobResultSelfEndpoint`

- **Create**: `src/components/docs/cmaApi/buildSidebarItems.ts`
  - Move current `buildSidebarItems.ts` content here
  - **Rename function**: `buildSidebarItems` → `buildCmaSidebarItems`
  - Update import to use `./fetchSchema` (local to cmaApi)
  - Update to call `fetchCmaSchema`
  - Keep URL paths: `/docs/content-management-api/resources/...`

#### 0.2. Update CMA page imports and function calls

Update all files in `src/pages/docs/content-management-api/` to import from the new locations and use renamed functions:

**Import changes:**

- `~/components/docs/restApi/fetchSchema` → `~/components/docs/cmaApi/fetchSchema`
- `~/components/docs/restApi/buildSidebarItems` → `~/components/docs/cmaApi/buildSidebarItems`

**Function call changes:**

- `fetchSchema` → `fetchCmaSchema`
- `buildSidebarItems` → `buildCmaSidebarItems`
- `findEntity` → `findCmaEntity`
- `findJobResultSelfEndoint` → `findCmaJobResultSelfEndpoint`

**Files to update:**

- `src/pages/docs/content-management-api/index.astro`
- `src/pages/docs/content-management-api/[slug]/index.astro`
- `src/pages/docs/content-management-api/resources/[entitySlug]/index.astro`
- `src/pages/docs/content-management-api/resources/[entitySlug]/_graphql.ts`
- `src/pages/docs/content-management-api/resources/[entitySlug]/[endpointRel]/index.astro`
- `src/pages/docs/content-management-api/resources/[entitySlug]/[endpointRel]/_graphql.ts`

#### 0.3. Delete old files from restApi

- **Delete**: `src/components/docs/restApi/fetchSchema.ts`
- **Delete**: `src/components/docs/restApi/buildSidebarItems.ts`

#### 0.4. Verify CMA still works

- Build the project and verify no import errors
- Test that CMA documentation pages still render correctly

### 1. Create Dashboard API specific modules

#### 1.1. Create Dashboard API schema fetcher

**File**: `src/components/docs/dashboardApi/fetchSchema.ts`

- Duplicate from `cmaApi/fetchSchema.ts`
- Change URL to `https://site-api.datocms.com/docs/account-api-hyperschema.json`
- Change data source key to `account-api-hyperschema`
- **Function names** (use Dashboard naming):
  - `fetchDashboardSchema`
  - `maybeInvalidateDashboardHyperschema`
  - `findDashboardEntity`
  - `findDashboardJobResultSelfEndpoint`

#### 1.2. Create Dashboard API sidebar builder

**File**: `src/components/docs/dashboardApi/buildSidebarItems.ts`

- Duplicate from `cmaApi/buildSidebarItems.ts`
- **Rename function**: `buildDashboardSidebarItems`
- Update import to use `./fetchSchema` (local to dashboardApi)
- Update to call `fetchDashboardSchema`
- Update URLs to use `/docs/dashboard-api/resources/...`

### 2. Create Dashboard API page structure

#### 2.1. Create main landing page

**File**: `src/pages/docs/dashboard-api/index.astro`

- Copy from `content-management-api/index.astro`
- Update `findGroupAndPage` to use `'dashboard-api'`
- Update import: `~/components/docs/dashboardApi/buildSidebarItems`
- Update function call: `buildDashboardSidebarItems`

#### 2.2. Create dynamic slug page

**File**: `src/pages/docs/dashboard-api/[slug]/index.astro`

- Copy from `content-management-api/[slug]/index.astro`
- Update page lookup to use `'dashboard-api/${Astro.params.slug}'`
- Update import: `~/components/docs/dashboardApi/buildSidebarItems`
- Update function call: `buildDashboardSidebarItems`

#### 2.3. Create dynamic slug routing utilities

**File**: `src/pages/docs/dashboard-api/[slug]/_graphql.ts`

- Copy from content-management-api (likely just exports empty/undefined)

#### 2.4. Create resource overview page

**File**: `src/pages/docs/dashboard-api/resources/[entitySlug]/index.astro`

- Copy from `content-management-api/resources/[entitySlug]/index.astro`
- Update import: `~/components/docs/dashboardApi/fetchSchema`
- Update import: `~/components/docs/dashboardApi/buildSidebarItems`
- Update function calls: `buildDashboardSidebarItems`, `findDashboardEntity`
- Update all URLs to `/docs/dashboard-api/resources/...`
- Update SEO titles: "Dashboard API" instead of "Content Management API"
- Update kicker text: "Dashboard API"

#### 2.5. Create resource routing utilities

**File**: `src/pages/docs/dashboard-api/resources/[entitySlug]/_graphql.ts`

- Copy from content-management-api version
- Update import: `~/components/docs/dashboardApi/fetchSchema`
- Update function call: `fetchDashboardSchema`
- Update URLs to `/docs/dashboard-api/resources/...`

#### 2.6. Copy shared styles

**File**: `src/pages/docs/dashboard-api/resources/[entitySlug]/_style.module.css`

- Copy from content-management-api version (identical styles)

#### 2.7. Create endpoint detail page

**File**: `src/pages/docs/dashboard-api/resources/[entitySlug]/[endpointRel]/index.astro`

- Copy from `content-management-api/resources/[entitySlug]/[endpointRel]/index.astro`
- Update import: `~/components/docs/dashboardApi/fetchSchema`
- Update import: `~/components/docs/dashboardApi/buildSidebarItems`
- Update function calls: `buildDashboardSidebarItems`, `findDashboardEntity`
- Update all URLs to `/docs/dashboard-api/resources/...`
- Update SEO and kicker text to "Dashboard API"
- Update group lookup to `'dashboard-api'`

#### 2.8. Create endpoint routing utilities

**File**: `src/pages/docs/dashboard-api/resources/[entitySlug]/[endpointRel]/_graphql.ts`

- Copy from content-management-api version
- Update import: `~/components/docs/dashboardApi/fetchSchema`
- Update function call: `fetchDashboardSchema`
- Update URLs to `/docs/dashboard-api/resources/...`

### 3. Handle JavaScript client examples (if needed)

**Check**: `src/components/docs/restApi/fetchRestApiEndpointJsClient.ts`

- Investigate if Dashboard API has JavaScript client support
- May need to parameterize or create separate fetcher for Dashboard API
- This may require additional investigation during implementation

## Testing Checklist

- [ ] Main landing page renders at `/docs/dashboard-api`
- [ ] Sidebar shows all Dashboard API resources grouped correctly
- [ ] Each resource page loads and displays endpoints
- [ ] Each endpoint page loads with proper documentation
- [ ] Code examples generate correctly (HTTP and JavaScript)
- [ ] SEO metadata is correct (titles, descriptions, og:image)
- [ ] Breadcrumbs show "Dashboard API"
- [ ] Language picker works (HTTP/JavaScript toggle)
- [ ] All internal links point to `/docs/dashboard-api/*`

## Notes

- Most components in `src/components/docs/restApi/` are generic and can be reused
- Main changes are in schema fetching and URL paths
- The Dashboard API should have similar structure to CMA (JSON:API format)
- Need to verify JavaScript client examples work for Dashboard API
