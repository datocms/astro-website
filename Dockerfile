# taken from https://docs.astro.build/en/recipes/docker/#multi-stage-build-using-ssr

FROM node:20 AS base

ENV INSIDE_DOCKER=true

WORKDIR /app

COPY package.json package-lock.json ./

FROM base AS prod-deps
RUN npm install --omit=dev

FROM base AS build-deps
RUN npm install

FROM build-deps AS build
COPY . .

RUN --mount=type=secret,id=DATOCMS_API_TOKEN \
    npx gql.tada generate schema https://graphql.datocms.com --header "X-Exclude-Invalid: true" --header "Authorization: $(cat /run/secrets/DATOCMS_API_TOKEN)"

RUN --mount=type=secret,id=RECAPTCHA_KEY \
    RECAPTCHA_KEY=$(cat /run/secrets/RECAPTCHA_KEY) \
    npm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN --mount=type=secret,id=FASTLY_SERVICE_ID \
    --mount=type=secret,id=FASTLY_KEY \
    curl -i -X POST "https://api.fastly.com/service/$(cat /run/secrets/FASTLY_SERVICE_ID)/purge_all" -H "Fastly-Key: $(cat /run/secrets/FASTLY_KEY)" -H "Accept: application/json"

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD node ./dist/server/entry.mjs