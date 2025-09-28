# --- Stage 1 : Build ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i --frozen-lockfile

COPY . .
# Генерация Prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

# --- Stage 2 : Runtime ---
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Копируєм package.json та package-lock.json для встановлення продакшн залежностей

COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm i --production --frozen-lockfile

# Копируєм Prisma schema та генеруєм клиєнт
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
# Копіюєм зібраний код з першого етапу
COPY --from=build /app/build ./build

# Виставляєм порт
EXPOSE 3000
# Команда для запуску додатку
CMD ["node", "build/index.js"]