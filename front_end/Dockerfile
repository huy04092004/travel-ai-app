# Travel AI - Frontend (Expo Web)
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

EXPOSE 19006

# Start Expo web server - accessible from host
CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"]
