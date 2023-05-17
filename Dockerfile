# -- Create a base docker image for the react app --
FROM node:18-alpine as base

# Define environment variables
ARG NPM_TOKEN

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Set the npm token for the github package registry
RUN npm config set //npm.pkg.github.com/:_authToken $NPM_TOKEN



# -- Create a build image --
FROM base as build

# Install node packages
RUN npm ci

COPY . .

# Build the app
RUN npm run build



# -- Create a production image --
FROM base as production

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Install node packages (only production dependencies)
RUN npm ci

# Copy the public folder from the previous stage
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

# Expose port 3000
EXPOSE 3000

# Create a user to run the app without root privileges
RUN adduser -D myuser \
	&& chown -R myuser /app

# Set the created user as the current user
USER myuser

# Start the app
# CMD npm run start
CMD ["npm", "run", "start"]

# docker build -t app-pizza-hawaii . --build-arg NPM_TOKEN=$NPM_TOKEN
# docker run -p 3000:3000 --env-file .env app-pizza-hawaii
