FROM node:20-bookworm AS builder

WORKDIR /app

# Кэшируем зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем остальной код
COPY . .

# Production build
RUN npm run build
