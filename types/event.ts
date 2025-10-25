import { EventStatus } from './index'

// Prismaから生成される型をベースにした型定義
export interface Event {
  id: string
  name: string
  description: string | null
  startDate: Date
  endDate: Date
  status: EventStatus
  conditions: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Store {
  id: number
  eventId: string
  storeCode: string
  name: string
  description: string | null
  instagramUrl: string | null
  twitterUrl: string | null
  tiktokUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Prize {
  id: number
  eventId: string
  lineCount: number
  name: string
  description: string | null
  validUntil: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  instagramId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserProgress {
  id: number
  userId: string
  eventId: string
  storeAVisits: number
  storeBVisits: number
  storeCVisits: number
  storeDVisits: number
  lastStampAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface BingoAchievement {
  id: number
  userId: string
  eventId: string
  lineCount: number
  isRedeemed: boolean
  redeemedAt: Date | null
  redeemedStore: string | null
  achievedAt: Date
  createdAt: Date
}

export interface AdminUser {
  id: number
  email: string
  passwordHash: string
  name: string
  role: string
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}
