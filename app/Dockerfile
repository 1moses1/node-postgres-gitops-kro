FROM node:20-alpine as base

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN chown -R appuser:appgroup /usr/src/app
USER appuser

EXPOSE 80
CMD ["npm", "start"]