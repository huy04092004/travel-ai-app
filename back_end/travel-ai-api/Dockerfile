# Travel AI API - Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

EXPOSE 3000

CMD ["node", "./bin/www"]
