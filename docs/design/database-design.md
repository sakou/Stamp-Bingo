# データベース設計書

## 1. ドキュメント情報

| 項目 | 詳細 |
|:---|:---|
| **プロジェクト名** | 4店舗合同 ビンゴスタンプラリー |
| **バージョン** | 1.0 |
| **作成日** | 2025-10-25 |
| **最終更新日** | 2025-10-25 |
| **データベース** | PostgreSQL (Vercel Postgres) |
| **ORM** | Prisma 6.x |

---

## 2. データベース概要

### 2-1. テーブル一覧

| No. | テーブル名 | 概要 | 行数見積 |
|:---|:---|:---|:---|
| 1 | **events** | イベント基本情報 | 10-20/年 |
| 2 | **stores** | 店舗情報 | 4×イベント数 |
| 3 | **prizes** | 景品設定 | 3×イベント数 |
| 4 | **users** | ユーザー情報 | 100-200/イベント |
| 5 | **user_progress** | ユーザー進捗（訪問記録） | 100-200/イベント |
| 6 | **bingo_achievements** | ビンゴ達成記録 | 50-100/イベント |
| 7 | **admin_users** | 管理者アカウント | 2-5 |

### 2-2. ER図概要

```
┌──────────────┐
│   events     │──┐
└──────────────┘  │
                  │ 1:N
                  ▼
            ┌──────────────┐
            │   stores     │
            └──────────────┘

┌──────────────┐
│   events     │──┐
└──────────────┘  │
                  │ 1:N
                  ▼
            ┌──────────────┐
            │   prizes     │
            └──────────────┘

┌──────────────┐       ┌──────────────────────┐
│   events     │──────>│  user_progress       │
└──────────────┘  1:N  └──────────────────────┘
                             │
                             │ N:1
                             ▼
                       ┌──────────────┐
                       │   users      │
                       └──────────────┘

┌──────────────┐       ┌──────────────────────┐
│   events     │──────>│ bingo_achievements   │
└──────────────┘  1:N  └──────────────────────┘
                             │
                             │ N:1
                             ▼
                       ┌──────────────┐
                       │   users      │
                       └──────────────┘
```

---

## 3. テーブル定義

### 3-1. events（イベントテーブル）

イベントの基本情報を管理。

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|:---|:---|:---:|:---|:---|
| **id** | VARCHAR(50) | NO | - | イベントID（PK） 例: evt_2025_spring_001 |
| **name** | VARCHAR(200) | NO | - | イベント名 |
| **description** | TEXT | YES | NULL | イベント説明文 |
| **start_date** | DATE | NO | - | 開催開始日 |
| **end_date** | DATE | NO | - | 開催終了日 |
| **status** | VARCHAR(20) | NO | 'draft' | ステータス: draft / active / ended |
| **conditions** | TEXT | YES | NULL | 参加条件（改行含む） |
| **created_at** | TIMESTAMP | NO | NOW() | 作成日時 |
| **updated_at** | TIMESTAMP | NO | NOW() | 更新日時 |

**制約:**
- PRIMARY KEY: `id`
- UNIQUE: アクティブなイベントは1つのみ（アプリケーションロジックで制御）
- CHECK: `start_date <= end_date`
- CHECK: `status IN ('draft', 'active', 'ended')`

**インデックス:**
```sql
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
```

**サンプルデータ:**
```sql
INSERT INTO events VALUES (
  'evt_2025_spring_001',
  '春の4店舗合同ビンゴラリー',
  '4店舗を巡って豪華景品をゲット！',
  '2025-04-01',
  '2025-04-30',
  'active',
  '① コラボメニューを注文\n② 店舗のInstagramをフォロー',
  '2025-03-15 10:00:00',
  '2025-03-15 10:00:00'
);
```

---

### 3-2. stores（店舗テーブル）

イベントごとの店舗情報を管理。

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|:---|:---|:---:|:---|:---|
| **id** | SERIAL | NO | - | 店舗レコードID（PK） |
| **event_id** | VARCHAR(50) | NO | - | イベントID（FK） |
| **store_code** | VARCHAR(10) | NO | - | 店舗コード: a / b / c / d |
| **name** | VARCHAR(100) | NO | - | 店舗名 |
| **description** | TEXT | YES | NULL | 店舗説明 |
| **instagram_url** | VARCHAR(500) | YES | NULL | Instagram URL |
| **twitter_url** | VARCHAR(500) | YES | NULL | X (Twitter) URL |
| **tiktok_url** | VARCHAR(500) | YES | NULL | TikTok URL |
| **created_at** | TIMESTAMP | NO | NOW() | 作成日時 |
| **updated_at** | TIMESTAMP | NO | NOW() | 更新日時 |

**制約:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `event_id` REFERENCES `events(id)` ON DELETE CASCADE
- UNIQUE: `(event_id, store_code)`
- CHECK: `store_code IN ('a', 'b', 'c', 'd')`

**インデックス:**
```sql
CREATE INDEX idx_stores_event_id ON stores(event_id);
CREATE UNIQUE INDEX idx_stores_event_code ON stores(event_id, store_code);
```

**サンプルデータ:**
```sql
INSERT INTO stores VALUES (
  DEFAULT,
  'evt_2025_spring_001',
  'a',
  'カフェレストラン A',
  '心温まるカフェ',
  'https://instagram.com/store_a',
  'https://x.com/store_a',
  'https://tiktok.com/@store_a',
  NOW(),
  NOW()
);
```

---

### 3-3. prizes（景品テーブル）

イベントごとの景品設定を管理。

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|:---|:---|:---:|:---|:---|
| **id** | SERIAL | NO | - | 景品レコードID（PK） |
| **event_id** | VARCHAR(50) | NO | - | イベントID（FK） |
| **line_count** | INTEGER | NO | - | ビンゴライン数: 1 / 2 / 3 |
| **name** | VARCHAR(200) | NO | - | 景品名 |
| **description** | TEXT | YES | NULL | 景品説明 |
| **valid_until** | DATE | YES | NULL | 有効期限 |
| **created_at** | TIMESTAMP | NO | NOW() | 作成日時 |
| **updated_at** | TIMESTAMP | NO | NOW() | 更新日時 |

**制約:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `event_id` REFERENCES `events(id)` ON DELETE CASCADE
- UNIQUE: `(event_id, line_count)`
- CHECK: `line_count IN (1, 2, 3)`

**インデックス:**
```sql
CREATE INDEX idx_prizes_event_id ON prizes(event_id);
CREATE UNIQUE INDEX idx_prizes_event_line ON prizes(event_id, line_count);
```

**サンプルデータ:**
```sql
INSERT INTO prizes VALUES (
  DEFAULT,
  'evt_2025_spring_001',
  1,
  '10%割引クーポン',
  '次回利用時に使える割引クーポン',
  '2025-05-31',
  NOW(),
  NOW()
);
```

---

### 3-4. users（ユーザーテーブル）

参加ユーザーの基本情報を管理。

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|:---|:---|:---:|:---|:---|
| **id** | VARCHAR(36) | NO | - | ユーザーID（UUID、PK） |
| **instagram_id** | VARCHAR(100) | YES | NULL | Instagram ID（@なし） |
| **created_at** | TIMESTAMP | NO | NOW() | 初回参加日時 |
| **updated_at** | TIMESTAMP | NO | NOW() | 更新日時 |

**制約:**
- PRIMARY KEY: `id`
- UNIQUE: `instagram_id`（NULL許可）

**インデックス:**
```sql
CREATE INDEX idx_users_instagram ON users(instagram_id);
```

**サンプルデータ:**
```sql
INSERT INTO users VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'tanaka_taro',
  NOW(),
  NOW()
);
```

---

### 3-5. user_progress（ユーザー進捗テーブル）

ユーザーのイベント参加状況と訪問記録を管理。

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|:---|:---|:---:|:---|:---|
| **id** | SERIAL | NO | - | レコードID（PK） |
| **user_id** | VARCHAR(36) | NO | - | ユーザーID（FK） |
| **event_id** | VARCHAR(50) | NO | - | イベントID（FK） |
| **store_a_visits** | INTEGER | NO | 0 | A店の訪問回数（0-6） |
| **store_b_visits** | INTEGER | NO | 0 | B店の訪問回数（0-6） |
| **store_c_visits** | INTEGER | NO | 0 | C店の訪問回数（0-6） |
| **store_d_visits** | INTEGER | NO | 0 | D店の訪問回数（0-6） |
| **last_stamp_at** | TIMESTAMP | YES | NULL | 最終スタンプ獲得日時 |
| **created_at** | TIMESTAMP | NO | NOW() | 作成日時 |
| **updated_at** | TIMESTAMP | NO | NOW() | 更新日時 |

**制約:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `event_id` REFERENCES `events(id)` ON DELETE CASCADE
- UNIQUE: `(user_id, event_id)`
- CHECK: `store_a_visits BETWEEN 0 AND 6`
- CHECK: `store_b_visits BETWEEN 0 AND 6`
- CHECK: `store_c_visits BETWEEN 0 AND 6`
- CHECK: `store_d_visits BETWEEN 0 AND 6`

**インデックス:**
```sql
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_event_id ON user_progress(event_id);
CREATE UNIQUE INDEX idx_user_progress_user_event ON user_progress(user_id, event_id);
```

**サンプルデータ:**
```sql
INSERT INTO user_progress VALUES (
  DEFAULT,
  '550e8400-e29b-41d4-a716-446655440000',
  'evt_2025_spring_001',
  3,  -- A店3回訪問
  2,  -- B店2回訪問
  1,  -- C店1回訪問
  0,  -- D店0回訪問
  '2025-04-10 18:30:00',
  NOW(),
  NOW()
);
```

---

### 3-6. bingo_achievements（ビンゴ達成記録テーブル）

ビンゴライン達成の記録を管理。

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|:---|:---|:---:|:---|:---|
| **id** | SERIAL | NO | - | レコードID（PK） |
| **user_id** | VARCHAR(36) | NO | - | ユーザーID（FK） |
| **event_id** | VARCHAR(50) | NO | - | イベントID（FK） |
| **line_count** | INTEGER | NO | - | 達成ライン数: 1 / 2 / 3 |
| **is_redeemed** | BOOLEAN | NO | FALSE | 景品引換済みフラグ |
| **redeemed_at** | TIMESTAMP | YES | NULL | 景品引換日時 |
| **redeemed_store** | VARCHAR(10) | YES | NULL | 引換店舗コード |
| **achieved_at** | TIMESTAMP | NO | NOW() | 達成日時 |
| **created_at** | TIMESTAMP | NO | NOW() | 作成日時 |

**制約:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `event_id` REFERENCES `events(id)` ON DELETE CASCADE
- UNIQUE: `(user_id, event_id, line_count)`
- CHECK: `line_count IN (1, 2, 3)`
- CHECK: `redeemed_store IN ('a', 'b', 'c', 'd')` OR NULL

**インデックス:**
```sql
CREATE INDEX idx_bingo_achievements_user_id ON bingo_achievements(user_id);
CREATE INDEX idx_bingo_achievements_event_id ON bingo_achievements(event_id);
CREATE UNIQUE INDEX idx_bingo_achievements_unique ON bingo_achievements(user_id, event_id, line_count);
CREATE INDEX idx_bingo_achievements_redeemed ON bingo_achievements(is_redeemed);
```

**サンプルデータ:**
```sql
INSERT INTO bingo_achievements VALUES (
  DEFAULT,
  '550e8400-e29b-41d4-a716-446655440000',
  'evt_2025_spring_001',
  1,
  TRUE,
  '2025-04-12 14:20:00',
  'a',
  '2025-04-10 18:30:00',
  NOW()
);
```

---

### 3-7. admin_users（管理者ユーザーテーブル）

管理者アカウント情報を管理。

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|:---|:---|:---:|:---|:---|
| **id** | SERIAL | NO | - | 管理者ID（PK） |
| **email** | VARCHAR(255) | NO | - | メールアドレス |
| **password_hash** | VARCHAR(255) | NO | - | パスワードハッシュ（bcrypt） |
| **name** | VARCHAR(100) | NO | - | 管理者名 |
| **role** | VARCHAR(20) | NO | 'admin' | 役割: admin / super_admin |
| **is_active** | BOOLEAN | NO | TRUE | アクティブフラグ |
| **last_login_at** | TIMESTAMP | YES | NULL | 最終ログイン日時 |
| **created_at** | TIMESTAMP | NO | NOW() | 作成日時 |
| **updated_at** | TIMESTAMP | NO | NOW() | 更新日時 |

**制約:**
- PRIMARY KEY: `id`
- UNIQUE: `email`
- CHECK: `role IN ('admin', 'super_admin')`

**インデックス:**
```sql
CREATE UNIQUE INDEX idx_admin_users_email ON admin_users(email);
```

**サンプルデータ:**
```sql
-- パスワード: admin123 (本番環境では強固なパスワードを使用)
INSERT INTO admin_users VALUES (
  DEFAULT,
  'admin@example.com',
  '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEF',
  '管理者太郎',
  'admin',
  TRUE,
  NULL,
  NOW(),
  NOW()
);
```

---

## 4. Prisma スキーマ定義

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// イベント
model Event {
  id          String   @id @db.VarChar(50)
  name        String   @db.VarChar(200)
  description String?  @db.Text
  startDate   DateTime @map("start_date") @db.Date
  endDate     DateTime @map("end_date") @db.Date
  status      String   @default("draft") @db.VarChar(20)
  conditions  String?  @db.Text
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  stores             Store[]
  prizes             Prize[]
  userProgress       UserProgress[]
  bingoAchievements  BingoAchievement[]

  @@index([status])
  @@index([startDate, endDate])
  @@map("events")
}

// 店舗
model Store {
  id           Int      @id @default(autoincrement())
  eventId      String   @map("event_id") @db.VarChar(50)
  storeCode    String   @map("store_code") @db.VarChar(10)
  name         String   @db.VarChar(100)
  description  String?  @db.Text
  instagramUrl String?  @map("instagram_url") @db.VarChar(500)
  twitterUrl   String?  @map("twitter_url") @db.VarChar(500)
  tiktokUrl    String?  @map("tiktok_url") @db.VarChar(500)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([eventId, storeCode])
  @@index([eventId])
  @@map("stores")
}

// 景品
model Prize {
  id          Int       @id @default(autoincrement())
  eventId     String    @map("event_id") @db.VarChar(50)
  lineCount   Int       @map("line_count")
  name        String    @db.VarChar(200)
  description String?   @db.Text
  validUntil  DateTime? @map("valid_until") @db.Date
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([eventId, lineCount])
  @@index([eventId])
  @@map("prizes")
}

// ユーザー
model User {
  id          String   @id @db.VarChar(36)
  instagramId String?  @unique @map("instagram_id") @db.VarChar(100)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  userProgress      UserProgress[]
  bingoAchievements BingoAchievement[]

  @@index([instagramId])
  @@map("users")
}

// ユーザー進捗
model UserProgress {
  id           Int       @id @default(autoincrement())
  userId       String    @map("user_id") @db.VarChar(36)
  eventId      String    @map("event_id") @db.VarChar(50)
  storeAVisits Int       @default(0) @map("store_a_visits")
  storeBVisits Int       @default(0) @map("store_b_visits")
  storeCVisits Int       @default(0) @map("store_c_visits")
  storeDVisits Int       @default(0) @map("store_d_visits")
  lastStampAt  DateTime? @map("last_stamp_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([userId, eventId])
  @@index([userId])
  @@index([eventId])
  @@map("user_progress")
}

// ビンゴ達成記録
model BingoAchievement {
  id            Int       @id @default(autoincrement())
  userId        String    @map("user_id") @db.VarChar(36)
  eventId       String    @map("event_id") @db.VarChar(50)
  lineCount     Int       @map("line_count")
  isRedeemed    Boolean   @default(false) @map("is_redeemed")
  redeemedAt    DateTime? @map("redeemed_at")
  redeemedStore String?   @map("redeemed_store") @db.VarChar(10)
  achievedAt    DateTime  @default(now()) @map("achieved_at")
  createdAt     DateTime  @default(now()) @map("created_at")

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([userId, eventId, lineCount])
  @@index([userId])
  @@index([eventId])
  @@index([isRedeemed])
  @@map("bingo_achievements")
}

// 管理者ユーザー
model AdminUser {
  id           Int       @id @default(autoincrement())
  email        String    @unique @db.VarChar(255)
  passwordHash String    @map("password_hash") @db.VarChar(255)
  name         String    @db.VarChar(100)
  role         String    @default("admin") @db.VarChar(20)
  isActive     Boolean   @default(true) @map("is_active")
  lastLoginAt  DateTime? @map("last_login_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  @@index([email])
  @@map("admin_users")
}
```

---

## 5. データベース操作例

### 5-1. イベント作成時のトランザクション

```typescript
// イベント + 店舗 + 景品を一括作成
const result = await prisma.$transaction(async (tx) => {
  // イベント作成
  const event = await tx.event.create({
    data: {
      id: 'evt_2025_spring_001',
      name: '春の4店舗合同ビンゴラリー',
      description: '4店舗を巡って豪華景品をゲット！',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-30'),
      status: 'draft',
      conditions: '① コラボメニューを注文\n② 店舗のInstagramをフォロー',
    },
  });

  // 店舗情報作成（4件）
  await tx.store.createMany({
    data: [
      { eventId: event.id, storeCode: 'a', name: 'A店', instagramUrl: '...' },
      { eventId: event.id, storeCode: 'b', name: 'B店', instagramUrl: '...' },
      { eventId: event.id, storeCode: 'c', name: 'C店', instagramUrl: '...' },
      { eventId: event.id, storeCode: 'd', name: 'D店', instagramUrl: '...' },
    ],
  });

  // 景品設定作成（3件）
  await tx.prize.createMany({
    data: [
      { eventId: event.id, lineCount: 1, name: '10%割引クーポン', validUntil: new Date('2025-05-31') },
      { eventId: event.id, lineCount: 2, name: '¥1,000食事券', validUntil: new Date('2025-05-31') },
      { eventId: event.id, lineCount: 3, name: '¥5,000食事券', validUntil: new Date('2025-06-30') },
    ],
  });

  return event;
});
```

### 5-2. スタンプ獲得処理

```typescript
// ユーザーがA店でQRコードをスキャン
const userId = '550e8400-e29b-41d4-a716-446655440000';
const eventId = 'evt_2025_spring_001';
const storeCode = 'a';

const progress = await prisma.userProgress.upsert({
  where: {
    userId_eventId: { userId, eventId },
  },
  update: {
    storeAVisits: { increment: 1 },
    lastStampAt: new Date(),
  },
  create: {
    userId,
    eventId,
    storeAVisits: 1,
    lastStampAt: new Date(),
  },
});
```

### 5-3. ビンゴ判定クエリ

```typescript
// ユーザーの現在の進捗を取得
const progress = await prisma.userProgress.findUnique({
  where: {
    userId_eventId: { userId, eventId },
  },
});

// ビンゴカード配置に基づいてライン数をカウント
// （アプリケーションロジックで実装）
const lineCount = calculateBingoLines(progress);

// ビンゴ達成記録を作成
if (lineCount > 0) {
  await prisma.bingoAchievement.upsert({
    where: {
      userId_eventId_lineCount: { userId, eventId, lineCount },
    },
    update: {},
    create: {
      userId,
      eventId,
      lineCount,
      achievedAt: new Date(),
    },
  });
}
```

### 5-4. 統計データ取得

```typescript
// イベントの参加者数
const participantCount = await prisma.userProgress.count({
  where: { eventId },
});

// ビンゴ達成者数（ライン数別）
const line1Count = await prisma.bingoAchievement.count({
  where: { eventId, lineCount: 1 },
});

const line2Count = await prisma.bingoAchievement.count({
  where: { eventId, lineCount: 2 },
});

const line3Count = await prisma.bingoAchievement.count({
  where: { eventId, lineCount: 3 },
});

// 景品引換数
const redeemedCount = await prisma.bingoAchievement.count({
  where: { eventId, isRedeemed: true },
});
```

---

## 6. マイグレーション戦略

### 6-1. 初回マイグレーション

```bash
# Prismaスキーマからマイグレーションファイル生成
npx prisma migrate dev --name init

# 本番環境へのマイグレーション適用
npx prisma migrate deploy
```

### 6-2. スキーマ変更時の手順

1. `schema.prisma` を編集
2. ローカル環境でマイグレーション作成: `npx prisma migrate dev --name <変更内容>`
3. マイグレーションファイルをGitにコミット
4. Vercel環境変数に `DATABASE_URL` を設定
5. デプロイ時に自動的に `prisma migrate deploy` が実行される

### 6-3. データバックアップ戦略

| 対象 | 方法 | 頻度 |
|:---|:---|:---|
| **全体バックアップ** | Vercel Postgres自動バックアップ | 日次 |
| **イベント終了時** | `pg_dump` で手動バックアップ | イベント終了時 |
| **本番環境更新前** | スナップショット作成 | デプロイ前 |

---

## 7. パフォーマンス考慮事項

### 7-1. インデックス戦略

| テーブル | インデックス | 理由 |
|:---|:---|:---|
| **events** | status | アクティブイベント検索 |
| **events** | (start_date, end_date) | 期間検索 |
| **user_progress** | (user_id, event_id) | 進捗取得の高速化 |
| **bingo_achievements** | (user_id, event_id, line_count) | ビンゴ達成チェック |

### 7-2. クエリ最適化

- **N+1問題回避**: Prismaの `include` を適切に使用
- **バッチ処理**: `createMany` / `updateMany` を活用
- **コネクションプーリング**: Prisma標準のプーリング機能を使用

---

## 8. セキュリティ考慮事項

### 8-1. SQLインジェクション対策

- Prisma ORMによる自動エスケープ
- パラメータ化クエリのみ使用

### 8-2. データ保護

| 項目 | 対策 |
|:---|:---|
| **パスワード** | bcryptでハッシュ化（コスト係数10） |
| **個人情報** | Instagram IDは任意、最小限のデータのみ収集 |
| **削除ポリシー** | CASCADE削除で関連データも自動削除 |

---

## 9. 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|:---|:---|:---|:---|
| 2025-10-25 | 1.0 | 初版作成 | - |
