import {
  EventCreateSchema,
  StoreSchema,
  PrizeSchema,
  validateEventCreate,
} from '@/lib/validation'

describe('バリデーションロジック', () => {
  describe('StoreSchema', () => {
    it('有効な店舗データをパスする', () => {
      const validStore = {
        name: 'テスト店舗',
        description: '説明文',
        instagramUrl: 'https://instagram.com/test',
        twitterUrl: 'https://x.com/test',
        tiktokUrl: 'https://tiktok.com/@test',
      }

      const result = StoreSchema.safeParse(validStore)
      expect(result.success).toBe(true)
    })

    it('店舗名が空の場合はエラー', () => {
      const invalidStore = {
        name: '',
        description: '説明文',
      }

      const result = StoreSchema.safeParse(invalidStore)
      expect(result.success).toBe(false)
    })

    it('店舗名が100文字を超える場合はエラー', () => {
      const invalidStore = {
        name: 'a'.repeat(101),
      }

      const result = StoreSchema.safeParse(invalidStore)
      expect(result.success).toBe(false)
    })

    it('オプション項目が未設定でもパスする', () => {
      const minimalStore = {
        name: 'テスト店舗',
      }

      const result = StoreSchema.safeParse(minimalStore)
      expect(result.success).toBe(true)
    })
  })

  describe('PrizeSchema', () => {
    it('有効な景品データをパスする', () => {
      const validPrize = {
        name: '10%割引クーポン',
        description: '次回利用時に使える',
        validUntil: '2025-05-31',
      }

      const result = PrizeSchema.safeParse(validPrize)
      expect(result.success).toBe(true)
    })

    it('景品名が空の場合はエラー', () => {
      const invalidPrize = {
        name: '',
      }

      const result = PrizeSchema.safeParse(invalidPrize)
      expect(result.success).toBe(false)
    })

    it('景品名が200文字を超える場合はエラー', () => {
      const invalidPrize = {
        name: 'a'.repeat(201),
      }

      const result = PrizeSchema.safeParse(invalidPrize)
      expect(result.success).toBe(false)
    })

    it('有効期限が未設定でもパスする', () => {
      const minimalPrize = {
        name: '景品名',
      }

      const result = PrizeSchema.safeParse(minimalPrize)
      expect(result.success).toBe(true)
    })
  })

  describe('EventCreateSchema', () => {
    const validEventData = {
      name: '春の4店舗合同ビンゴラリー',
      description: '4店舗を巡って豪華景品をゲット！',
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      conditions: '① コラボメニューを注文\n② 店舗のInstagramをフォロー',
      stores: {
        a: { name: 'A店' },
        b: { name: 'B店' },
        c: { name: 'C店' },
        d: { name: 'D店' },
      },
      prizes: {
        line1: { name: '10%割引クーポン' },
        line2: { name: '¥1,000食事券' },
        line3: { name: '¥5,000食事券' },
      },
    }

    it('有効なイベントデータをパスする', () => {
      const result = EventCreateSchema.safeParse(validEventData)
      expect(result.success).toBe(true)
    })

    it('イベント名が空の場合はエラー', () => {
      const invalidData = { ...validEventData, name: '' }
      const result = EventCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('イベント名が200文字を超える場合はエラー', () => {
      const invalidData = { ...validEventData, name: 'a'.repeat(201) }
      const result = EventCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('開始日が未設定の場合はエラー', () => {
      const invalidData = { ...validEventData, startDate: undefined }
      const result = EventCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('終了日が未設定の場合はエラー', () => {
      const invalidData = { ...validEventData, endDate: undefined }
      const result = EventCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('店舗が4つ揃っていない場合はエラー', () => {
      const invalidData = {
        ...validEventData,
        stores: {
          a: { name: 'A店' },
          b: { name: 'B店' },
          c: { name: 'C店' },
          // d店が不足
        },
      }
      const result = EventCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('景品が3つ揃っていない場合はエラー', () => {
      const invalidData = {
        ...validEventData,
        prizes: {
          line1: { name: '10%割引クーポン' },
          line2: { name: '¥1,000食事券' },
          // line3が不足
        },
      }
      const result = EventCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('validateEventCreate', () => {
    const validEventData = {
      name: '春の4店舗合同ビンゴラリー',
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      stores: {
        a: { name: 'A店' },
        b: { name: 'B店' },
        c: { name: 'C店' },
        d: { name: 'D店' },
      },
      prizes: {
        line1: { name: '10%割引クーポン' },
        line2: { name: '¥1,000食事券' },
        line3: { name: '¥5,000食事券' },
      },
    }

    it('有効なデータの場合、successがtrueで結果を返す', () => {
      const result = validateEventCreate(validEventData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validEventData)
      }
    })

    it('無効なデータの場合、successがfalseでエラーを返す', () => {
      const invalidData = { ...validEventData, name: '' }
      const result = validateEventCreate(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toBeDefined()
        expect(result.errors.length).toBeGreaterThan(0)
      }
    })

    it('開始日が終了日より後の場合はカスタムエラー', () => {
      const invalidData = {
        ...validEventData,
        startDate: '2025-04-30',
        endDate: '2025-04-01',
      }
      const result = validateEventCreate(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.some((err) => err.includes('終了日'))).toBe(true)
      }
    })
  })
})
