# 画面設計書

## 1. ドキュメント情報

| 項目 | 詳細 |
|:---|:---|
| **プロジェクト名** | 4店舗合同 ビンゴスタンプラリー |
| **バージョン** | 1.0 |
| **作成日** | 2025-10-25 |
| **最終更新日** | 2025-10-25 |
| **デザインシステム** | Tailwind CSS 4.x |

---

## 2. 画面一覧

### 2-1. 利用者向け画面

| No. | 画面ID | 画面名 | URL | 説明 |
|:---|:---|:---|:---|:---|
| U-01 | `HOME` | ビンゴカード画面 | `/` | メイン画面。ビンゴカード表示とスタンプ獲得 |
| U-02 | `PRIZE_MODAL` | 景品モーダル | - | ビンゴライン達成時の景品表示モーダル |

### 2-2. 管理者向け画面

| No. | 画面ID | 画面名 | URL | 説明 |
|:---|:---|:---|:---|:---|
| A-01 | `ADMIN_LOGIN` | 管理者ログイン | `/admin/login` | 管理者認証画面 |
| A-02 | `ADMIN_DASHBOARD` | 管理者ダッシュボード | `/admin` | イベント一覧・統計表示 |
| A-03 | `EVENT_CREATE` | イベント作成 | `/admin/events/new` | 新規イベント作成画面 |
| A-04 | `EVENT_EDIT` | イベント編集 | `/admin/events/:id/edit` | イベント情報編集画面 |
| A-05 | `EVENT_STATISTICS` | イベント統計 | `/admin/events/:id/stats` | 参加者数・達成数の統計表示 |
| A-06 | `QR_CODES` | QRコード生成 | `/admin/events/:id/qr` | QRコード生成・ダウンロード |

---

## 3. 利用者向け画面詳細

### 3-1. U-01: ビンゴカード画面

**URL**: `/`

**アクセス方法**:
- 直接アクセス: 最新のアクティブイベントを表示
- QRコードスキャン: `/?event={eventId}&store={storeCode}` でスタンプ獲得

**レイアウト**:

```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │        イベントヘッダー             │ │
│ │  春の4店舗合同ビンゴラリー          │ │
│ │  期間: 2025-04-01 〜 2025-04-30    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │        5×5 ビンゴカード             │ │
│ │  ┌───┬───┬───┬───┬───┐            │ │
│ │  │A1 │C1 │B1 │D1 │B2 │            │ │
│ │  ├───┼───┼───┼───┼───┤            │ │
│ │  │B3 │D2 │C2 │A2 │A3 │            │ │
│ │  ├───┼───┼───┼───┼───┤            │ │
│ │  │C3 │A4 │FRE│B4 │D3 │            │ │
│ │  ├───┼───┼───┼───┼───┤            │ │
│ │  │D4 │B5 │A5 │C4 │D5 │            │ │
│ │  ├───┼───┼───┼───┼───┤            │ │
│ │  │A6 │C5 │D6 │C6 │B6 │            │ │
│ │  └───┴───┴───┴───┴───┘            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │        参加店舗                     │ │
│ │  ┌──────┐ ┌──────┐                 │ │
│ │  │ A店  │ │ B店  │                 │ │
│ │  │ [SNS]│ │ [SNS]│                 │ │
│ │  └──────┘ └──────┘                 │ │
│ │  ┌──────┐ ┌──────┐                 │ │
│ │  │ C店  │ │ D店  │                 │ │
│ │  │ [SNS]│ │ [SNS]│                 │ │
│ │  └──────┘ └──────┘                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │        遊び方                       │ │
│ │  ① 各店舗でQRコードをスキャン      │ │
│ │  ② スタンプを集めてビンゴを狙おう  │ │
│ │  ③ ライン達成で景品GET！           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │        参加条件                     │ │
│ │  • コラボメニューを注文             │ │
│ │  • 店舗のInstagramをフォロー        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │        景品                         │ │
│ │  🎁 1ライン: 10%割引クーポン       │ │
│ │  🎁 2ライン: ¥1,000食事券          │ │
│ │  🎁 3ライン: ¥5,000食事券          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**コンポーネント構成**:

```
page.tsx
├── EventHeader (Server Component)
│   └── イベント名・期間表示
├── BingoCard (Client Component)
│   ├── BingoCell × 25
│   └── ビンゴライン判定ロジック
├── StoreSection (Server Component)
│   └── StoreCard × 4
│       ├── 店舗名
│       ├── 説明文
│       └── SNSLinks (Instagram, X, TikTok)
├── HowToPlay (Server Component)
├── Conditions (Server Component)
└── Prizes (Server Component)
```

**状態管理**:

```typescript
// Client Component: BingoCard
interface BingoCardState {
  progress: {
    storeAVisits: number;
    storeBVisits: number;
    storeCVisits: number;
    storeDVisits: number;
  };
  completedCells: Set<number>;  // 達成済みセルのインデックス
  bingoLines: number[];         // 達成済みライン数
  isLoading: boolean;
}
```

**インタラクション**:

1. **QRコードスキャン時**:
   ```typescript
   // URLパラメータを検出
   const searchParams = useSearchParams()
   const eventId = searchParams.get('event')
   const storeCode = searchParams.get('store')

   useEffect(() => {
     if (eventId && storeCode) {
       handleStampAcquisition(eventId, storeCode)
     }
   }, [eventId, storeCode])
   ```

2. **スタンプ獲得処理**:
   ```typescript
   async function handleStampAcquisition(eventId: string, storeCode: string) {
     setIsLoading(true)
     const result = await processStamp(eventId, storeCode)

     if (result.success) {
       // ビンゴカード更新
       setProgress(result.progress)
       updateCompletedCells(result.progress)

       // 新規ライン達成チェック
       if (result.newLineAchievement) {
         showPrizeModal(result.newLineAchievement)
       }
     } else {
       // エラー表示
       toast.error(result.message)
     }

     setIsLoading(false)
   }
   ```

3. **ビンゴセルの表示**:
   ```typescript
   function BingoCell({ store, visit, isCompleted }) {
     return (
       <div className={`
         bingo-cell
         ${isCompleted ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-white'}
       `}>
         <div className="store-name">{storeName}</div>
         <div className="visit-number">{visit}回目</div>
         {isCompleted && <CheckIcon className="w-6 h-6 text-white" />}
       </div>
     )
   }
   ```

**レスポンシブデザイン**:

| ブレークポイント | レイアウト | ビンゴカード |
|:---|:---|:---|
| **Mobile** (< 640px) | 縦スクロール、1カラム | セルサイズ: 60px × 60px |
| **Tablet** (640-1024px) | 縦スクロール、1カラム | セルサイズ: 80px × 80px |
| **Desktop** (> 1024px) | 中央配置、max-width: 1200px | セルサイズ: 100px × 100px |

**Tailwind CSS例**:

```typescript
<div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
  {cells.map((cell, index) => (
    <div
      key={index}
      className="
        aspect-square
        w-full
        rounded-lg
        shadow-md
        flex flex-col
        items-center
        justify-center
        transition-all
        duration-300
        hover:scale-105
      "
    >
      {/* セル内容 */}
    </div>
  ))}
</div>
```

---

### 3-2. U-02: 景品モーダル

**表示タイミング**: ビンゴライン達成時に自動表示

**レイアウト**:

```
┌─────────────────────────────────────────┐
│           [背景オーバーレイ]            │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  🎉 おめでとうございます！      │   │
│   │                                 │   │
│   │  ─────────────────────────────  │   │
│   │                                 │   │
│   │  1ライン達成！                  │   │
│   │                                 │   │
│   │  景品: 10%割引クーポン          │   │
│   │                                 │   │
│   │  次回利用時に使える割引クーポン │   │
│   │                                 │   │
│   │  有効期限: 2025-05-31          │   │
│   │                                 │   │
│   │  ─────────────────────────────  │   │
│   │                                 │   │
│   │  景品引換方法:                  │   │
│   │  参加4店舗のいずれかで          │   │
│   │  この画面を提示してください     │   │
│   │                                 │   │
│   │  ┌───────────────────────────┐  │   │
│   │  │      [閉じる]             │  │   │
│   │  └───────────────────────────┘  │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**コンポーネント**:

```typescript
interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineCount: number;
  prizeName: string;
  prizeDescription: string;
  validUntil?: string;
}

export function PrizeModal({
  isOpen,
  onClose,
  lineCount,
  prizeName,
  prizeDescription,
  validUntil
}: PrizeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative z-10 bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-4">
          🎉 おめでとうございます！
        </h2>

        <div className="border-t-2 border-b-2 border-purple-200 py-6 my-6">
          <p className="text-xl font-bold text-center mb-2">
            {lineCount}ライン達成！
          </p>
          <p className="text-2xl font-bold text-purple-600 text-center mb-2">
            {prizeName}
          </p>
          <p className="text-gray-600 text-center">
            {prizeDescription}
          </p>
          {validUntil && (
            <p className="text-sm text-gray-500 text-center mt-2">
              有効期限: {validUntil}
            </p>
          )}
        </div>

        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <p className="font-semibold mb-2">景品引換方法:</p>
          <p className="text-sm text-gray-700">
            参加4店舗のいずれかでこの画面を提示してください
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
```

---

## 4. 管理者向け画面詳細

### 4-1. A-01: 管理者ログイン

**URL**: `/admin/login`

**レイアウト**:

```
┌─────────────────────────────────────────┐
│                                         │
│           🎯 管理者ログイン             │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  メールアドレス                 │   │
│   │  ┌───────────────────────────┐  │   │
│   │  │ admin@example.com         │  │   │
│   │  └───────────────────────────┘  │   │
│   │                                 │   │
│   │  パスワード                     │   │
│   │  ┌───────────────────────────┐  │   │
│   │  │ ••••••••••                │  │   │
│   │  └───────────────────────────┘  │   │
│   │                                 │   │
│   │  ┌───────────────────────────┐  │   │
│   │  │      [ログイン]           │  │   │
│   │  └───────────────────────────┘  │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**認証**: NextAuth.jsによるCredentials認証

---

### 4-2. A-02: 管理者ダッシュボード

**URL**: `/admin`

**レイアウト**:

```
┌─────────────────────────────────────────────────────────┐
│ [ヘッダー]  ビンゴ管理システム        [ログアウト]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  アクティブなイベント                                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 春の4店舗合同ビンゴラリー                         │  │
│  │ 期間: 2025-04-01 〜 2025-04-30                   │  │
│  │ ステータス: [開催中]                             │  │
│  │                                                   │  │
│  │ 参加者数: 87人                                   │  │
│  │ 1ライン達成: 45人                                │  │
│  │ 2ライン達成: 12人                                │  │
│  │ 3ライン達成: 3人                                 │  │
│  │                                                   │  │
│  │ [統計詳細] [編集] [QRコード] [終了]             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │          [+ 新しいイベントを作成]                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  過去のイベント                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 冬の4店舗合同ビンゴラリー                         │  │
│  │ 期間: 2025-01-01 〜 2025-01-31                   │  │
│  │ ステータス: [終了]                               │  │
│  │ [統計詳細]                                       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**主要機能**:
- イベント一覧表示（アクティブ・過去）
- 簡易統計表示
- イベント操作（編集・QRコード生成・ステータス変更）

---

### 4-3. A-03: イベント作成

**URL**: `/admin/events/new`

**レイアウト**:

```
┌─────────────────────────────────────────────────────────┐
│ [ヘッダー]  新しいイベントを作成                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [基本情報] [A店] [B店] [C店] [D店] [参加条件] [景品] │
│  ──────────                                             │
│                                                         │
│  イベント名 *                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 春の4店舗合同ビンゴラリー                         │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  イベント説明                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 4店舗を巡って豪華景品をゲット！                   │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  開催期間 *                                             │
│  開始日: [2025-04-01]  終了日: [2025-04-30]            │
│                                                         │
│                              [キャンセル] [次へ: A店]  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**タブ構成**:

1. **基本情報**タブ:
   - イベント名（必須）
   - イベント説明
   - 開催期間（開始日・終了日）

2. **A店/B店/C店/D店**タブ（各店舗共通）:
   - 店舗名（必須）
   - 店舗説明
   - Instagram URL
   - X (Twitter) URL
   - TikTok URL

3. **参加条件**タブ:
   - 参加条件テキスト（改行対応）

4. **景品**タブ:
   - 1ライン達成:
     - 景品名（必須）
     - 景品説明
     - 有効期限
   - 2ライン達成:（同上）
   - 3ライン達成:（同上）

**バリデーション**:
- リアルタイムバリデーション（入力中にエラー表示）
- 必須項目のチェック
- 日付の妥当性チェック（開始日 ≤ 終了日）

**保存時の処理**:
```typescript
async function handleSubmit(data: EventFormData) {
  // 1. バリデーション
  const validationResult = validateEventData(data)
  if (!validationResult.success) {
    showErrors(validationResult.errors)
    return
  }

  // 2. Server Action呼び出し
  const result = await createEvent(data)

  if (result.success) {
    // 3. QRコード生成画面へリダイレクト
    router.push(`/admin/events/${result.eventId}/qr`)
  } else {
    showError(result.message)
  }
}
```

---

### 4-4. A-06: QRコード生成

**URL**: `/admin/events/:id/qr`

**レイアウト**:

```
┌─────────────────────────────────────────────────────────┐
│ [ヘッダー]  QRコード生成                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  春の4店舗合同ビンゴラリー                              │
│  期間: 2025-04-01 〜 2025-04-30                        │
│                                                         │
│  ┌────────────────┐  ┌────────────────┐                │
│  │  A店           │  │  B店           │                │
│  │  ┌──────────┐  │  │  ┌──────────┐  │                │
│  │  │ QRコード │  │  │  │ QRコード │  │                │
│  │  │          │  │  │  │          │  │                │
│  │  └──────────┘  │  │  └──────────┘  │                │
│  │  [ダウンロード]│  │  [ダウンロード]│                │
│  └────────────────┘  └────────────────┘                │
│                                                         │
│  ┌────────────────┐  ┌────────────────┐                │
│  │  C店           │  │  D店           │                │
│  │  ┌──────────┐  │  │  ┌──────────┐  │                │
│  │  │ QRコード │  │  │  │ QRコード │  │                │
│  │  │          │  │  │  │          │  │                │
│  │  └──────────┘  │  │  └──────────┘  │                │
│  │  [ダウンロード]│  │  [ダウンロード]│                │
│  └────────────────┘  └────────────────┘                │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │          [すべてのQRコードをダウンロード]         │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                                     [ダッシュボードへ]  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**QRコード生成**:

```typescript
import QRCode from 'qrcode'

async function generateQRCode(eventId: string, storeCode: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/?event=${eventId}&store=${storeCode}`

  const qrDataURL = await QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  })

  return qrDataURL
}
```

**ダウンロード機能**:

```typescript
function downloadQRCode(dataURL: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataURL
  link.click()
}
```

---

## 5. デザインシステム

### 5-1. カラーパレット

```typescript
// tailwind.config.ts
const colors = {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',  // メイン
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  secondary: {
    500: '#ec4899',  // ピンク（アクセント）
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
}
```

**使用例**:
- プライマリ: ビンゴカード、ボタン、リンク
- セカンダリ: 達成済みセルのグラデーション
- Success: 景品達成メッセージ
- Error: エラーメッセージ

### 5-2. タイポグラフィ

| 要素 | フォントサイズ | フォントウェイト | 行高 |
|:---|:---|:---|:---|
| **H1** | 2.5rem (40px) | 700 (Bold) | 1.2 |
| **H2** | 2rem (32px) | 700 (Bold) | 1.3 |
| **H3** | 1.5rem (24px) | 600 (SemiBold) | 1.4 |
| **Body** | 1rem (16px) | 400 (Regular) | 1.6 |
| **Small** | 0.875rem (14px) | 400 (Regular) | 1.5 |

**Tailwind Class**:
```html
<h1 class="text-4xl font-bold leading-tight">イベント名</h1>
<h2 class="text-3xl font-bold">セクション見出し</h2>
<h3 class="text-2xl font-semibold">小見出し</h3>
<p class="text-base leading-relaxed">本文テキスト</p>
<p class="text-sm">補足テキスト</p>
```

### 5-3. スペーシング

```typescript
// Tailwind標準スペーシング使用
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
}
```

### 5-4. シャドウ

```html
<!-- カードシャドウ -->
<div class="shadow-md hover:shadow-lg transition-shadow">

<!-- モーダルシャドウ -->
<div class="shadow-2xl">
```

### 5-5. アニメーション

```html
<!-- ホバー効果 -->
<button class="transition-all duration-300 hover:scale-105">

<!-- フェードイン -->
<div class="animate-fade-in">

<!-- スライドイン -->
<div class="animate-slide-in-up">
```

**カスタムアニメーション定義**:
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in-up': 'slideInUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
}
```

---

## 6. レスポンシブデザイン仕様

### 6-1. ブレークポイント

```typescript
const breakpoints = {
  sm: '640px',   // スマートフォン（大）
  md: '768px',   // タブレット
  lg: '1024px',  // デスクトップ
  xl: '1280px',  // デスクトップ（大）
}
```

### 6-2. ビンゴカードレスポンシブ対応

```typescript
// モバイルファースト設計
<div className="
  grid grid-cols-5
  gap-1 sm:gap-2 md:gap-3 lg:gap-4
  p-2 sm:p-4 md:p-6
">
  <div className="
    aspect-square
    text-xs sm:text-sm md:text-base
  ">
    {/* セル内容 */}
  </div>
</div>
```

---

## 7. アクセシビリティ

### 7-1. ARIA属性

```html
<!-- ビンゴセル -->
<div
  role="button"
  aria-label="A店 1回目のスタンプ"
  aria-pressed={isCompleted}
>

<!-- モーダル -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">おめでとうございます！</h2>
</div>
```

### 7-2. キーボード操作

- モーダル: `Esc`キーで閉じる
- フォーカス管理: モーダル内でフォーカストラップ

### 7-3. カラーコントラスト

WCAG 2.1 AA基準を満たすコントラスト比:
- テキスト: 4.5:1以上
- 大きなテキスト: 3:1以上

---

## 8. パフォーマンス最適化

### 8-1. 画像最適化

```typescript
import Image from 'next/image'

<Image
  src="/store-a.jpg"
  alt="A店の外観"
  width={300}
  height={200}
  loading="lazy"
  placeholder="blur"
/>
```

### 8-2. コンポーネント遅延読み込み

```typescript
import dynamic from 'next/dynamic'

const PrizeModal = dynamic(() => import('@/components/PrizeModal'), {
  loading: () => <p>Loading...</p>,
})
```

---

## 9. 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|:---|:---|:---|:---|
| 2025-10-25 | 1.0 | 初版作成 | - |
