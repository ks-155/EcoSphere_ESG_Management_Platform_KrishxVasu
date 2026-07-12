FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN pnpm run build

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
