FROM node:latest

# 必要なパッケージのインストールとアップデート
RUN apt-get update \
    && apt-get install -y \
    # 追加のパッケージをここに列挙する
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# アプリケーションの依存関係をインストール
COPY /my-app/yarn.lock ./
RUN yarn install --frozen-lockfile