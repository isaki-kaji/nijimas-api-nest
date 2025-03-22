# ベースイメージ
FROM node:18-alpine

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# ソースコードのコピー
COPY . .

# ビルド
RUN npm run build

ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080


# アプリケーションの起動
CMD ["node", "dist/src/main.js"]
