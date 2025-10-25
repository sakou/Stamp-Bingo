'use server'

import { prisma } from '@/lib/prisma'
import { getUserId } from '@/lib/user-utils'
import { BingoCardData } from '@/types/api'

/**
 * ビンゴカードデータ取得
 */
export async function getBingoCard(eventId: string): Promise<BingoCardData | null> {
  try {
    // イベント情報取得
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        stores: true,
        prizes: true,
      },
    })

    if (!event) {
      return null
    }

    // ユーザーID取得
    const userId = await getUserId()

    // 進捗データ取得
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    })

    // ビンゴ達成記録取得
    const achievements = await prisma.bingoAchievement.findMany({
      where: { userId, eventId },
      select: { lineCount: true },
    })

    // 店舗情報整形
    const storesMap = event.stores.reduce(
      (acc: BingoCardData['stores'], store: any) => {
        acc[store.storeCode as 'a' | 'b' | 'c' | 'd'] = {
          name: store.name,
          description: store.description || '',
          instagramUrl: store.instagramUrl || undefined,
          twitterUrl: store.twitterUrl || undefined,
          tiktokUrl: store.tiktokUrl || undefined,
        }
        return acc
      },
      {} as BingoCardData['stores']
    )

    // 景品情報整形
    const prizesMap = event.prizes.reduce(
      (acc: BingoCardData['prizes'], prize: any) => {
        const key = `line${prize.lineCount}` as 'line1' | 'line2' | 'line3'
        acc[key] = {
          name: prize.name,
          description: prize.description || '',
          validUntil: prize.validUntil?.toISOString().split('T')[0],
        }
        return acc
      },
      {} as BingoCardData['prizes']
    )

    return {
      eventInfo: {
        id: event.id,
        name: event.name,
        description: event.description || '',
        startDate: event.startDate.toISOString().split('T')[0],
        endDate: event.endDate.toISOString().split('T')[0],
        conditions: event.conditions || '',
      },
      stores: storesMap,
      prizes: prizesMap,
      progress: {
        storeAVisits: progress?.storeAVisits || 0,
        storeBVisits: progress?.storeBVisits || 0,
        storeCVisits: progress?.storeCVisits || 0,
        storeDVisits: progress?.storeDVisits || 0,
      },
      bingoLines: achievements.map((a: any) => a.lineCount),
    }
  } catch (error) {
    console.error('getBingoCard error:', error)
    return null
  }
}

/**
 * アクティブなイベントID取得
 */
export async function getActiveEventId(): Promise<string | null> {
  try {
    const event = await prisma.event.findFirst({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    })
    return event?.id || null
  } catch (error) {
    console.error('getActiveEventId error:', error)
    return null
  }
}
