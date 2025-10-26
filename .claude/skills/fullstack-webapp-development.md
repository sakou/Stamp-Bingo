# Full-Stack Web Application Development Skill

このスキルは、Next.js + TypeScript + Prisma を使った高品質なフルスタックWebアプリケーションを効率的に開発するためのガイドです。

---

## 📖 このスキルファイルの使い方

### スキルの目的
このファイルは、Claude Codeが高品質なフルスタックWebアプリを効率的に開発するためのナレッジベースです。実際の開発経験から得られた知見を蓄積し、再利用可能な形で保存しています。

### 使用方法
1. **プロジェクト開始時**: このスキルファイルをClaude Codeに読み込ませる
2. **自動実行**: Claude Codeが自動的にヒアリングを開始し、TODO-driven開発を実施
3. **プロジェクト完了時**: 新しい知見をスキルに追加（後述のガイドラインに従う）

### スキルに追加する際のガイドライン

#### ✅ 追加すべき内容
- **再利用可能なパターン**: 他のプロジェクトでも使える一般的な解決策
- **環境固有のエラーと対処法**: Next.js 15の仕様変更、Prismaのマイグレーション戦略など
- **ベストプラクティス**: コード品質、セキュリティ、パフォーマンスに関する推奨事項
- **よくある落とし穴**: 実際に遭遇したエラーとその解決方法（一般化して記載）

#### ❌ 追加してはいけない内容
- **プロジェクト固有の情報**: 特定のビジネスロジックや仕様
- **機密情報**: API キー、パスワード、トークン、データベース接続文字列
- **個人情報**: ユーザー名、メールアドレス、組織名
- **環境依存の絶対パス**: `/Users/username/...` のような特定環境のパス
- **一時的な回避策**: 根本的な解決ではなく、特定のケースにのみ有効な対処法

#### 📝 記載のベストプラクティス
1. **具体例は汎用的に**:
   - 悪い例: `bingo_user`（プロジェクト固有）
   - 良い例: `app_user`（一般的な名前）

2. **エラーは症状と対処をセットで**:
   ```markdown
   **症状**: エラーメッセージ
   **原因**: なぜこのエラーが起きるか
   **対処**: 具体的な解決方法（コード例付き）
   ```

3. **コード例は完全性より明確性を優先**:
   - 最小限の例で本質を伝える
   - `...` でボイラープレートを省略
   - コメントで意図を明記

4. **バージョン情報を含める**:
   - 技術スタックのバージョンを明記（Next.js 15、React 19など）
   - 将来のバージョンでは不要になる可能性がある情報を識別できるように

### このスキルを育てる

#### 新しい知見を追加する流れ
1. **プロジェクト完了後**: Claude Codeが自動的に今回の開発内容を分析
2. **提案を確認**: スキルに追加すべき内容を箇条書きで提示
3. **承認**: 「追加して！」と言うだけで自動的にスキルを更新
4. **継続的改善**: プロジェクトを重ねるごとにスキルが成長

#### メンテナンスのコツ
- **定期的なレビュー**: 古くなった情報（旧バージョンの対処法など）を削除
- **構造の整理**: 内容が増えたらセクションを再編成
- **重複の排除**: 似た内容は統合して明確にする

---

## 🎨 このスキルをベースに他の技術スタック用のスキルを作成する

このスキルは **Next.js + TypeScript + Prisma** に特化していますが、**他の言語やフレームワーク用のスキル**を作成する際のテンプレートとしても活用できます。

### 新しいスキルを作成する方法

#### 使い方

**パターン1: 技術スタックが決まっている場合**

Claude Codeに以下のように指示してください：

```
このNext.js用スキルをベースに、[技術スタック名]用のスキルを作成して
```

例：
- 「このスキルをベースに、Django + PostgreSQL用のスキルを作成して」
- 「このスキルをベースに、Spring Boot + MySQL用のスキルを作成して」
- 「このスキルをベースに、Ruby on Rails用のスキルを作成して」

**パターン2: 技術スタックが決まっていない場合（おすすめ！）**

作りたいアプリの概要だけ伝えれば、Claude Codeが要件をヒアリングして最適な技術スタックを提案します：

```
[アプリの概要]を作りたいんだけど、最適な技術スタック用のスキルを作成して
```

例：
- 「ECサイトを作りたいんだけど、最適な技術スタック用のスキルを作成して」
- 「リアルタイムチャットアプリを作りたいんだけど、最適な技術スタック用のスキルを作成して」
- 「社内の勤怠管理システムを作りたいんだけど、最適な技術スタック用のスキルを作成して」

Claude Codeが対話的に要件を整理し、最適な技術スタックを提案します。

---

### 技術スタックが決まっていない場合の自動実行フロー

**ステップ1: 要件ヒアリング**

Claude Codeが以下の質問を対話的に行います：

```
アプリの技術スタックを一緒に決めましょう！
まず、要件について教えてください：

1. **アプリの種類**: どんなアプリですか？
   - ECサイト / SNS / ブログ / 管理画面 / API / その他

2. **主要機能**: 必須の機能は何ですか？（箇条書きで）
   - 例：ユーザー登録・認証、決済、画像アップロード、検索、リアルタイム通信など

3. **想定規模**: どのくらいのトラフィックを想定していますか？
   - 小規模（数百ユーザー/日）
   - 中規模（数千ユーザー/日）
   - 大規模（数万ユーザー以上/日）

4. **開発チーム**: 誰が開発しますか？
   - 個人開発 / 小チーム（2-5人） / 大チーム（6人以上）

5. **開発期間**: いつまでに必要ですか？
   - 1週間以内 / 1ヶ月以内 / 3ヶ月以上

6. **予算**: デプロイ環境の予算は？
   - 無料枠のみ / 月額数千円 / 月額数万円以上

7. **チームの得意言語**: どの言語に慣れていますか？（あれば）
   - JavaScript/TypeScript / Python / Java / Ruby / Go / PHP / その他 / 特になし

8. **特別な要件**: その他、重要な要件はありますか？
   - 例：Docker必須、既存システムとの連携、特定のライブラリ使用など
```

**ステップ2: 技術スタック提案**

ヒアリング内容を基に、Claude Codeが最適な技術スタックを**複数提案**します。

**重要**: 提案時には **`.claude/skills/tech-stack-history.md`** を必ず読み込んで、実績データを参照してください。

提案フォーマット：

```
要件を分析しました！

まず、tech-stack-history.md から実績データを確認しています...

【今のモダン構成】と【過去に使われた実績のある構成】を比較してご提案します：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【推奨案1】Next.js + TypeScript + Prisma + PostgreSQL ✅ 実績あり
- ✅ 適している理由：
  - フルスタックで開発スピードが速い
  - TypeScriptで型安全
  - Vercelで無料デプロイ可能
- 📊 実績情報：
  - プロジェクト: 4店舗スタンプラリーシステム（2025年10月）
  - 規模: 小規模（想定数百ユーザー/日）
  - 成果: ✅ 成功
  - 推奨度: ★★★★★
  - 主な学び:
    * Next.js 15のcookie設定はmiddlewareで行う
    * Prisma: CI環境では db push、本番では migrate deploy
    * dynamic force-dynamicでSSR問題を回避
  - 同じ構成を推奨する条件: 個人開発、フルスタック、Vercel無料枠、Docker必須
- ⚠️ 注意点：
  - Node.jsの知識が必要
  - Next.js 15の仕様変更に注意（実績から学んだ対処法あり）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【推奨案2】Django + PostgreSQL + React（モダン構成）
- ✅ 適している理由：
  - Pythonで書きやすい
  - 管理画面が自動生成される
  - 豊富なライブラリ
- ⚠️ 注意点：
  - 実績がまだない（この構成での開発経験なし）
  - フロントエンドとバックエンドが分離
  - デプロイがやや複雑

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【推奨案3】Ruby on Rails + PostgreSQL（モダン構成）
- ✅ 適している理由：
  - 超高速開発（Convention over Configuration）
  - MVCアーキテクチャが明確
  - スタートアップ向け
- ⚠️ 注意点：
  - 実績がまだない（この構成での開発経験なし）
  - Rubyの学習コストがやや高い
  - パフォーマンスチューニングが必要な場合も

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 おすすめ: 推奨案1は実績があり、過去の学びを活かして効率的に開発できます。
   推奨案2、3はモダンな構成ですが、初めて使う場合は学習コストが発生します。

どの案が良さそうですか？（番号で選択、または「もっと詳しく」でさらに質問できます）
```

**実績データ参照の重要性**:
- **実績がある構成** = 過去の失敗から学んだ対処法がスキルに蓄積されている
- **実績がない構成** = モダンだが、新たな問題に遭遇する可能性がある
- 実績データは `.claude/skills/tech-stack-history.md` に記録されており、ユーザーが手作業でメンテナンス・育てることができる

**ステップ3: 対話的な絞り込み**

ユーザーの選択や追加質問に応じて、最適な技術スタックを絞り込みます：

```
ユーザー: 「推奨案1が良さそうだけど、Dockerは必須にしたい」

Claude Code: 了解しました！Next.js + TypeScript + Prisma + PostgreSQL + Docker構成ですね。
             最終確認です：

技術スタック:
- 言語: TypeScript
- フレームワーク: Next.js 15
- ORM: Prisma
- データベース: PostgreSQL 16
- フロントエンド: React 19（Next.js統合）
- コンテナ: Docker + Docker Compose
- デプロイ: Vercel (または Railway/Render)
- テスト: Playwright (E2E) + Jest (Unit)

この構成でスキルを作成しますか？（はい/いいえ/調整したい）
```

**ステップ4: スキル作成**

確認後、自動的にカスタマイズされたスキルファイルを作成：

```
スキルを作成しています...

✅ .claude/skills/fullstack-webapp-nextjs-development.md を作成しました

このスキルには以下が含まれています：
- Next.js 15 + TypeScript + Prisma の開発フロー
- Docker環境構築手順
- よくある落とし穴（Next.js 15固有のエラーなど）
- Vercel/Railwayへのデプロイ手順
- E2E/Unitテスト設定

次回からこのスキルを読み込むだけで、同じ構成のアプリを効率的に開発できます！

今すぐこのスキルでアプリ開発を始めますか？（はい/いいえ）
```

---

### 具体的な使用例

**例1: ECサイトを作りたい場合**

```
ユーザー: 「ECサイトを作りたいんだけど、最適な技術スタック用のスキルを作成して」

Claude: アプリの技術スタックを一緒に決めましょう！
        1. アプリの種類: ECサイト ✓
        2. 主要機能: 何が必要ですか？

ユーザー: 「商品一覧、カート、決済、管理画面」

Claude: 3. 想定規模: 最初はどのくらいのトラフィックを想定していますか？

ユーザー: 「小規模から始めて、徐々に拡大したい」

Claude: 4. 開発チーム: 個人開発ですか？

ユーザー: 「はい」

Claude: 5. 開発期間: いつまでに必要ですか？

ユーザー: 「1ヶ月以内」

Claude: 6. 予算: デプロイ環境の予算は？

ユーザー: 「最初は無料枠で、成長したら有料プランに」

Claude: 7. チームの得意言語: どの言語に慣れていますか？

ユーザー: 「JavaScriptは書ける」

Claude: 要件を分析しました！以下をおすすめします：

【推奨案1】Next.js + TypeScript + Prisma + PostgreSQL + Stripe
- ✅ 適している理由：
  - 1人でフルスタック開発可能
  - Vercel無料枠でデプロイ可能
  - Stripe決済が簡単に統合できる
  - 拡張性が高い（スケールしやすい）
- ⚠️ 注意点：
  - TypeScriptの学習コスト（ただしJavaScript経験者なら比較的簡単）

【推奨案2】Django + PostgreSQL + React + Stripe
...

どの案が良さそうですか？

ユーザー: 「推奨案1で！」

Claude: 了解しました！スキルを作成しています...
        ✅ .claude/skills/fullstack-webapp-nextjs-ecommerce-development.md を作成しました
```

**例2: リアルタイムチャットアプリの場合**

```
ユーザー: 「リアルタイムチャットアプリを作りたいんだけど、最適な技術スタック用のスキルを作成して」

Claude: [ヒアリング後]

【推奨案1】Next.js + TypeScript + Pusher + PostgreSQL
- ✅ リアルタイム通信がPusherで簡単
- ✅ Vercel無料枠で始められる

【推奨案2】Node.js + Express + Socket.io + MongoDB
- ✅ WebSocketによる低レイテンシー
- ✅ 完全な制御が可能

【推奨案3】Go + Gin + WebSocket + PostgreSQL
- ✅ 超高速・高並行処理
- ✅ メモリ効率が良い
- ⚠️ Go学習コストがやや高い
```

---

### 技術スタック決定時の推奨ロジック（参考）

Claude Codeは以下の観点で技術スタックを提案します：

#### 開発スピード重視
- **超高速**: Ruby on Rails, Django, Laravel
- **高速**: Next.js, Nuxt.js
- **中速**: Spring Boot, ASP.NET Core

#### パフォーマンス重視
- **最高**: Go, Rust
- **高**: Node.js, Java (Spring Boot)
- **中**: Python (FastAPI), Ruby

#### 学習コスト
- **低**: Django (Python経験者), Ruby on Rails (Ruby経験者)
- **中**: Next.js (JavaScript経験者), Laravel (PHP経験者)
- **高**: Spring Boot (Java学習が必要), Go (新言語学習)

#### コスト（デプロイ）
- **無料枠が充実**: Vercel (Next.js), Railway, Render, Heroku (制限あり)
- **従量課金**: AWS, GCP, Azure

#### スケーラビリティ
- **高**: Go, Java (Spring Boot), Node.js (適切な設計)
- **中**: Django, Ruby on Rails (適切な設計)

---

### 自動実行フロー（技術スタック決定済みの場合）

Claude Codeが以下の流れで対話的に新しいスキルを作成します：

**ステップ1: 技術スタックのヒアリング**
```
新しいスキルを作成します！以下を教えてください：

1. **メイン言語**: どの言語を使いますか？
   - 例：Python, Java, Ruby, Go, PHP, Rust など

2. **Webフレームワーク**: どのフレームワークを使いますか？
   - 例：Django, Flask, Spring Boot, Ruby on Rails など

3. **データベース**: どのDBを使いますか？
   - 例：PostgreSQL, MySQL, MongoDB, SQLite など

4. **ORM/データアクセス層**: どのツールを使いますか？
   - 例：Django ORM, SQLAlchemy, JPA/Hibernate, ActiveRecord など

5. **フロントエンド**: どうしますか？
   - 例：サーバーサイドレンダリング / SPA（React/Vue） / API のみ

6. **デプロイ環境**: どこにデプロイしますか？
   - 例：AWS, GCP, Heroku, Render, Railway など

7. **その他の重要な技術**:
   - 例：認証（Auth0, JWT）、キャッシュ（Redis）、検索（Elasticsearch）など
```

**ステップ2: 既存スキルの解析**
- このNext.js用スキルの構造を解析
- 技術スタック依存部分と汎用部分を識別
- 新しいスキルに引き継ぐべき項目を抽出

**ステップ3: 新しいスキル作成**
- ヒアリング内容を基にカスタマイズ
- 技術スタック固有のベストプラクティスを追加
- よくある落とし穴を調査・追加

**ステップ4: スキルファイル保存**
- ファイル名: `.claude/skills/fullstack-webapp-[framework]-development.md`
  - 例：`fullstack-webapp-django-development.md`
  - 例：`fullstack-webapp-springboot-development.md`
- 命名規則に従って保存
- ユーザーに確認して最終化

#### 新しいスキルに含まれる内容

既存のNext.js用スキルから以下を引き継ぎ、カスタマイズします：

**引き継ぐ項目（技術スタック非依存）**:
- ✅ スキルファイルの使い方（このセクション全体）
- ✅ 自動実行フロー（ヒアリング → TODO → 実装）
- ✅ TDD アプローチ
- ✅ Docker環境構築パターン
- ✅ CI/CD セットアップ（GitHub Actions）
- ✅ 完了時の自己改善フロー

**カスタマイズする項目（技術スタック依存）**:
- 🔄 開発フロー（フレームワーク固有の手順）
- 🔄 プロジェクト構成（ディレクトリ構造）
- 🔄 よくある落とし穴（フレームワーク固有のエラー）
- 🔄 ベストプラクティス（パフォーマンス、セキュリティ）
- 🔄 デプロイ手順（プラットフォーム固有）

#### 例：Django用スキルの場合

新しく作成されるスキルには以下のようなセクションが含まれます：

```markdown
# Full-Stack Web Application Development Skill (Django + PostgreSQL)

## 技術スタック
- **言語**: Python 3.12+
- **Webフレームワーク**: Django 5.0+
- **ORM**: Django ORM
- **データベース**: PostgreSQL 16
- **フロントエンド**: Django Templates + HTMX (または DRF + React)
- **テスト**: pytest-django
- **デプロイ**: Railway / Render

## よくある落とし穴
1. Django ORMのN+1クエリ問題
2. マイグレーションの競合解決
3. CSRF保護の設定
...
```

#### 新しいスキルの活用

作成したスキルは：
1. **独立して使用可能**: Django専用の開発に特化
2. **同じ自動実行フロー**: ヒアリング → TODO → 実装
3. **継続的な成長**: プロジェクトごとに知見を蓄積

#### ベストプラクティス

**複数のスキルを管理する場合**:
- 技術スタックごとに別ファイルとして保存
- 汎用的な知見は各スキルに記載（重複OK）
- スキル間で共通のパターンが見つかったら、別途 `common-patterns.md` などを作成しても良い

**スキル作成のタイミング**:
- ✅ 新しい技術スタックで初めてアプリを作る時
- ✅ 既存の技術スタックで大きなプロジェクトを完了した時
- ❌ 1回の小さなプロジェクトだけでスキルを作成（知見が不足する可能性）

---

## 📊 技術スタック実績データベース（重要）

**`.claude/skills/tech-stack-history.md`** には、過去に使用した技術スタックのプロジェクト実績が記録されています。

### このファイルの目的

1. **実績ベースの技術選定**: 「このパターンで実際にシステムが作られた実績がある」という情報を提供
2. **モダン vs 実績**: 「今のモダンはこれ、過去に使われたことがあるのはこれ！」と比較提示
3. **失敗の回避**: 過去の失敗や学びを次のプロジェクトに活かす
4. **推奨度の可視化**: ★評価と「同じ構成を使う条件」を明記

### 実績データの内容

各技術スタックごとに以下を記録：
- **プロジェクト名/種類**: 匿名化した名前（例：「ECサイト」「管理システム」）
- **開発期間**: いつ開発したか
- **規模**: 小/中/大規模（ユーザー数/トラフィック）
- **チーム**: 個人/小チーム/大チーム
- **デプロイ先**: Vercel、AWS、GCP等
- **成果**: ✅成功 / ⚠️部分的成功 / ❌失敗
- **振り返り**: 良かった点と課題点
- **学んだこと**: 具体的な技術的学び（エラー対処法など）
- **推奨度**: ★★★★★（5段階評価）
- **同じ構成を使う条件**: どういう場合にこの構成を推奨するか

### 使い方（ユーザー向け）

**プロジェクト完了時に実績を追加してください：**

1. プロジェクトが完了したら `tech-stack-history.md` を開く
2. 使用した技術スタックのセクションを探す（なければ新規作成）
3. テンプレートに従って実績を追加（機密情報は含めない）
4. 正直に振り返る（成功だけでなく失敗や課題も記録）
5. コミット＆プッシュ

**Claude Codeが実績データを活用する流れ：**

1. **技術スタック提案時**: `tech-stack-history.md` を自動的に読み込む
2. **実績マーク**: 実績がある構成には「✅ 実績あり」マークを表示
3. **詳細情報提供**: プロジェクト名、成果、推奨度、学びを含めて提示
4. **比較提案**: モダンな構成 vs 実績のある構成を並べて比較
5. **リスク評価**: 実績がない構成には「初めて使う場合は学習コスト発生」と注記

### 実績データのメリット

- **客観的判断**: 「なんとなく」ではなく実績ベースで選択
- **失敗の回避**: 同じ轍を踏まない
- **自信を持った提案**: Claude Codeが「この構成は○○で成功しました」と言える
- **継続的改善**: プロジェクトごとに実績が増え、選定精度が向上
- **ナレッジ蓄積**: チームの知見が形式知として残る

### 例：実績データに基づく提案

```
【推奨案1】Next.js + TypeScript + Prisma + PostgreSQL ✅ 実績あり
- ✅ 適している理由：
  - フルスタックで開発スピードが速い
  - TypeScriptで型安全
- 📊 実績情報：
  - プロジェクト: 4店舗スタンプラリーシステム（2025年10月）
  - 成果: ✅ 成功
  - 推奨度: ★★★★★
  - 主な学び:
    * Next.js 15のcookie設定はmiddlewareで行う
    * Prisma: CI環境では db push、本番では migrate deploy
- ⚠️ 注意点：
  - Next.js 15の仕様変更に注意（実績から学んだ対処法あり）

【推奨案2】Django + PostgreSQL（モダン構成）
- ✅ 適している理由：
  - Pythonで書きやすい
- ⚠️ 注意点：
  - 実績がまだない（この構成での開発経験なし）
```

### メンテナンス

- **定期的にレビュー**: 古い実績（2年以上前）は参考程度に
- **最新の実績を重視**: 技術は進化するため、最近の実績ほど価値が高い
- **実績が増えたら**: 技術スタックごとにファイル分割も検討

**この仕組みにより、Claude Codeは単なる「モダンな技術」を提案するだけでなく、「実際にあなたのチームで成功した実績のある技術」を優先的に提案できるようになります。**

---

## 🚀 スキル実行時の自動フロー

**このスキルが呼び出されたら、以下の流れで自律的に進めてください：**

### ステップ1: ヒアリング開始
```
さあ！一緒にフルスタックWebアプリケーションを作りましょう！

まず、作りたいアプリについて教えてください：

1. **アプリの概要**: どんなアプリを作りますか？（1-2文で）
2. **主要機能**: 必須の機能は何ですか？（箇条書きで）
3. **想定ユーザー**: どのくらいの規模を想定していますか？
   - 例：Vercel無料枠で十分 / 大規模トラフィック想定
4. **技術的制約**: 特定の技術や制約はありますか？
   - 例：ローカル環境にNode/DB入れたくない（Docker必須）
   - 例：特定のライブラリを使いたい
5. **その他の要望**: 期待するユーザー体験や特記事項があれば
```

### ステップ2: 要件整理 & TODO作成
ヒアリング内容を基に：
1. 要件を整理・確認
2. TodoWriteツールで全体のタスクリストを作成
3. Phase 1から順次進める

### ステップ3: 自律的な実装
- 確認が必要な場合のみユーザーに質問
- それ以外は推奨パターンで自律的に進める
- 各フェーズ完了時にTODOを更新

---

## 📋 このスキルがカバーする内容

- 要件定義から本番デプロイまでの完全な開発フロー
- TDD（テスト駆動開発）アプローチ
- Docker完全セットアップ（ローカル環境にNode/DBを入れない）
- CI/CD統合（GitHub Actions）
- Next.js 15の最新ベストプラクティス

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

#### 2.3.1 Prismaマイグレーション戦略（重要）

環境によって異なるコマンドを使用する必要があります：

| 環境 | コマンド | 目的 | マイグレーションファイル |
|------|----------|------|------------------------|
| **開発（ローカル）** | `prisma migrate dev` | スキーマ変更をマイグレーションファイルとして保存 | 自動生成 |
| **CI/テスト** | `prisma db push` | スキーマから直接DB同期（高速） | 不要 |
| **本番** | `prisma migrate deploy` | マイグレーション履歴を適用 | 必須（Gitにコミット済み） |

**開発環境:**
```bash
# スキーマ変更時
npx prisma migrate dev --name add_new_field

# これにより：
# 1. prisma/migrations/ にマイグレーションファイル生成
# 2. データベースに適用
# 3. Prisma Clientを再生成
```

**CI/テスト環境（GitHub Actions）:**
```bash
# マイグレーションファイル不要、スキーマから直接同期
npx prisma db push --accept-data-loss
npx prisma db seed

# 理由：
# - テスト用DBは毎回クリーンな状態から開始
# - マイグレーション履歴管理が不要
# - migrate deployを使うと "No migration found" エラーになる
```

**本番環境（Vercel等）:**
```bash
# ビルド時に実行（package.json の postinstall）
npx prisma generate
npx prisma migrate deploy

# デプロイ前に必須：
# - prisma/migrations/ をGitにコミット
# - マイグレーションファイルが存在すること
```

**重要な注意点:**
- ❌ **CI環境で `migrate deploy` は使わない** → "No migration found" エラー
- ✅ **CI環境では `db push` を使う**
- ✅ **本番環境では必ず `migrate deploy` を使う** → マイグレーション履歴管理のため
- ✅ **マイグレーションファイルは必ずGitにコミット**

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
          npx prisma db push --accept-data-loss
          npx prisma db seed

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

### 6. CI環境でマイグレーションエラー
**症状**: `No migration found in prisma/migrations` または `The table does not exist`
**原因**: CI環境で `migrate deploy` を使用している
**対処**:
```yaml
# ❌ 間違い
npx prisma migrate deploy

# ✅ 正しい
npx prisma db push --accept-data-loss
npx prisma db seed
```
**理由**: CI環境ではマイグレーション履歴管理が不要。スキーマから直接同期する方が高速かつシンプル。

### 7. E2Eテストでページが空
**症状**: E2Eテストで要素が見つからない（`Expected: 25, Received: 0`）
**原因**: データベースにシードデータが投入されていない
**対処**: CI環境のSetup databaseステップに `npx prisma db seed` を追加

### 8. Docker でホットリロードが効かない
**症状**: コード変更が反映されない
**対処**: volume マウント設定を確認（`- .:/app`）

### 9. テストで "multiple elements" エラー
**症状**: `Found multiple elements with the text: XXX`
**対処**: `getAllByText` または `container.textContent` を使用

### 10. Next.js 15でcookie設定エラー
**症状**: `Cookies can only be modified in a Server Action or Route Handler`
**原因**: Page ComponentのServer Action内で `cookies().set()` を実行している
**対処**: middlewareでcookieを設定する

```typescript
// ❌ 間違い - lib/user-utils.ts
export async function getUserId() {
  const cookieStore = await cookies()
  cookieStore.set('user_id', uuidv4(), {...})  // エラー！
  return userId
}

// ✅ 正しい - middleware.ts を作成
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const existingUserId = request.cookies.get('user_id')

  if (!existingUserId) {
    response.cookies.set('user_id', uuidv4(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return response
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}

// ✅ lib/user-utils.ts は読み取りのみ
export async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value || ''
}
```

**理由**: Next.js 15ではcookieの設定はmiddleware、Server Action、Route Handlerでのみ可能。Page ComponentのServer関数内では読み取りのみ。

### 11. E2Eテストとコンポーネント実装の不一致
**症状**: E2Eテストが `element(s) not found` で失敗する
**原因**: テスト作成時に実際のUI実装を確認せず、存在しないテキストやセレクタを使用している
**対処**: テスト作成前に必ず実際のコンポーネントコードを確認し、正確なセレクタを使用する

```typescript
// ❌ 間違い - 実装を確認せずに書いたテスト
test('should display visit count', async ({ page }) => {
  await expect(page.locator('text=/訪問/i')).toBeVisible()  // UIに「訪問」という文字がない！
})

// ✅ 正しい - 実装を確認してから書いたテスト
// コンポーネントを確認: <span>3 / 6</span> と表示されている
test('should display visit count', async ({ page }) => {
  await expect(page.locator('text=/ 6')).toBeVisible()  // 実際の表示形式に合わせる
})
```

**ベストプラクティス**:
- E2Eテスト作成時は対象コンポーネントのコードを必ず読む
- `data-testid` 属性を使ってテスト用のIDを明示的に付与すると保守性が向上
- テスト失敗時のスクリーンショットを活用してUIを確認

```typescript
// さらに良い方法: data-testid を使用
// コンポーネント側
<div data-testid="store-progress">
  {visits} / 6
</div>

// テスト側
test('should display visit count', async ({ page }) => {
  await expect(page.getByTestId('store-progress')).toBeVisible()
})
```

### 12. Playwrightのデバッグ効率化
**症状**: E2Eテスト失敗時、原因特定に時間がかかる
**対処**: スクリーンショットとトレース機能を活用する

**playwright.config.ts の推奨設定**:
```typescript
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',  // 失敗時のみスクリーンショット撮影
    trace: 'on-first-retry',        // リトライ時にトレース記録
  },
})
```

**デバッグ手順**:
1. テスト失敗時、`test-results/` フォルダにスクリーンショットが保存される
2. スクリーンショットで実際のUIを確認
3. トレースファイル（`.zip`）がある場合、以下で詳細確認：
   ```bash
   npx playwright show-trace test-results/.../trace.zip
   ```

**CI環境での活用**:
- GitHub Actionsでは自動的にスクリーンショットがartifactとしてアップロードされる
- Actionsページから失敗時のUIを直接確認可能
- ローカル環境を再現せずにデバッグできる

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

## 🔄 完了時のスキル更新フロー

**アプリが完成したら、このスキル自体を改善します：**

### ステップ1: 自動レビュー開始
プロジェクト完了時に以下のメッセージを自動的に表示：

```
🎉 アプリケーションの開発が完了しました！

これまでの開発で遭遇した問題やパターンを振り返り、
このスキルに追加すべき内容を分析します...
```

### ステップ2: やり取りを分析
会話履歴全体を分析して以下を抽出：

1. **新しい落とし穴**
   - 遭遇したエラーでスキルに記載されていないもの
   - 原因、症状、対処法がセットで説明できるもの

2. **新しいベストプラクティス**
   - 今回採用して効果的だったパターン
   - 既存のスキルに無い技術選択や実装方法

3. **環境固有の対応**
   - 特定のバージョンで必要になった対応
   - 将来のプロジェクトでも使えそうな知見

4. **ワークフロー改善**
   - より効率的だった進め方
   - チェックリストに追加すべき項目

### ステップ3: ユーザーに確認
分析結果を箇条書きで提示：

```
📝 今回の開発でスキルに追加すべき内容を発見しました：

**新しい落とし穴:**
1. Next.js 15でcookie設定エラー
   - 症状: Cookies can only be modified in...
   - 対処: middlewareでcookie設定

2. Prisma マイグレーション戦略の環境別使い分け
   - CI環境では db push、本番では migrate deploy

**新しいベストプラクティス:**
3. GitHub Actions で paths-ignore を使ってdoc変更をスキップ

追加しますか？（「追加して！」と言っていただければ反映します）
```

### ステップ4: スキル更新
ユーザーが「追加して！」と言ったら：
1. 該当セクションに追記（よくある落とし穴、ベストプラクティスなど）
2. コミットメッセージ: "スキル更新: [プロジェクト名]で得た知見を追加"
3. プッシュして次回のプロジェクトに反映

### ステップ5: 実績データベース更新（重要）

スキル更新が完了したら、**`.claude/skills/tech-stack-history.md`** にプロジェクト実績を追加：

```
✅ スキル更新が完了しました！

次に、このプロジェクトの実績をデータベースに記録しましょう。

以下の情報を確認してください：

📊 プロジェクト実績サマリー:
- **使用技術**: Next.js 15 + TypeScript + Prisma + PostgreSQL
- **開発期間**: 2025年10月
- **規模**: 小規模（4店舗、想定数百ユーザー/日）
- **チーム**: 個人開発
- **デプロイ**: Vercel（想定）
- **成果**: ✅ 成功
- **推奨度**: ★★★★★
- **主な学び**:
  * Next.js 15のcookie設定はmiddlewareで行う
  * Prisma: CI環境では db push、本番では migrate deploy
  * dynamic force-dynamicでSSR問題を回避

この内容で tech-stack-history.md に実績を追加しますか？
（「追加して！」と言っていただければ記録します）
```

ユーザーが「追加して！」と言ったら：

1. **`tech-stack-history.md` を読み込む**
2. **該当する技術スタックのセクションを見つける**（なければ新規作成）
3. **テンプレートに従って実績を追加**:
   ```markdown
   ### プロジェクト実績 X: [プロジェクト名または種類]
   - **開発期間**: YYYY年MM月
   - **規模**: 小規模（説明）
   - **チーム**: 個人開発
   - **デプロイ**: Vercel
   - **成果**: ✅ 成功
   - **振り返り**:
     - 良かった点1
     - 良かった点2
   - **学んだこと**:
     - 学び1（スキルに追加した落とし穴など）
     - 学び2
   - **推奨度**: ★★★★★
   - **同じ構成を使う条件**: 個人開発、フルスタック、Vercel無料枠、Docker必須
   ```
4. **コミット＆プッシュ**: "実績データベース更新: [プロジェクト名]の実績を追加"

**重要**: 実績データは次回のプロジェクトで技術スタック選定時に参照されます。正直に振り返り、失敗や課題も含めて記録してください。

### 自己改善サイクル
```
プロジェクト1 → スキル v1 + 実績データベース v1
    ↓ (新しい知見 + 実績蓄積)
プロジェクト2 → スキル v2 + 実績データベース v2
    ↓ (新しい知見 + 実績蓄積)
プロジェクト3 → スキル v3 + 実績データベース v3 ...
```

このサイクルにより：
- **スキル**は使うたびに賢くなる（新しいパターン・エラー対処法が追加される）
- **実績データベース**は使うたびに充実する（技術選定の判断材料が増える）
- 次回のプロジェクトでは**実績ベースで最適な技術スタックを提案**できる

---

## まとめ

このスキルを使うことで：
✅ 設計フェーズで手戻りを防ぐ
✅ TDDで品質を担保
✅ Docker完全セットアップで環境差異をなくす
✅ CI/CDで継続的に品質チェック
✅ Next.js 15のベストプラクティスに準拠
✅ **プロジェクトごとにスキル自体が進化**
✅ **実績データベースで技術選定が客観的に**
✅ **「モダン vs 実績」を比較して最適な技術を選択**

次回のプロジェクトでこのスキルと実績データベースを参照することで、効率的かつ高品質なWebアプリケーションを構築できます。
