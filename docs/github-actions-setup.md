# GitHub Actions セットアップガイド

## 概要

このプロジェクトでは、GitHub Actionsを使用したCI/CDパイプラインを推奨しています。
権限の関係でワークフローファイルを直接プッシュできないため、以下の手順で手動セットアップしてください。

## セットアップ手順

### 1. ワークフローファイルの作成

リポジトリのルートに以下のディレクトリとファイルを作成してください：

```
.github/
└── workflows/
    └── test.yml
```

### 2. test.yml の内容

以下の内容を `.github/workflows/test.yml` にコピーしてください：

```yaml
name: Test

on:
  push:
    branches: [main, develop, 'claude/**']
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: bingo_user
          POSTGRES_PASSWORD: bingo_password
          POSTGRES_DB: bingo_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup database
        env:
          DATABASE_URL: postgresql://bingo_user:bingo_password@localhost:5432/bingo_db
        run: |
          npx prisma generate
          npx prisma migrate deploy

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        env:
          DATABASE_URL: postgresql://bingo_user:bingo_password@localhost:5432/bingo_db
        run: npm test

      - name: Build project
        env:
          DATABASE_URL: postgresql://bingo_user:bingo_password@localhost:5432/bingo_db
        run: npm run build
```

### 3. コミット＆プッシュ

```bash
git add .github/workflows/test.yml
git commit -m "Add GitHub Actions workflow for CI/CD"
git push
```

## ワークフローの説明

### トリガー

- `main`, `develop`, `claude/**` ブランチへのpush
- `main`, `develop` ブランチへのPull Request

### 実行内容

1. **PostgreSQLサービスコンテナ起動**
   - PostgreSQL 16 Alpine版
   - ヘルスチェック設定

2. **コードチェックアウト**
   - actions/checkout@v4 使用

3. **Node.js環境セットアップ**
   - Node.js 20
   - npm キャッシュ有効化

4. **依存関係インストール**
   - `npm ci` で確定的なインストール

5. **データベースセットアップ**
   - Prismaクライアント生成
   - マイグレーション実行

6. **リント実行**
   - ESLint検証

7. **ユニットテスト実行**
   - Jest テスト

8. **プロジェクトビルド**
   - Next.jsビルド検証

## トラブルシューティング

### テストが失敗する場合

1. PostgreSQLサービスが正常に起動しているか確認
2. DATABASE_URL環境変数が正しいか確認
3. Prismaマイグレーションが正常に実行されたか確認

### ビルドが失敗する場合

1. TypeScriptの型エラーがないか確認
2. 依存関係が正しくインストールされているか確認

## カスタマイズ

### E2Eテストの追加

Playwrightを使用したE2Eテストを追加する場合：

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

### カバレッジレポート

カバレッジを計測する場合：

```yaml
- name: Run tests with coverage
  run: npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## 参考リンク

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [actions/checkout](https://github.com/actions/checkout)
- [actions/setup-node](https://github.com/actions/setup-node)
