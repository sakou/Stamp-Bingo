# Full-Stack Web Application Development Skill

このスキルは、Next.js + TypeScript + Prisma を使った高品質なフルスタックWebアプリケーションを効率的に開発するためのガイドです。

## 概要

このスキルは以下をカバーします：
- 要件定義から本番デプロイまでの完全な開発フロー
- TDD（テスト駆動開発）アプローチ
- Docker完全セットアップ（ローカル環境にNode/DBを入れない）
- CI/CD統合（GitHub Actions）
- Next.js 15の最新ベストプラクティス

## 使い方

```
私と一緒に[アプリの概要]を作成したいです。
fullstack-webapp-developmentスキルを使って進めてください。

要件：
- [主要機能の箇条書き]
- [技術的制約があれば]
- [期待するユーザー体験]
```

---

## 開発フロー

### Phase 1: 要件定義と設計 (Design First)

#### 1.1 要件のヒアリング
- **目的**: 曖昧さを排除し、実装前に合意を得る
- **アクション**:
  ```
  以下を確認します：
  1. 主要機能とユースケース
  2. 想定ユーザー数・負荷（例：Vercel無料枠で耐えられるか）
  3. 技術的制約（Docker必須、特定ライブラリ使用など）
  4. 開発環境の前提（ローカルにDB/Node入れる？入れない？）
  ```

#### 1.2 設計書作成
- **作成するドキュメント**:
  - `docs/design/requirements.md` - 要件定義書
  - `docs/design/architecture.md` - アーキテクチャ設計
  - `docs/design/database.md` - データベース設計（ER図）
  - `docs/design/ui-design.md` - 画面設計・ワイヤーフレーム
  - `docs/design/technical-stack.md` - 技術スタック選定理由

- **レビューポイント**:
  - ユーザーに設計書をレビューしてもらい、合意を得る
  - この段階で手戻りを防ぐことが最重要

#### 1.3 技術スタック決定
- **推奨スタック（2025年時点）**:
  ```typescript
  // フロントエンド
  - Next.js 15 (App Router)
  - React 19
  - TypeScript 5.6+
  - Tailwind CSS

  // バックエンド
  - Next.js Server Actions
  - Prisma 6 ORM
  - PostgreSQL 16

  // テスト
  - Jest + React Testing Library（ユニット・コンポーネント）
  - Playwright（E2E）

  // インフラ
  - Docker + Docker Compose（ローカル開発）
  - Vercel（本番デプロイ）
  - GitHub Actions（CI/CD）
  ```

---

### Phase 2: 環境構築

#### 2.1 プロジェクト初期化
```bash
# Next.js 15プロジェクト作成
npx create-next-app@latest --typescript --tailwind --app --use-npm

# 必須パッケージ
npm install prisma @prisma/client
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D ts-node  # ← 重要：Jest設定でTypeScript使用時に必須
```

#### 2.2 Docker完全セットアップ
**重要**: ユーザーが「ローカル環境にNode/DBを入れたくない」と言った場合は必須

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: app_password
      POSTGRES_DB: app_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    environment:
      DATABASE_URL: postgresql://app_user:app_password@postgres:5432/app_db
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
```

```dockerfile
# Dockerfile.dev
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

```dockerfile
# Dockerfile.test (E2Eテスト用)
FROM mcr.microsoft.com/playwright:v1.40.0-jammy
WORKDIR /app
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs
COPY package*.json ./
RUN npm ci
RUN npx playwright install --with-deps chromium
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "test:e2e"]
```

```
# .dockerignore
node_modules
.next
.git
dist
build
*.log
.env.local
```

**package.json scripts:**
```json
{
  "scripts": {
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:reset": "docker-compose down -v && docker-compose up -d",
    "docker:logs": "docker-compose logs -f app",
    "docker:test": "docker-compose exec app npm test",
    "docker:e2e": "docker-compose exec app npm run test:e2e"
  }
}
```

#### 2.3 Prisma セットアップ
```bash
npx prisma init

# schema.prisma 作成後
npx prisma migrate dev --name init
npx prisma generate

# シードデータ作成
# prisma/seed.ts を作成
```

**package.json に追加:**
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

#### 2.4 テスト環境セットアップ

**jest.config.ts:**
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
}

export default createJestConfig(config)
```

**playwright.config.ts:**
```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  // Docker環境では外部でサーバーを起動する想定
  webServer: process.env.SKIP_WEB_SERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
})
```

---

### Phase 3: TDD実装（Test-Driven Development）

#### 3.1 実装順序
```
1. データモデル（Prisma schema）
2. ビジネスロジック（ユニットテスト → 実装）
3. バリデーション（ユニットテスト → 実装）
4. Server Actions（統合テスト → 実装）
5. UIコンポーネント（コンポーネントテスト → 実装）
6. E2Eテスト（シナリオテスト → 修正）
```

#### 3.2 テストファイル構成
```
__tests__/
├── unit/
│   ├── lib/
│   │   ├── core-logic.test.ts
│   │   └── validation.test.ts
│   └── components/
│       ├── Button.test.tsx
│       └── Form.test.tsx
├── integration/
│   └── actions/
│       └── server-actions.test.ts
└── e2e/
    ├── user-flow.spec.ts
    └── admin-flow.spec.ts
```

#### 3.3 テストのベストプラクティス

**ユニットテスト例:**
```typescript
// __tests__/unit/lib/validation.test.ts
import { validateEmail } from '@/lib/validation'

describe('validateEmail', () => {
  it('有効なメールアドレスを受け入れる', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })

  it('無効なメールアドレスを拒否する', () => {
    expect(validateEmail('invalid')).toBe(false)
  })
})
```

**コンポーネントテスト例:**
```typescript
// __tests__/unit/components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/LoginForm'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('LoginForm', () => {
  it('フォームが正しくレンダリングされる', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument()
  })

  it('バリデーションエラーを表示する', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /ログイン/i })
    await user.click(submitButton)

    expect(await screen.findByText(/メールアドレスを入力してください/i)).toBeInTheDocument()
  })
})
```

**E2Eテスト例:**
```typescript
// __tests__/e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test'

test('ユーザーがログインできる', async ({ page }) => {
  await page.goto('/login')

  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('ようこそ')).toBeVisible()
})
```

---

### Phase 4: Next.js 15 特有の注意点

#### 4.1 動的ルートの params は Promise
```typescript
// ❌ 古い書き方（Next.js 14以前）
export default async function Page({ params }: { params: { id: string } }) {
  const data = await getData(params.id)
  // ...
}

// ✅ 新しい書き方（Next.js 15）
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getData(id)
  // ...
}
```

#### 4.2 Server Actions のベストプラクティス
```typescript
// app/actions/example.ts
'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function login(formData: FormData) {
  // バリデーション
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { success: false, error: 'Invalid input' }
  }

  // ビジネスロジック
  try {
    // ...
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Login failed' }
  }
}
```

#### 4.3 Client Component の明示
```typescript
// components/InteractiveButton.tsx
'use client'  // ← 必須

import { useState } from 'react'

export default function InteractiveButton() {
  const [count, setCount] = useState(0)
  // ...
}
```

---

### Phase 5: CI/CD セットアップ（GitHub Actions）

#### 5.1 ワークフロー作成
```yaml
# .github/workflows/test.yml
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
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
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
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: |
          npx prisma generate
          npx prisma migrate deploy

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: npm test

      - name: Build project
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: npm run build

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Start Next.js app
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: |
          npm run start &
          npx wait-on http://localhost:3000 --timeout 60000

      - name: Run E2E tests
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
          PLAYWRIGHT_BASE_URL: http://localhost:3000
          SKIP_WEB_SERVER: '1'  # ← 重要：既にサーバー起動済みなのでPlaywrightの自動起動を無効化
        run: npm run test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**重要な注意点:**
- `SKIP_WEB_SERVER: '1'` - Playwrightが既存のサーバーを使うように指示
- `wait-on` パッケージ必須: `npm install -D wait-on`
- GitHub App権限では `.github/workflows/` の変更をプッシュできない → 手動で追加が必要

---

### Phase 6: 本番デプロイ（Vercel）

#### 6.1 環境変数設定
Vercel ダッシュボードで設定:
```
DATABASE_URL=postgresql://...  (Vercel Postgres または外部DB)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### 6.2 Prisma セットアップ
`package.json` に追加:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

#### 6.3 デプロイ前チェックリスト
- [ ] 環境変数が全て設定されている
- [ ] データベースマイグレーションが適用済み
- [ ] シードデータが投入済み（必要な場合）
- [ ] ビルドがローカルで成功する
- [ ] E2Eテストが通る
- [ ] パフォーマンステスト完了

---

## ベストプラクティス

### 1. 進捗管理（TodoWrite）
```typescript
// 必ずTodoWriteツールを使って進捗を可視化する
TodoWrite([
  { content: "設計書作成", status: "completed", activeForm: "設計書作成中" },
  { content: "Prismaスキーマ作成", status: "in_progress", activeForm: "Prismaスキーマ作成中" },
  { content: "ビジネスロジック実装", status: "pending", activeForm: "ビジネスロジック実装中" },
])
```

### 2. 自律的な進行
- ユーザーが「確認事項がない限り自律的に進めて良い」と言った場合は、推奨パターンを選択して進める
- 重要な意思決定が必要な場合のみ確認を求める

### 3. コミットメッセージ
```
[機能/修正の種類]: 簡潔な説明

## 詳細
- 変更内容の箇条書き
- 理由や背景

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 4. 並列処理
- 独立したタスクは並列で実行（複数ファイル読み込み、複数テスト実行など）
- 依存関係があるタスクは順次実行

---

## よくある落とし穴と対処法

### 1. Next.js 15 の params が Promise
**症状**: ビルド時に型エラー
**対処**: `const { id } = await params` の形式に変更

### 2. Playwright の二重起動
**症状**: `Error: http://localhost:3000 is already used`
**対処**: `SKIP_WEB_SERVER: '1'` 環境変数を設定

### 3. ts-node がない
**症状**: `Jest: 'ts-node' is required for the TypeScript configuration files`
**対処**: `npm install -D ts-node`

### 4. GitHub App権限
**症状**: `.github/workflows/` の変更がプッシュできない
**対処**: ユーザーに手動でファイル作成・編集してもらう

### 5. Prisma Client 未生成
**症状**: `@prisma/client did not initialize yet`
**対処**: `npx prisma generate` を実行

### 6. Docker でホットリロードが効かない
**症状**: コード変更が反映されない
**対処**: volume マウント設定を確認（`- .:/app`）

### 7. テストで "multiple elements" エラー
**症状**: `Found multiple elements with the text: XXX`
**対処**: `getAllByText` または `container.textContent` を使用

---

## チェックリスト

### 設計フェーズ
- [ ] 要件定義書作成
- [ ] データベース設計（ER図）
- [ ] 画面設計・ワイヤーフレーム
- [ ] 技術スタック選定
- [ ] ユーザーレビュー・承認

### 環境構築フェーズ
- [ ] Next.js プロジェクト初期化
- [ ] Prisma セットアップ
- [ ] Jest + React Testing Library セットアップ
- [ ] Playwright セットアップ
- [ ] Docker Compose 作成（必要な場合）
- [ ] ts-node インストール

### 実装フェーズ
- [ ] データモデル定義
- [ ] マイグレーション実行
- [ ] シードデータ作成
- [ ] ビジネスロジック（TDD）
- [ ] バリデーション（TDD）
- [ ] Server Actions（TDD）
- [ ] UIコンポーネント（TDD）
- [ ] E2Eテスト

### テストフェーズ
- [ ] ユニットテスト全件パス
- [ ] コンポーネントテスト全件パス
- [ ] 統合テスト全件パス
- [ ] E2Eテスト全件パス
- [ ] Linter チェック
- [ ] ビルド成功

### CI/CDフェーズ
- [ ] GitHub Actions ワークフロー作成
- [ ] PostgreSQL サービス設定
- [ ] テスト自動実行確認
- [ ] ビルド自動実行確認
- [ ] E2Eテスト自動実行確認

### デプロイフェーズ
- [ ] 環境変数設定
- [ ] データベース接続確認
- [ ] マイグレーション適用
- [ ] シードデータ投入
- [ ] 本番ビルド成功
- [ ] 本番デプロイ成功
- [ ] 動作確認

---

## まとめ

このスキルを使うことで：
✅ 設計フェーズで手戻りを防ぐ
✅ TDDで品質を担保
✅ Docker完全セットアップで環境差異をなくす
✅ CI/CDで継続的に品質チェック
✅ Next.js 15のベストプラクティスに準拠

次回のプロジェクトでこのスキルを参照することで、効率的かつ高品質なWebアプリケーションを構築できます。
