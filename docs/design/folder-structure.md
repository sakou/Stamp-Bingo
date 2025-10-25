# フォルダ構成設計書

## 1. ドキュメント情報

| 項目 | 詳細 |
|:---|:---|
| **プロジェクト名** | 4店舗合同 ビンゴスタンプラリー |
| **バージョン** | 1.0 |
| **作成日** | 2025-10-25 |
| **最終更新日** | 2025-10-25 |
| **フレームワーク** | Next.js 16 (App Router) |

---

## 2. プロジェクト全体構成

```
bingo-stamp-rally/
├── .github/                     # GitHub関連設定
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD設定
│
├── .husky/                      # Git hooks設定
│   ├── pre-commit              # コミット前チェック
│   └── pre-push                # プッシュ前チェック
│
├── app/                         # Next.js App Router
│   ├── (user)/                 # 利用者向けルートグループ
│   │   ├── page.tsx            # ビンゴカード画面 (/)
│   │   ├── layout.tsx          # 利用者レイアウト
│   │   └── loading.tsx         # ローディング画面
│   │
│   ├── admin/                  # 管理者向けルート
│   │   ├── login/
│   │   │   └── page.tsx        # 管理者ログイン
│   │   ├── events/
│   │   │   ├── page.tsx        # イベント一覧（ダッシュボード）
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # イベント作成
│   │   │   └── [id]/
│   │   │       ├── edit/
│   │   │       │   └── page.tsx   # イベント編集
│   │   │       ├── stats/
│   │   │       │   └── page.tsx   # イベント統計
│   │   │       └── qr/
│   │   │           └── page.tsx   # QRコード生成
│   │   ├── layout.tsx          # 管理者レイアウト
│   │   └── actions/            # 管理者用Server Actions
│   │       ├── event.ts        # イベント操作
│   │       ├── statistics.ts   # 統計取得
│   │       └── prize.ts        # 景品引換
│   │
│   ├── api/                    # API Routes
│   │   ├── qr/
│   │   │   └── generate/
│   │   │       └── route.ts    # QRコード生成API
│   │   └── events/
│   │       └── active/
│   │           └── route.ts    # アクティブイベント取得API
│   │
│   ├── actions/                # 利用者向けServer Actions
│   │   ├── stamp.ts            # スタンプ獲得処理
│   │   └── bingo.ts            # ビンゴカード取得・判定
│   │
│   ├── layout.tsx              # ルートレイアウト
│   ├── globals.css             # グローバルCSS
│   └── not-found.tsx           # 404ページ
│
├── components/                  # 共通コンポーネント
│   ├── user/                   # 利用者向けコンポーネント
│   │   ├── BingoCard.tsx       # ビンゴカード
│   │   ├── BingoCell.tsx       # ビンゴセル
│   │   ├── PrizeModal.tsx      # 景品モーダル
│   │   ├── EventHeader.tsx     # イベントヘッダー
│   │   ├── StoreSection.tsx    # 店舗セクション
│   │   ├── StoreCard.tsx       # 店舗カード
│   │   ├── HowToPlay.tsx       # 遊び方セクション
│   │   ├── Conditions.tsx      # 参加条件セクション
│   │   └── Prizes.tsx          # 景品セクション
│   │
│   ├── admin/                  # 管理者向けコンポーネント
│   │   ├── EventForm.tsx       # イベント作成・編集フォーム
│   │   ├── EventCard.tsx       # イベントカード（一覧用）
│   │   ├── StatsCard.tsx       # 統計カード
│   │   ├── QRCodeDisplay.tsx   # QRコード表示
│   │   └── Sidebar.tsx         # サイドバーナビゲーション
│   │
│   └── ui/                     # 共通UIコンポーネント
│       ├── Button.tsx          # ボタン
│       ├── Input.tsx           # 入力フィールド
│       ├── Textarea.tsx        # テキストエリア
│       ├── Modal.tsx           # モーダル
│       ├── Tabs.tsx            # タブ
│       ├── Card.tsx            # カード
│       └── Toast.tsx           # トースト通知
│
├── lib/                        # ユーティリティ・ヘルパー
│   ├── prisma.ts               # Prisma クライアントインスタンス
│   ├── auth.ts                 # NextAuth.js設定
│   ├── bingo-logic.ts          # ビンゴ判定ロジック
│   ├── qr-generator.ts         # QRコード生成
│   ├── rate-limit.ts           # レート制限
│   ├── validation.ts           # バリデーション関数
│   ├── date-utils.ts           # 日付ユーティリティ
│   └── constants.ts            # 定数定義
│
├── hooks/                      # カスタムReact Hooks
│   ├── useBingoCard.ts         # ビンゴカード状態管理
│   ├── useStampAcquisition.ts  # スタンプ獲得処理
│   └── useToast.ts             # トースト通知
│
├── types/                      # TypeScript型定義
│   ├── index.ts                # 共通型
│   ├── event.ts                # イベント関連型
│   ├── bingo.ts                # ビンゴ関連型
│   ├── store.ts                # 店舗関連型
│   └── api.ts                  # APIレスポンス型
│
├── prisma/                     # Prisma関連
│   ├── schema.prisma           # データベーススキーマ
│   ├── migrations/             # マイグレーションファイル
│   └── seed.ts                 # シードデータ
│
├── public/                     # 静的ファイル
│   ├── images/                 # 画像
│   │   ├── logo.png
│   │   └── stores/
│   ├── icons/                  # アイコン
│   └── favicon.ico
│
├── __tests__/                  # テスト
│   ├── unit/                   # ユニットテスト
│   │   ├── lib/
│   │   │   └── bingo-logic.test.ts
│   │   └── actions/
│   │       └── stamp.test.ts
│   └── e2e/                    # E2Eテスト
│       ├── stamp-flow.spec.ts
│       └── admin-flow.spec.ts
│
├── docs/                       # ドキュメント
│   ├── requirements.md         # 要件定義書
│   └── design/                 # 設計書
│       ├── system-design.md
│       ├── database-design.md
│       ├── api-design.md
│       ├── screen-design.md
│       └── folder-structure.md
│
├── .env.local                  # 環境変数（ローカル、Gitignore）
├── .env.example                # 環境変数テンプレート
├── .eslintrc.json              # ESLint設定
├── .prettierrc                 # Prettier設定
├── .gitignore                  # Git除外設定
├── next.config.ts              # Next.js設定
├── tailwind.config.ts          # Tailwind CSS設定
├── tsconfig.json               # TypeScript設定
├── package.json                # npm依存関係
├── pnpm-lock.yaml              # pnpmロックファイル
└── README.md                   # プロジェクト説明
```

---

## 3. 主要ディレクトリ詳細

### 3-1. app/ (Next.js App Router)

Next.js 16のApp Routerを使用したルーティング構造。

#### ルートグループ `(user)/`

利用者向け画面。認証不要。

```typescript
// app/(user)/page.tsx
import { getBingoCard } from '@/app/actions/bingo'
import BingoCard from '@/components/user/BingoCard'
import EventHeader from '@/components/user/EventHeader'

export default async function HomePage({
  searchParams
}: {
  searchParams: { event?: string; store?: string }
}) {
  const eventId = searchParams.event || await getActiveEventId()
  const data = await getBingoCard(eventId)

  return (
    <div>
      <EventHeader eventInfo={data.eventInfo} />
      <BingoCard
        progress={data.progress}
        stores={data.stores}
        prizes={data.prizes}
        eventId={eventId}
        storeCode={searchParams.store}
      />
      {/* その他のセクション */}
    </div>
  )
}
```

#### 管理者ルート `admin/`

認証必須。`middleware.ts`でアクセス制限。

```typescript
// app/admin/events/page.tsx
import { getEvents } from '@/app/admin/actions/event'
import EventCard from '@/components/admin/EventCard'

export default async function AdminDashboard() {
  const events = await getEvents()

  return (
    <div>
      <h1>イベント管理</h1>
      {events.active && <EventCard event={events.active} />}
      <h2>過去のイベント</h2>
      {events.past.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

#### Server Actions

サーバーサイドロジックを`'use server'`ディレクティブで定義。

```typescript
// app/actions/stamp.ts
'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { checkBingoLines } from '@/lib/bingo-logic'

export async function processStamp(
  eventId: string,
  storeCode: 'a' | 'b' | 'c' | 'd'
): Promise<StampResult> {
  // 処理実装
}
```

---

### 3-2. components/

再利用可能なReactコンポーネント。

#### 命名規則

- **PascalCase**: コンポーネント名（例: `BingoCard.tsx`）
- **Client Component**: `'use client'`を明示的に記述
- **Server Component**: デフォルト（ディレクティブ不要）

#### ディレクトリ分割

```
components/
├── user/        # 利用者向け（主にClient Components）
├── admin/       # 管理者向け（Client/Server混在）
└── ui/          # 共通UIパーツ（汎用的）
```

#### 例: BingoCard.tsx

```typescript
// components/user/BingoCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { processStamp } from '@/app/actions/stamp'
import BingoCell from './BingoCell'
import PrizeModal from './PrizeModal'
import { useBingoCard } from '@/hooks/useBingoCard'

interface BingoCardProps {
  progress: Progress
  stores: Stores
  prizes: Prizes
  eventId: string
  storeCode?: string
}

export default function BingoCard({
  progress,
  stores,
  prizes,
  eventId,
  storeCode
}: BingoCardProps) {
  const { cells, handleStamp } = useBingoCard(progress, eventId)

  useEffect(() => {
    if (storeCode) {
      handleStamp(storeCode)
    }
  }, [storeCode])

  return (
    <div className="grid grid-cols-5 gap-2">
      {cells.map((cell, index) => (
        <BingoCell key={index} {...cell} />
      ))}
    </div>
  )
}
```

---

### 3-3. lib/

ビジネスロジック、ユーティリティ関数。

#### lib/bingo-logic.ts

ビンゴ判定の核心ロジック。

```typescript
// lib/bingo-logic.ts

// ビンゴカード配置定義（5×5 = 25セル）
const BINGO_LAYOUT = [
  // Row 0
  { store: 'a', visit: 1 }, { store: 'c', visit: 1 }, { store: 'b', visit: 1 }, { store: 'd', visit: 1 }, { store: 'b', visit: 2 },
  // Row 1
  { store: 'b', visit: 3 }, { store: 'd', visit: 2 }, { store: 'c', visit: 2 }, { store: 'a', visit: 2 }, { store: 'a', visit: 3 },
  // Row 2
  { store: 'c', visit: 3 }, { store: 'a', visit: 4 }, { store: 'free', visit: 0 }, { store: 'b', visit: 4 }, { store: 'd', visit: 3 },
  // Row 3
  { store: 'd', visit: 4 }, { store: 'b', visit: 5 }, { store: 'a', visit: 5 }, { store: 'c', visit: 4 }, { store: 'd', visit: 5 },
  // Row 4
  { store: 'a', visit: 6 }, { store: 'c', visit: 5 }, { store: 'd', visit: 6 }, { store: 'c', visit: 6 }, { store: 'b', visit: 6 },
]

// ビンゴライン定義（12本）
const BINGO_LINES = [
  // 横5本
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // 縦5本
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // 斜め2本
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
]

/**
 * ユーザーの進捗からビンゴライン数を計算
 */
export function checkBingoLines(progress: Progress): number {
  const completedCells = new Set<number>()

  // 各セルの達成状態をチェック
  BINGO_LAYOUT.forEach((cell, index) => {
    if (cell.store === 'free') {
      completedCells.add(index)
    } else {
      const visits = progress[`store${cell.store.toUpperCase()}Visits` as keyof Progress]
      if (visits >= cell.visit) {
        completedCells.add(index)
      }
    }
  })

  // ビンゴライン数をカウント
  let lineCount = 0
  for (const line of BINGO_LINES) {
    if (line.every(cellIndex => completedCells.has(cellIndex))) {
      lineCount++
    }
  }

  return lineCount
}

/**
 * セルの達成状態を配列で返す
 */
export function getCellStates(progress: Progress): boolean[] {
  return BINGO_LAYOUT.map((cell) => {
    if (cell.store === 'free') return true

    const visits = progress[`store${cell.store.toUpperCase()}Visits` as keyof Progress]
    return visits >= cell.visit
  })
}
```

---

### 3-4. types/

TypeScript型定義の一元管理。

```typescript
// types/event.ts
export interface Event {
  id: string
  name: string
  description: string | null
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'ended'
  conditions: string | null
}

// types/bingo.ts
export interface Progress {
  storeAVisits: number
  storeBVisits: number
  storeCVisits: number
  storeDVisits: number
}

export interface BingoCell {
  store: 'a' | 'b' | 'c' | 'd' | 'free'
  visit: number
  isCompleted: boolean
}

// types/store.ts
export interface Store {
  code: 'a' | 'b' | 'c' | 'd'
  name: string
  description: string | null
  instagramUrl: string | null
  twitterUrl: string | null
  tiktokUrl: string | null
}

// types/api.ts
export interface StampResult {
  success: boolean
  message: string
  progress?: Progress
  newLineAchievement?: {
    lineCount: number
    prizeName: string
    prizeDescription: string
  }
  error?: {
    code: string
    message: string
  }
}
```

---

### 3-5. prisma/

データベーススキーマとマイグレーション。

```
prisma/
├── schema.prisma           # スキーマ定義
├── migrations/
│   ├── 20250425_init/
│   │   └── migration.sql
│   └── migration_lock.toml
└── seed.ts                 # シードデータ
```

#### seed.ts（開発用テストデータ）

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 管理者ユーザー作成
  await prisma.adminUser.create({
    data: {
      email: 'admin@example.com',
      passwordHash: await hash('admin123'),
      name: '管理者太郎',
      role: 'admin',
    },
  })

  // テストイベント作成
  const event = await prisma.event.create({
    data: {
      id: 'evt_2025_spring_001',
      name: '春の4店舗合同ビンゴラリー',
      description: '4店舗を巡って豪華景品をゲット！',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-30'),
      status: 'active',
      conditions: '① コラボメニューを注文\n② 店舗のInstagramをフォロー',
    },
  })

  // 店舗情報作成
  await prisma.store.createMany({
    data: [
      { eventId: event.id, storeCode: 'a', name: 'A店', instagramUrl: 'https://instagram.com/store_a' },
      { eventId: event.id, storeCode: 'b', name: 'B店', instagramUrl: 'https://instagram.com/store_b' },
      { eventId: event.id, storeCode: 'c', name: 'C店', instagramUrl: 'https://instagram.com/store_c' },
      { eventId: event.id, storeCode: 'd', name: 'D店', instagramUrl: 'https://instagram.com/store_d' },
    ],
  })

  // 景品設定作成
  await prisma.prize.createMany({
    data: [
      { eventId: event.id, lineCount: 1, name: '10%割引クーポン', validUntil: new Date('2025-05-31') },
      { eventId: event.id, lineCount: 2, name: '¥1,000食事券', validUntil: new Date('2025-05-31') },
      { eventId: event.id, lineCount: 3, name: '¥5,000食事券', validUntil: new Date('2025-06-30') },
    ],
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
```

実行コマンド:
```bash
npx prisma db seed
```

---

### 3-6. middleware.ts

認証チェックとリダイレクト。

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // /adminで始まるパスは認証必須
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'admin' || token?.role === 'super_admin'
      }
      return true
    },
  },
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

## 4. 設定ファイル詳細

### 4-1. next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 画像最適化
  images: {
    domains: ['instagram.com', 'x.com', 'tiktok.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // 実験的機能
  experimental: {
    typedRoutes: true,
  },

  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/events',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

### 4-2. tailwind.config.ts

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          500: '#8b5cf6',
          700: '#6d28d9',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

### 4-3. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4-4. package.json

```json
{
  "name": "bingo-stamp-rally",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "test": "jest",
    "test:e2e": "playwright test",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "prisma db seed",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^6.0.0",
    "next-auth": "^5.0.0",
    "bcrypt": "^5.1.1",
    "qrcode": "^1.5.3",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^4.0.0",
    "prisma": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^16.0.0",
    "prettier": "^3.1.1",
    "jest": "^29.7.0",
    "@playwright/test": "^1.40.0",
    "husky": "^8.0.0"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## 5. 環境変数設定

### 5-1. .env.example

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bingo_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 5-2. Vercel環境変数

| 変数名 | 説明 | 環境 |
|:---|:---|:---|
| `DATABASE_URL` | Vercel Postgres接続URL | Production, Preview |
| `NEXTAUTH_URL` | 本番URL | Production |
| `NEXTAUTH_SECRET` | 認証シークレット | Production, Preview |
| `NEXT_PUBLIC_BASE_URL` | 公開URL | Production |

---

## 6. 開発ワークフロー

### 6-1. ローカル開発開始

```bash
# 1. リポジトリクローン
git clone https://github.com/your-org/bingo-stamp-rally.git
cd bingo-stamp-rally

# 2. 依存関係インストール
pnpm install

# 3. 環境変数設定
cp .env.example .env.local
# .env.local を編集

# 4. データベースマイグレーション
pnpm prisma:migrate

# 5. シードデータ投入
pnpm prisma:seed

# 6. 開発サーバー起動
pnpm dev
```

### 6-2. 新機能開発フロー

```bash
# 1. featureブランチ作成
git checkout -b feature/new-feature

# 2. コード実装

# 3. テスト実行
pnpm test

# 4. リント・フォーマット
pnpm lint
pnpm format

# 5. コミット
git add .
git commit -m "feat: add new feature"

# 6. プッシュ
git push origin feature/new-feature

# 7. Pull Request作成
```

### 6-3. デプロイフロー

```mermaid
graph LR
    A[feature branch] -->|PR| B[main branch]
    B -->|自動デプロイ| C[Vercel Production]
    A -->|PR作成| D[Vercel Preview]
```

---

## 7. テストディレクトリ構成

```
__tests__/
├── unit/
│   ├── lib/
│   │   ├── bingo-logic.test.ts
│   │   ├── validation.test.ts
│   │   └── date-utils.test.ts
│   └── actions/
│       ├── stamp.test.ts
│       └── event.test.ts
│
└── e2e/
    ├── stamp-flow.spec.ts
    ├── admin-flow.spec.ts
    └── fixtures/
        └── test-data.ts
```

### ユニットテスト例

```typescript
// __tests__/unit/lib/bingo-logic.test.ts
import { checkBingoLines } from '@/lib/bingo-logic'

describe('checkBingoLines', () => {
  it('should return 0 for no visits', () => {
    const progress = { storeAVisits: 0, storeBVisits: 0, storeCVisits: 0, storeDVisits: 0 }
    expect(checkBingoLines(progress)).toBe(0)
  })

  it('should return 1 for first horizontal line', () => {
    const progress = { storeAVisits: 1, storeBVisits: 2, storeCVisits: 1, storeDVisits: 1 }
    expect(checkBingoLines(progress)).toBe(1)
  })
})
```

---

## 8. 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|:---|:---|:---|:---|
| 2025-10-25 | 1.0 | 初版作成 | - |
