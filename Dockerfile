# Multi-stage builds allow us to create intermediate images for building
# while keeping the final production image clean and minimal.

# ==== Base stage ====
# Sets up the foundation that other stages will build upon

FROM node:20-alpine AS base

# Flag to indicate we're running in a Docker environment
ENV INSIDE_DOCKER=true

# Set the working directory for all subsequent operations
WORKDIR /app

# Copy package files for dependency installation
# Copying these separately from the rest of the code allows better caching
# If dependencies haven't changed, Docker can reuse cached layers
COPY package.json package-lock.json ./

# ==== Production dependencies stage ====
# This stage installs only the dependencies needed for production

FROM base AS prod-deps

# --omit=dev flag excludes development dependencies not needed in production
RUN npm install --omit=dev

# ==== Build dependencies stage ====

# This stage includes ALL dependencies (including dev dependencies)
# needed for building the application

FROM base AS build-deps

RUN npm install

# ==== Build stage ====
# This is where the actual application building happens

FROM build-deps AS build

# Copy all source code files
COPY . .

# Generate GraphQL schema using gql.tada
# Uses Docker's secret mount to securely pass the API token
# The secret won't be included in any intermediate or final image layers
RUN --mount=type=secret,id=DATOCMS_API_TOKEN \
    npx gql.tada generate schema https://graphql.datocms.com --header "X-Exclude-Invalid: true" --header "Authorization: $(cat /run/secrets/DATOCMS_API_TOKEN)"

# Build the actual Astro standalone production server
RUN --mount=type=secret,id=RECAPTCHA_KEY \
    RECAPTCHA_KEY=$(cat /run/secrets/RECAPTCHA_KEY) \
    npm run build

# ==== Runtime stage ====
# This is the final production image that will actually run the application.

# It only contains:
# * Node.js runtime (from base image)
# * Production dependencies (from prod-deps stage)
# * Built application files (from build stage)

# It excludes:
# * Source code
# * Development dependencies
# * Build tools
# * Build secrets

FROM base AS runtime

# Copy only the production dependencies from the prod-deps stage
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy only the built application files from the build stage
COPY --from=build /app/dist ./dist

# Copy config/crontab
COPY config/crontab .

# Configure the application's runtime environment
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs