# API設計書

## 1. ドキュメント情報

| 項目 | 詳細 |
|:---|:---|
| **プロジェクト名** | 4店舗合同 ビンゴスタンプラリー |
| **バージョン** | 1.0 |
| **作成日** | 2025-10-25 |
| **最終更新日** | 2025-10-25 |
| **APIアーキテクチャ** | Next.js Server Actions + API Routes |

---

## 2. API概要

### 2-1. APIアーキテクチャ

Next.js 16 App Routerの**Server Actions**を主要なAPIメカニズムとして使用。一部の外部連携用に**API Routes**を提供。

| アーキテクチャ | 用途 | エンドポイント形式 |
|:---|:---|:---|
| **Server Actions** | フォーム送信、データ更新、ビジネスロジック | 関数呼び出し（サーバー側実行） |
| **API Routes** | 外部Webhook、QRコード生成API | `/api/*` |

### 2-2. 認証方式

| 対象 | 認証方式 | 詳細 |
|:---|:---|:---|
| **利用者向けAPI** | Cookie（UUID） | ユーザー識別用のUUIDをCookieに保存 |
| **管理者向けAPI** | NextAuth.js（JWT） | 管理者ログイン後にJWTセッション発行 |

---

## 3. Server Actions一覧

### 3-1. 利用者向けServer Actions

#### SA-U-001: processStamp（スタンプ獲得処理）

**概要**: QRコードスキャン時に店舗訪問を記録し、ビンゴカードを更新する。

**ファイル**: `app/actions/stamp.ts`

**関数定義**:
```typescript
'use server'

export async function processStamp(
  eventId: string,
  storeCode: 'a' | 'b' | 'c' | 'd'
): Promise<StampResult>
```

**入力パラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|:---|:---|:---:|:---|
| eventId | string | ◯ | イベントID |
| storeCode | 'a' \| 'b' \| 'c' \| 'd' | ◯ | 店舗コード |

**戻り値**:
```typescript
interface StampResult {
  success: boolean;
  message: string;
  progress?: {
    storeAVisits: number;
    storeBVisits: number;
    storeCVisits: number;
    storeDVisits: number;
  };
  newLineAchievement?: {
    lineCount: number;
    prizeName: string;
    prizeDescription: string;
  };
}
```

**処理フロー**:
1. CookieからユーザーIDを取得（なければUUID生成）
2. イベントの有効性確認（期間内・ステータスが'active'）
3. レート制限チェック（最終スタンプから1分以上経過）
4. 訪問回数を1増加（最大6まで）
5. ビンゴ判定を実行
6. 新規ライン達成があれば記録
7. 結果を返却

**エラーハンドリング**:
| エラーコード | 条件 | メッセージ |
|:---|:---|:---|
| `INVALID_EVENT` | イベントが存在しないまたは期間外 | 「このイベントは現在実施されていません」 |
| `RATE_LIMIT` | 1分以内の連続スキャン | 「少し時間をおいてから再度お試しください」 |
| `MAX_VISITS` | 訪問回数が6回に達している | 「この店舗のスタンプはすべて獲得済みです」 |
| `SERVER_ERROR` | データベースエラーなど | 「エラーが発生しました。もう一度お試しください」 |

**使用例**:
```typescript
// app/page.tsx
'use client'

import { processStamp } from '@/app/actions/stamp'

export function BingoCard() {
  const handleStampClick = async () => {
    const result = await processStamp('evt_2025_spring_001', 'a')
    if (result.success) {
      // ビンゴカード更新
      if (result.newLineAchievement) {
        // 景品モーダル表示
      }
    }
  }
}
```

---

#### SA-U-002: getBingoCard（ビンゴカード取得）

**概要**: ユーザーの現在のビンゴカード状態を取得する。

**ファイル**: `app/actions/bingo.ts`

**関数定義**:
```typescript
'use server'

export async function getBingoCard(
  eventId: string
): Promise<BingoCardData>
```

**入力パラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|:---|:---|:---|:---|
| eventId | string | ◯ | イベントID |

**戻り値**:
```typescript
interface BingoCardData {
  eventInfo: {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    conditions: string;
  };
  stores: {
    a: StoreInfo;
    b: StoreInfo;
    c: StoreInfo;
    d: StoreInfo;
  };
  prizes: {
    line1: PrizeInfo;
    line2: PrizeInfo;
    line3: PrizeInfo;
  };
  progress: {
    storeAVisits: number;
    storeBVisits: number;
    storeCVisits: number;
    storeDVisits: number;
  };
  bingoLines: number[];  // 達成済みライン数の配列 [1, 2]
}

interface StoreInfo {
  name: string;
  description: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
}

interface PrizeInfo {
  name: string;
  description: string;
  validUntil?: string;
}
```

---

#### SA-U-003: checkBingoAchievements（ビンゴ達成確認）

**概要**: ユーザーの現在のビンゴ達成状況を取得する。

**ファイル**: `app/actions/bingo.ts`

**関数定義**:
```typescript
'use server'

export async function checkBingoAchievements(
  eventId: string
): Promise<Achievement[]>
```

**戻り値**:
```typescript
interface Achievement {
  lineCount: number;
  prizeName: string;
  prizeDescription: string;
  validUntil?: string;
  isRedeemed: boolean;
  achievedAt: string;
}
```

---

### 3-2. 管理者向けServer Actions

#### SA-A-001: createEvent（イベント作成）

**概要**: 新しいイベントを作成し、店舗情報と景品情報を設定する。

**ファイル**: `app/admin/actions/event.ts`

**関数定義**:
```typescript
'use server'

export async function createEvent(
  data: EventCreateInput
): Promise<EventCreateResult>
```

**入力パラメータ**:
```typescript
interface EventCreateInput {
  // 基本情報
  name: string;
  description: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;
  conditions: string;

  // 店舗情報（4店舗）
  stores: {
    a: StoreInput;
    b: StoreInput;
    c: StoreInput;
    d: StoreInput;
  };

  // 景品情報（3段階）
  prizes: {
    line1: PrizeInput;
    line2: PrizeInput;
    line3: PrizeInput;
  };
}

interface StoreInput {
  name: string;
  description?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
}

interface PrizeInput {
  name: string;
  description?: string;
  validUntil?: string;
}
```

**戻り値**:
```typescript
interface EventCreateResult {
  success: boolean;
  message: string;
  eventId?: string;
  qrCodes?: {
    a: string;  // QRコード用URL
    b: string;
    c: string;
    d: string;
  };
}
```

**処理フロー**:
1. 管理者認証確認（NextAuth.jsセッション）
2. 入力バリデーション
3. アクティブなイベントの存在確認（既存イベントがあれば警告）
4. イベントID生成（`evt_${year}_${季節}_${連番}`）
5. トランザクション開始
   - eventsテーブルに挿入
   - storesテーブルに4件挿入
   - prizesテーブルに3件挿入
6. QRコード用URL生成
7. 結果返却

**バリデーション**:
| 項目 | ルール |
|:---|:---|
| name | 必須、1-200文字 |
| startDate / endDate | 必須、startDate <= endDate |
| stores | 4店舗すべて必須 |
| prizes | 3段階すべて必須 |

---

#### SA-A-002: updateEvent（イベント更新）

**概要**: 既存イベントの情報を更新する。

**ファイル**: `app/admin/actions/event.ts`

**関数定義**:
```typescript
'use server'

export async function updateEvent(
  eventId: string,
  data: EventUpdateInput
): Promise<EventUpdateResult>
```

**処理フロー**:
1. 管理者認証確認
2. イベント存在確認
3. バリデーション
4. トランザクションで更新（events, stores, prizes）
5. 結果返却

---

#### SA-A-003: updateEventStatus（イベントステータス変更）

**概要**: イベントのステータスを変更する（draft → active → ended）。

**ファイル**: `app/admin/actions/event.ts`

**関数定義**:
```typescript
'use server'

export async function updateEventStatus(
  eventId: string,
  status: 'draft' | 'active' | 'ended'
): Promise<StatusUpdateResult>
```

**処理フロー**:
1. 管理者認証確認
2. イベント存在確認
3. ステータス遷移の妥当性確認
   - draft → active: 他にactiveなイベントがないか確認
   - active → ended: OK
   - ended → active: 不可（警告）
4. ステータス更新
5. 結果返却

---

#### SA-A-004: getEventStatistics（イベント統計取得）

**概要**: イベントの参加者数、ビンゴ達成数、景品引換数などの統計データを取得する。

**ファイル**: `app/admin/actions/statistics.ts`

**関数定義**:
```typescript
'use server'

export async function getEventStatistics(
  eventId: string
): Promise<EventStatistics>
```

**戻り値**:
```typescript
interface EventStatistics {
  participantCount: number;  // 参加者数
  stampCounts: {
    a: number;  // A店のスタンプ獲得数（延べ数）
    b: number;
    c: number;
    d: number;
  };
  bingoAchievements: {
    line1: number;  // 1ライン達成者数
    line2: number;
    line3: number;
  };
  redeemedCount: {
    line1: number;  // 1ライン景品引換済み数
    line2: number;
    line3: number;
  };
  dailyParticipants: Array<{
    date: string;
    count: number;
  }>;
}
```

---

#### SA-A-005: redeemPrize（景品引換処理）

**概要**: ユーザーの景品引換を記録する（管理者が店舗で操作）。

**ファイル**: `app/admin/actions/prize.ts`

**関数定義**:
```typescript
'use server'

export async function redeemPrize(
  userId: string,
  eventId: string,
  lineCount: number,
  storeCode: 'a' | 'b' | 'c' | 'd'
): Promise<RedeemResult>
```

**処理フロー**:
1. 管理者認証確認
2. ビンゴ達成記録の存在確認
3. 引換済みフラグチェック（二重引換防止）
4. is_redeemed = true、redeemed_at、redeemed_storeを更新
5. 結果返却

---

## 4. API Routes

### 4-1. GET /api/qr/generate

**概要**: QRコード画像を生成して返す（管理者向け）。

**認証**: 管理者セッション必須

**リクエスト**:
```
GET /api/qr/generate?eventId=evt_2025_spring_001&storeCode=a
```

**レスポンス**:
```
Content-Type: image/png

[QRコード画像データ]
```

**処理フロー**:
1. 管理者認証確認
2. QRコード用URL生成: `https://bingo.example.com/?event=${eventId}&store=${storeCode}`
3. qrcodeライブラリでQRコード画像生成
4. PNG形式で返却

---

### 4-2. GET /api/events/active

**概要**: 現在アクティブなイベント情報を取得（外部連携用）。

**認証**: なし（公開API）

**リクエスト**:
```
GET /api/events/active
```

**レスポンス**:
```json
{
  "success": true,
  "event": {
    "id": "evt_2025_spring_001",
    "name": "春の4店舗合同ビンゴラリー",
    "description": "4店舗を巡って豪華景品をゲット！",
    "startDate": "2025-04-01",
    "endDate": "2025-04-30",
    "stores": [
      {
        "code": "a",
        "name": "A店",
        "instagramUrl": "..."
      }
    ],
    "prizes": [
      {
        "lineCount": 1,
        "name": "10%割引クーポン"
      }
    ]
  }
}
```

---

## 5. エラーレスポンス統一仕様

### 5-1. Server Actionsのエラー

```typescript
interface ErrorResult {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**エラーコード一覧**:
| コード | 説明 | HTTPステータス相当 |
|:---|:---|:---:|
| `INVALID_INPUT` | 入力パラメータ不正 | 400 |
| `UNAUTHORIZED` | 認証エラー | 401 |
| `FORBIDDEN` | 権限エラー | 403 |
| `NOT_FOUND` | リソースが存在しない | 404 |
| `RATE_LIMIT` | レート制限超過 | 429 |
| `SERVER_ERROR` | サーバーエラー | 500 |

### 5-2. API Routesのエラー

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "イベントIDが不正です"
  }
}
```

---

## 6. セキュリティ仕様

### 6-1. CSRF対策

Next.js Server Actionsは自動的にCSRF保護を提供（内部トークン検証）。

### 6-2. レート制限

| API | 制限 | 期間 |
|:---|:---|:---|
| processStamp | 1回 | 1分/ユーザー |
| createEvent | 10回 | 1時間/管理者 |

実装例:
```typescript
// lib/rate-limit.ts
import { RateLimiter } from 'limiter'

const stampLimiter = new RateLimiter({
  tokensPerInterval: 1,
  interval: 'minute'
})

export async function checkStampRateLimit(userId: string): Promise<boolean> {
  return await stampLimiter.removeTokens(1)
}
```

### 6-3. 入力バリデーション

Zodライブラリを使用した型安全なバリデーション:

```typescript
import { z } from 'zod'

const EventCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  conditions: z.string().optional(),
  stores: z.object({
    a: StoreSchema,
    b: StoreSchema,
    c: StoreSchema,
    d: StoreSchema,
  }),
  prizes: z.object({
    line1: PrizeSchema,
    line2: PrizeSchema,
    line3: PrizeSchema,
  }),
})
```

---

## 7. パフォーマンス最適化

### 7-1. キャッシング戦略

| API | キャッシュ方式 | 期間 |
|:---|:---|:---|
| getBingoCard | ISR | 60秒 |
| getEventStatistics | SWR（クライアント側） | 5秒 |

### 7-2. データベース最適化

- トランザクション使用でデータ整合性確保
- インデックス活用で高速検索
- N+1問題回避のため `include` を適切に使用

---

## 8. テスト仕様

### 8-1. ユニットテスト

```typescript
// __tests__/actions/stamp.test.ts
import { processStamp } from '@/app/actions/stamp'

describe('processStamp', () => {
  it('should increment visit count', async () => {
    const result = await processStamp('evt_test_001', 'a')
    expect(result.success).toBe(true)
    expect(result.progress?.storeAVisits).toBe(1)
  })

  it('should return error for invalid event', async () => {
    const result = await processStamp('invalid_event', 'a')
    expect(result.success).toBe(false)
    expect(result.error?.code).toBe('INVALID_EVENT')
  })
})
```

### 8-2. E2Eテスト

```typescript
// e2e/stamp-flow.spec.ts
import { test, expect } from '@playwright/test'

test('stamp acquisition flow', async ({ page }) => {
  await page.goto('/?event=evt_2025_spring_001&store=a')
  await page.waitForSelector('.bingo-card')

  const storeAVisit1 = page.locator('[data-store="a"][data-visit="1"]')
  await expect(storeAVisit1).toHaveClass(/completed/)
})
```

---

## 9. API仕様書生成

### 9-1. TypeDoc

TypeScriptのコメントからAPI仕様書を自動生成:

```typescript
/**
 * スタンプ獲得処理
 *
 * @param eventId - イベントID
 * @param storeCode - 店舗コード（a/b/c/d）
 * @returns スタンプ獲得結果
 * @throws {Error} イベントが存在しない場合
 *
 * @example
 * const result = await processStamp('evt_2025_spring_001', 'a')
 * if (result.success) {
 *   console.log('スタンプ獲得成功')
 * }
 */
export async function processStamp(
  eventId: string,
  storeCode: 'a' | 'b' | 'c' | 'd'
): Promise<StampResult>
```

---

## 10. 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|:---|:---|:---|:---|
| 2025-10-25 | 1.0 | 初版作成 | - |
