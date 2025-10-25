import { Progress } from './bingo'

// 共通APIレスポンス型
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

// スタンプ獲得結果
export interface StampResult {
  success: boolean
  message: string
  progress?: Progress
  newLineAchievement?: LineAchievement
  error?: ApiError
}

export interface LineAchievement {
  lineCount: number
  prizeName: string
  prizeDescription: string
  validUntil?: string
}

// ビンゴカードデータ
export interface BingoCardData {
  eventInfo: EventInfo
  stores: StoresInfo
  prizes: PrizesInfo
  progress: Progress
  bingoLines: number[] // 達成済みライン数の配列
}

export interface EventInfo {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  conditions: string
}

export interface StoreInfo {
  name: string
  description: string
  instagramUrl?: string
  twitterUrl?: string
  tiktokUrl?: string
}

export interface StoresInfo {
  a: StoreInfo
  b: StoreInfo
  c: StoreInfo
  d: StoreInfo
}

export interface PrizeInfo {
  name: string
  description: string
  validUntil?: string
}

export interface PrizesInfo {
  line1: PrizeInfo
  line2: PrizeInfo
  line3: PrizeInfo
}

// イベント作成結果
export interface EventCreateResult {
  success: boolean
  message: string
  eventId?: string
  qrCodes?: QRCodeUrls
  error?: ApiError
}

export interface QRCodeUrls {
  a: string
  b: string
  c: string
  d: string
}

// イベント統計
export interface EventStatistics {
  participantCount: number
  stampCounts: {
    a: number
    b: number
    c: number
    d: number
  }
  bingoAchievements: {
    line1: number
    line2: number
    line3: number
  }
  redeemedCount: {
    line1: number
    line2: number
    line3: number
  }
  dailyParticipants: Array<{
    date: string
    count: number
  }>
}

// エラーコード定数
export const ErrorCode = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  INVALID_EVENT: 'INVALID_EVENT',
  MAX_VISITS: 'MAX_VISITS',
  SERVER_ERROR: 'SERVER_ERROR',
} as const

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]
