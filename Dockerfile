# build docker
FROM node:18-alpine as build

# main application directory
WORKDIR /app

ARG NPM_TOKEN
RUN echo "@smartive-education:registry=https://npm.pkg.github.com" > .npmrc \
	&& echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > .npmrc

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm ci

COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies from the image
FROM node:18-alpine as production
ENV NODE_ENV=production

WORKDIR /app

# Copy local directories to the current local directory of our docker image (/app)
COPY --from=build /app/package*.json ./
COPY --from=build /app/.npmrc ./

# Install node packages (only production dependencies)
RUN npm ci

# Delete the .npmrc file
RUN rm -f .npmrc

# Copy the public folder from the previous stage
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next


# Expose port 3000
EXPOSE 3000

# Run the app under a non-root user allow /app and home directory to be writable
RUN adduser -D myuser \
	&& chown -R myuser /app

# USER myuser

# Start the app
# CMD npm run start

CMD ["npm", "run", "start"]

# docker build -t app-pizza-hawaii . --build-arg NPM_TOKEN=$NPM_TOKEN
# docker run -p 3000:3000 --env-file .env app-pizza-hawaii

