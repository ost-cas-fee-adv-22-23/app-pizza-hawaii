# syntax=docker/dockerfile:1.2

# -- Create a base docker image for the react app --
FROM node:18-alpine AS base

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./



# -- Create a build image --
FROM base as build

# Mount the .npmrc file as a secret and install dependencies
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci

COPY . .

# Build the app
RUN npm run build



# -- Create a blank production image --
FROM base AS production

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Mount the .npmrc file as a secret and install dependencies
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci

# Copy the public and .next folder from the previous stage and limit the permissions to the node user
COPY --from=build /app/next.config.js ./
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
