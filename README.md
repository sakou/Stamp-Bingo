# 4店舗合同 ビンゴスタンプラリー

4店舗を巡って豪華景品をゲット！デジタルビンゴスタンプラリーシステム。

## 🚀 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5
- **データベース**: PostgreSQL 16 (Prisma ORM)
- **スタイリング**: Tailwind CSS 3
- **テスト**: Jest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **デプロイ**: Vercel

## 📋 前提条件

- Node.js 20以上
- Docker & Docker Compose（ローカル開発用）
- Git

## 🛠️ セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-org/Stamp-Bingo.git
cd Stamp-Bingo
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. PostgreSQLコンテナの起動

```bash
npm run docker:up
```

このコマンドでPostgreSQL 16コンテナが起動します。

### 4. データベースのセットアップ

```bash
npm run db:setup
```

以下が自動実行されます：
- Prismaクライアント生成
- マイグレーション実行
- シードデータ投入

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 🧪 テスト

### ユニットテスト

```bash
npm test
```

ウォッチモードで実行:

```bash
npm run test:watch
```

### E2Eテスト

```bash
npm run test:e2e
```

### CI用テスト（カバレッジ付き）

```bash
npm run test:ci
```

## 📦 便利なコマンド

| コマンド | 説明 |
|:---|:---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm test` | ユニットテスト実行 |
| `npm run lint` | ESLint実行 |
| `npm run format` | Prettierでコード整形 |
| `npm run docker:up` | PostgreSQLコンテナ起動 |
| `npm run docker:down` | PostgreSQLコンテナ停止 |
| `npm run docker:reset` | PostgreSQLコンテナリセット |
| `npm run db:setup` | データベースセットアップ |
| `npm run db:reset` | データベースリセット |
| `npm run prisma:studio` | Prisma Studio起動 |

## 🗄️ データベース操作

### マイグレーション作成

```bash
npm run prisma:migrate
```

### Prisma Studio（データベースGUI）

```bash
npm run prisma:studio
```

ブラウザで http://localhost:5555 が開きます。

### データベースリセット

```bash
npm run db:reset
```

⚠️ 全データが削除されます！

## 🏗️ プロジェクト構造

```
Stamp-Bingo/
├── app/                     # Next.js App Router
│   ├── (user)/             # 利用者向けルート
│   ├── admin/              # 管理者向けルート
│   ├── actions/            # Server Actions
│   └── api/                # API Routes
├── components/             # Reactコンポーネント
│   ├── user/              # 利用者向けコンポーネント
│   ├── admin/             # 管理者向けコンポーネント
│   └── ui/                # 共通UIコンポーネント
├── lib/                    # ユーティリティ・ロジック
│   ├── prisma.ts          # Prismaクライアント
│   ├── bingo-logic.ts     # ビンゴ判定ロジック
│   └── validation.ts      # バリデーション
├── types/                  # TypeScript型定義
├── hooks/                  # カスタムフック
├── prisma/                 # Prismaスキーマ・マイグレーション
├── __tests__/             # テスト
│   ├── unit/              # ユニットテスト
│   └── e2e/               # E2Eテスト
├── docs/                   # ドキュメント
│   ├── design/            # 設計書
│   └── prototype/         # プロトタイプ
└── .github/workflows/      # GitHub Actions
```

## 📚 ドキュメント

- [要件定義書](docs/requirements.md)
- [システム設計書](docs/design/system-design.md)
- [データベース設計書](docs/design/database-design.md)
- [API設計書](docs/design/api-design.md)
- [画面設計書](docs/design/screen-design.md)
- [フォルダ構成設計書](docs/design/folder-structure.md)

## 🔧 トラブルシューティング

### Dockerコンテナが起動しない

```bash
# コンテナの状態確認
docker-compose ps

# ログ確認
docker-compose logs postgres

# 完全リセット
npm run docker:reset
```

### Prismaクライアントエラー

```bash
# Prismaクライアント再生成
npm run prisma:generate

# マイグレーション再実行
npm run db:setup
```

### テストが失敗する

```bash
# PostgreSQLが起動しているか確認
docker-compose ps

# データベースリセット
npm run db:reset

# テスト再実行
npm test
```

## 🚢 デプロイ

### Vercelへのデプロイ

1. Vercelアカウント作成
2. GitHubリポジトリと連携
3. 環境変数を設定:
   - `DATABASE_URL`: Vercel Postgres接続URL
4. 自動デプロイ開始

mainブランチへのpushで自動的に本番環境へデプロイされます。

## 🤝 コントリビューション

1. フィーチャーブランチを作成: `git checkout -b feature/amazing-feature`
2. 変更をコミット: `git commit -m 'Add amazing feature'`
3. ブランチをプッシュ: `git push origin feature/amazing-feature`
4. Pull Requestを作成

## 📝 ライセンス

このプロジェクトはプライベートプロジェクトです。

## 👥 作成者

- Claude Code - 初期開発

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesを作成してください。
