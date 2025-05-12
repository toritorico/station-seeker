# Build stage
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build app with environment variables
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Create a .env file for Vite to use during build
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env

# Ensure environment variable is available at build time
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy built files from build stage to nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
