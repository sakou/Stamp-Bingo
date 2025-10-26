/**
 * @jest-environment node
 */

import { processStamp } from '@/app/actions/stamp'
import { prisma } from '@/lib/prisma'

// Mock getUserId
jest.mock('@/lib/user-utils', () => ({
  getUserId: jest.fn(() => Promise.resolve('test-user-id')),
}))

describe('processStamp Integration Test', () => {
  let testEventId: string
  const testUserId = 'test-user-id'

  beforeAll(async () => {
    // テストイベント作成
    const event = await prisma.event.create({
      data: {
        id: 'test-event-integration',
        name: 'Integration Test Event',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'active',
      },
    })
    testEventId = event.id

    // 店舗情報作成
    await prisma.store.createMany({
      data: [
        { eventId: testEventId, storeCode: 'a', name: 'Store A' },
        { eventId: testEventId, storeCode: 'b', name: 'Store B' },
        { eventId: testEventId, storeCode: 'c', name: 'Store C' },
        { eventId: testEventId, storeCode: 'd', name: 'Store D' },
      ],
    })

    // 景品情報作成
    await prisma.prize.createMany({
      data: [
        { eventId: testEventId, lineCount: 1, name: 'Prize 1' },
        { eventId: testEventId, lineCount: 2, name: 'Prize 2' },
        { eventId: testEventId, lineCount: 3, name: 'Prize 3' },
      ],
    })
  })

  afterAll(async () => {
    // クリーンアップ
    await prisma.bingoAchievement.deleteMany({ where: { eventId: testEventId } })
    await prisma.userProgress.deleteMany({ where: { eventId: testEventId } })
    await prisma.prize.deleteMany({ where: { eventId: testEventId } })
    await prisma.store.deleteMany({ where: { eventId: testEventId } })
    await prisma.event.delete({ where: { id: testEventId } })
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // 各テスト前にユーザー進捗をクリーンアップ
    await prisma.userProgress.deleteMany({
      where: { userId: testUserId, eventId: testEventId },
    })
  })

  describe('Basic Stamp Processing', () => {
    it('should create new user progress on first stamp', async () => {
      const result = await processStamp(testEventId, 'a')

      expect(result.success).toBe(true)
      expect(result.progress).toMatchObject({
        storeAVisits: 1,
        storeBVisits: 0,
        storeCVisits: 0,
        storeDVisits: 0,
      })

      // DB確認
      const progress = await prisma.userProgress.findFirst({
        where: { userId: testUserId, eventId: testEventId },
      })
      expect(progress).toBeTruthy()
      expect(progress?.storeAVisits).toBe(1)
    })

    it('should increment visit count on subsequent stamps', async () => {
      // 初回スタンプ
      await processStamp(testEventId, 'a')

      // 2回目スタンプ
      const result = await processStamp(testEventId, 'a')

      expect(result.success).toBe(true)
      expect(result.progress?.storeAVisits).toBe(2)
    })

    it('should track different stores separately', async () => {
      await processStamp(testEventId, 'a')
      await processStamp(testEventId, 'b')
      const result = await processStamp(testEventId, 'c')

      expect(result.success).toBe(true)
      expect(result.progress).toMatchObject({
        storeAVisits: 1,
        storeBVisits: 1,
        storeCVisits: 1,
        storeDVisits: 0,
      })
    })
  })

  describe('Validation', () => {
    it('should reject invalid store code', async () => {
      const result = await processStamp(testEventId, 'x')

      expect(result.success).toBe(false)
      expect(result.message).toContain('無効な店舗コード')
    })

    it('should reject non-existent event', async () => {
      const result = await processStamp('non-existent-event', 'a')

      expect(result.success).toBe(false)
      expect(result.message).toContain('イベントが見つかりません')
    })

    it('should reject stamp when max visits reached', async () => {
      // 6回スタンプを取得
      for (let i = 0; i < 6; i++) {
        await processStamp(testEventId, 'a')
      }

      // 7回目は失敗するはず
      const result = await processStamp(testEventId, 'a')

      expect(result.success).toBe(false)
      expect(result.message).toContain('既に最大回数')
    })
  })

  describe('Bingo Achievement', () => {
    it('should not create achievement when no line completed', async () => {
      const result = await processStamp(testEventId, 'a')

      expect(result.newLineAchievement).toBeUndefined()
    })

    // Note: ビンゴラインの達成テストは実際のビンゴパターンに依存するため、
    // より複雑なセットアップが必要です。ここでは基本的な動作のみテスト
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limit (1 minute)', async () => {
      // 初回スタンプ
      await processStamp(testEventId, 'a')

      // すぐに2回目（1分以内）
      const result = await processStamp(testEventId, 'b')

      expect(result.success).toBe(false)
      expect(result.message).toContain('1分以上')
    })
  })
})
