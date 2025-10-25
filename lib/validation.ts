import { z } from 'zod'

// 店舗スキーマ
export const StoreSchema = z.object({
  name: z.string().min(1, '店舗名は必須です').max(100, '店舗名は100文字以内です'),
  description: z.string().optional(),
  instagramUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  twitterUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  tiktokUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
})

// 景品スキーマ
export const PrizeSchema = z.object({
  name: z.string().min(1, '景品名は必須です').max(200, '景品名は200文字以内です'),
  description: z.string().optional(),
  validUntil: z.string().optional(),
})

// イベント作成スキーマ
export const EventCreateSchema = z.object({
  name: z.string().min(1, 'イベント名は必須です').max(200, 'イベント名は200文字以内です'),
  description: z.string().optional(),
  startDate: z.string().min(1, '開始日は必須です'),
  endDate: z.string().min(1, '終了日は必須です'),
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

export type EventCreateInput = z.infer<typeof EventCreateSchema>

/**
 * イベント作成データのバリデーション
 */
export function validateEventCreate(
  data: unknown
): { success: true; data: EventCreateInput } | { success: false; errors: string[] } {
  const result = EventCreateSchema.safeParse(data)

  if (!result.success) {
    const errors = result.error.errors.map((err) => {
      return `${err.path.join('.')}: ${err.message}`
    })
    return { success: false, errors }
  }

  // カスタムバリデーション: 開始日 <= 終了日
  const startDate = new Date(result.data.startDate)
  const endDate = new Date(result.data.endDate)

  if (startDate > endDate) {
    return {
      success: false,
      errors: ['終了日は開始日以降の日付を設定してください'],
    }
  }

  return { success: true, data: result.data }
}

/**
 * 日付文字列のバリデーション（YYYY-MM-DD形式）
 */
export function isValidDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) return false

  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * 店舗コードのバリデーション
 */
export function isValidStoreCode(code: string): code is 'a' | 'b' | 'c' | 'd' {
  return ['a', 'b', 'c', 'd'].includes(code)
}
