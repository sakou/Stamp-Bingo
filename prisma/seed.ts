import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 既存データのクリーンアップ（開発環境のみ）
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Cleaning up existing data...')
    await prisma.bingoAchievement.deleteMany()
    await prisma.userProgress.deleteMany()
    await prisma.user.deleteMany()
    await prisma.prize.deleteMany()
    await prisma.store.deleteMany()
    await prisma.event.deleteMany()
    await prisma.adminUser.deleteMany()
  }

  // 管理者ユーザー作成
  console.log('👤 Creating admin user...')
  // 本番環境では環境変数 ADMIN_PASSWORD を使用（必須）
  // 開発環境ではデフォルトで 'admin123' を使用
  const adminPassword =
    process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'admin123')

  if (!adminPassword) {
    throw new Error(
      '❌ ADMIN_PASSWORD environment variable is required in production. Please set a strong password.'
    )
  }

  if (process.env.NODE_ENV === 'production' && adminPassword.length < 12) {
    throw new Error('❌ Admin password must be at least 12 characters in production.')
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10)
  const admin = await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      passwordHash,
      name: '管理者',
      role: 'admin',
      isActive: true,
    },
  })
  console.log(`✅ Admin created: ${admin.email}`)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`ℹ️  Development password: admin123`)
  }

  // テストイベント作成
  console.log('🎉 Creating test event...')
  const event = await prisma.event.create({
    data: {
      id: 'evt_2025_spring_001',
      name: '春の4店舗合同ビンゴラリー',
      description: '4店舗を巡って豪華景品をゲット！桜の季節にビンゴを楽しもう🌸',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-30'),
      status: 'active',
      conditions:
        '① 各店舗でコラボメニューを注文\n② 店舗のInstagramをフォロー\n③ QRコードをスキャンしてスタンプ獲得',
    },
  })
  console.log(`✅ Event created: ${event.name}`)

  // 店舗情報作成（4件）
  console.log('🏪 Creating stores...')
  const stores = await prisma.store.createMany({
    data: [
      {
        eventId: event.id,
        storeCode: 'a',
        name: 'カフェレストラン Aube（オーブ）',
        description:
          '心温まるフレンチカフェ。自家製スイーツと厳選コーヒーが自慢です。',
        instagramUrl: 'https://instagram.com/cafe_aube',
        twitterUrl: 'https://x.com/cafe_aube',
        tiktokUrl: 'https://tiktok.com/@cafe_aube',
      },
      {
        eventId: event.id,
        storeCode: 'b',
        name: 'イタリアン Bella Vista（ベラビスタ）',
        description: '本格ナポリピッツァと手打ちパスタのイタリアンレストラン。',
        instagramUrl: 'https://instagram.com/bellavista_italian',
        twitterUrl: 'https://x.com/bellavista_jp',
      },
      {
        eventId: event.id,
        storeCode: 'c',
        name: '和食処 千代（ちよ）',
        description: '旬の食材を使った会席料理と季節の日本酒が楽しめる和食店。',
        instagramUrl: 'https://instagram.com/washoku_chiyo',
      },
      {
        eventId: event.id,
        storeCode: 'd',
        name: 'ダイニングバー DISCOVERY（ディスカバリー）',
        description: 'クラフトビールとワインが豊富なモダンダイニング。',
        instagramUrl: 'https://instagram.com/bar_discovery',
        twitterUrl: 'https://x.com/discovery_bar',
        tiktokUrl: 'https://tiktok.com/@discovery_dining',
      },
    ],
  })
  console.log(`✅ Stores created: ${stores.count} stores`)

  // 景品設定作成（3件）
  console.log('🎁 Creating prizes...')
  const prizes = await prisma.prize.createMany({
    data: [
      {
        eventId: event.id,
        lineCount: 1,
        name: '10%割引クーポン',
        description: '参加4店舗で次回利用時に使える割引クーポン',
        validUntil: new Date('2025-05-31'),
      },
      {
        eventId: event.id,
        lineCount: 2,
        name: '¥1,000食事券',
        description: '参加4店舗で使える食事券',
        validUntil: new Date('2025-05-31'),
      },
      {
        eventId: event.id,
        lineCount: 3,
        name: '¥5,000食事券',
        description: '参加4店舗で使える豪華食事券',
        validUntil: new Date('2025-06-30'),
      },
    ],
  })
  console.log(`✅ Prizes created: ${prizes.count} prizes`)

  // テストユーザー作成
  console.log('👥 Creating test users...')
  const testUsers = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      instagramId: 'test_user_1',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      instagramId: 'test_user_2',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      instagramId: null, // Instagram未連携ユーザー
    },
  ]

  for (const userData of testUsers) {
    await prisma.user.create({ data: userData })
  }
  console.log(`✅ Test users created: ${testUsers.length} users`)

  // テストユーザーの進捗データ作成
  console.log('📊 Creating test user progress...')

  // ユーザー1: 各店舗1回ずつ訪問（1ライン達成）
  await prisma.userProgress.create({
    data: {
      userId: testUsers[0].id,
      eventId: event.id,
      storeAVisits: 1,
      storeBVisits: 1,
      storeCVisits: 1,
      storeDVisits: 1,
      lastStampAt: new Date(),
    },
  })

  // ビンゴ達成記録
  await prisma.bingoAchievement.create({
    data: {
      userId: testUsers[0].id,
      eventId: event.id,
      lineCount: 1,
      isRedeemed: false,
      achievedAt: new Date(),
    },
  })

  // ユーザー2: A店3回、B店2回訪問
  await prisma.userProgress.create({
    data: {
      userId: testUsers[1].id,
      eventId: event.id,
      storeAVisits: 3,
      storeBVisits: 2,
      storeCVisits: 0,
      storeDVisits: 0,
      lastStampAt: new Date(),
    },
  })

  // ユーザー3: 訪問なし
  await prisma.userProgress.create({
    data: {
      userId: testUsers[2].id,
      eventId: event.id,
      storeAVisits: 0,
      storeBVisits: 0,
      storeCVisits: 0,
      storeDVisits: 0,
    },
  })

  console.log('✅ Test user progress created')

  console.log('\n🎉 Seeding completed successfully!')
  console.log('\n📝 Summary:')
  console.log(`   - Admin users: 1`)
  console.log(`   - Events: 1 (${event.name})`)
  console.log(`   - Stores: 4`)
  console.log(`   - Prizes: 3`)
  console.log(`   - Test users: ${testUsers.length}`)
  console.log('\n🔐 Admin credentials:')
  console.log(`   Email: admin@example.com`)
  console.log(`   Password: admin123`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
