# syntax=docker/dockerfile:1.2

# -- Create a build image for the react app --
FROM node:18-alpine AS build

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Set the environment variables
ARG NEXT_PUBLIC_VERCEL_URL \
	NEXT_PUBLIC_QWACKER_API_URL

ENV NEXT_PUBLIC_QWACKER_API_URL=${NEXT_PUBLIC_QWACKER_API_URL} \
	NEXT_PUBLIC_VERCEL_URL=${NEXT_PUBLIC_VERCEL_URL}

# Mount the .npmrc file as a secret and install dependencies
RUN --mount=type=secret,id=npm_token \
  echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/npm_token)" >> .npmrc \
  && npm ci \
  && npm cache clean --force \
  && rm -f .npmrc

COPY . .

# Build the app
RUN npm run build



# -- Create a image to run the app --
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Set some environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the app package, package-lock.json and next.config.js file to the app directory
COPY --from=build --chown=node:node /app/package*.json /app/next.config.js ./

# Mount the .npmrc file as a secret and install dependencies
RUN --mount=type=secret,id=npm_token \
  echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/npm_token)" >> .npmrc \
  && npm ci \
  && npm cache clean --force \
  && rm -f .npmrc

# Copy the public and .next folder from the previous stage and limit the permissions to the node user
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next ./.next

# Set the node user as the current user
USER node

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start", "--", "-p", "3000"]

# docker build -t app-pizza-hawaii --secret id=npmrc,src=.npmrc .
# docker run -p 3000:3000 --env-file .env app-pizza-hawaii
