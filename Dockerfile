# ビルドステージ
FROM node:23-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ランタイムステージ
FROM node:23-alpine

# Alpineのセキュリティアップデートを適用
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# 非rootユーザーを作成
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package*.json ./
RUN npm install --production && npm cache clean --force

# 非rootユーザーに切り替え
USER nodejs

ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080

# dumb-initを使用してプロセスを管理
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/main.js"]
