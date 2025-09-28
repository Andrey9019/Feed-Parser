# --- Stage 1: Build ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

COPY . .
# Генерація Prisma
RUN npx prisma generate --schema=./src/prisma/schema.prisma
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Копіюємо package.json та package-lock.json для продакшен-залежностей
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --production --frozen-lockfile

# Копіюємо зібраний код
COPY --from=build /app/build ./build
COPY --from=build /app/src/prisma/generated/prisma ./src/prisma/generated/prisma

# Виставляємо порт
EXPOSE 3000

# Команда для запуску
CMD ["npm", "start"]