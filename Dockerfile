# syntax=docker/dockerfile:1.2

# -- Create a build image for the react app --
FROM node:18-alpine AS build

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Mount the .npmrc file as a secret and install dependencies
RUN --mount=type=secret,id=npm_token \
  echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/npm_token)" >> .npmrc \
  && npm ci \
  && rm -f .npmrc

COPY . .

# Build the app
RUN npm run build



# -- Create a image to run the app --
FROM node:18-alpine AS production

# The /app directory should act as the main application directory
WORKDIR /app

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Copy the app package, package-lock.json and next.config.js file to the app directory
COPY --from=build --chown=node:node /app/package*.json /app/next.config.js ./

# Mount the .npmrc file as a secret and install dependencies (yes, we do not copy node_modules because we don't want all the dev dependencies in the production image) and clean up
RUN --mount=type=secret,id=npm_token \
  echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/npm_token)" >> .npmrc \
  && npm ci && npm cache clean --force \
  && rm -f .npmrc

# Copy the public and .next folder from the previous stage and limit the permissions to the node user
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next ./.next

# Expose port 3000
EXPOSE 3000

# Set the node user as the current user
USER node

# Start the app
CMD npm run start

# docker build -t app-pizza-hawaii --secret id=npmrc,src=.npmrc .
# docker run -p 3000:3000 --env-file .env app-pizza-hawaii
