# Development stage
FROM ghcr.io/puppeteer/puppeteer:21.5.2 as development

# Create a non-root user
RUN adduser --disabled-password myuser

WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Switch to the non-root user
USER myuser

# Install npm globally
RUN npm install -g npm@10.3.0

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM ghcr.io/puppeteer/puppeteer:21.5.2 as production

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Switch to the non-root user
USER myuser

# Install npm globally
RUN npm install -g npm@10.3.0

# Install production dependencies only
RUN npm install --production

# Copy the compiled code from the development stage
COPY --from=development /app/dist ./dist

# Specify the command to run your application
CMD ["node", "dist/server.js"]
