'use server'

import { prisma } from '@/lib/prisma'
import { getUserId } from '@/lib/user-utils'
import { checkBingoLines } from '@/lib/bingo-logic'
import { isValidStoreCode } from '@/lib/validation'
import { StampResult, ErrorCode } from '@/types/api'
import { StoreCode } from '@/types'

/**
 * スタンプ獲得処理
 */
export async function processStamp(
  eventId: string,
  storeCode: string
): Promise<StampResult> {
  try {
    // バリデーション
    if (!isValidStoreCode(storeCode)) {
      return {
        success: false,
        message: '不正な店舗コードです',
        error: { code: ErrorCode.INVALID_INPUT, message: '不正な店舗コードです' },
      }
    }

    // イベント確認
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return {
        success: false,
        message: 'イベントが見つかりません',
        error: { code: ErrorCode.NOT_FOUND, message: 'イベントが見つかりません' },
      }
    }

    // イベント期間確認
    const now = new Date()
    if (event.status !== 'active' || now < event.startDate || now > event.endDate) {
      return {
        success: false,
        message: 'このイベントは現在実施されていません',
        error: {
          code: ErrorCode.INVALID_EVENT,
          message: 'このイベントは現在実施されていません',
        },
      }
    }

    // ユーザーID取得
    const userId = await getUserId()

    // ユーザー作成（存在しなければ）
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    })

    // 進捗データ取得
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    })

    // レート制限チェック（最後のスタンプから1分以上経過）
    if (progress?.lastStampAt) {
      const timeDiff = now.getTime() - progress.lastStampAt.getTime()
      if (timeDiff < 60000) {
        // 1分未満
        return {
          success: false,
          message: '少し時間をおいてから再度お試しください',
          error: { code: ErrorCode.RATE_LIMIT, message: 'レート制限超過' },
        }
      }
    }

    // 訪問回数確認
    const storeVisitField = `store${storeCode.toUpperCase()}Visits` as
      | 'storeAVisits'
      | 'storeBVisits'
      | 'storeCVisits'
      | 'storeDVisits'
    const currentVisits = progress?.[storeVisitField] || 0

    if (currentVisits >= 6) {
      return {
        success: false,
        message: 'この店舗のスタンプはすべて獲得済みです',
        error: { code: ErrorCode.MAX_VISITS, message: '最大訪問回数に達しています' },
      }
    }

    // 進捗更新
    const updatedProgress = await prisma.userProgress.upsert({
      where: {
        userId_eventId: { userId, eventId },
      },
      update: {
        [storeVisitField]: currentVisits + 1,
        lastStampAt: now,
      },
      create: {
        userId,
        eventId,
        [storeVisitField]: 1,
        lastStampAt: now,
      },
    })

    // ビンゴ判定
    const newLineCount = checkBingoLines({
      storeAVisits: updatedProgress.storeAVisits,
      storeBVisits: updatedProgress.storeBVisits,
      storeCVisits: updatedProgress.storeCVisits,
      storeDVisits: updatedProgress.storeDVisits,
    })

    // 既存のビンゴ達成記録確認
    const existingAchievements = await prisma.bingoAchievement.findMany({
      where: { userId, eventId },
      select: { lineCount: true },
    })

    const existingLineCounts = existingAchievements.map((a: any) => a.lineCount)
    let newLineAchievement = undefined

    // 新しいライン達成があるか確認
    for (let i = 1; i <= newLineCount; i++) {
      if (!existingLineCounts.includes(i)) {
        // 新規達成
        await prisma.bingoAchievement.create({
          data: {
            userId,
            eventId,
            lineCount: i,
            achievedAt: now,
          },
        })

        // 景品情報取得
        const prize = await prisma.prize.findUnique({
          where: {
            eventId_lineCount: { eventId, lineCount: i },
          },
        })

        if (prize && !newLineAchievement) {
          // 最初の新規達成のみ返す
          newLineAchievement = {
            lineCount: i,
            prizeName: prize.name,
            prizeDescription: prize.description || '',
            validUntil: prize.validUntil?.toISOString().split('T')[0],
          }
        }
      }
    }

    return {
      success: true,
      message: 'スタンプを獲得しました！',
      progress: {
        storeAVisits: updatedProgress.storeAVisits,
        storeBVisits: updatedProgress.storeBVisits,
        storeCVisits: updatedProgress.storeCVisits,
        storeDVisits: updatedProgress.storeDVisits,
      },
      newLineAchievement,
    }
  } catch (error) {
    console.error('processStamp error:', error)
    return {
      success: false,
      message: 'エラーが発生しました。もう一度お試しください',
      error: { code: ErrorCode.SERVER_ERROR, message: 'サーバーエラー' },
    }
  }
}
