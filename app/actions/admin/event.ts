'use server'

import { prisma } from '@/lib/prisma'
import { validateEventCreate } from '@/lib/validation'
import { EventCreateResult, ApiResponse, EventStatistics } from '@/types/api'
import QRCode from 'qrcode'

/**
 * イベント作成
 */
export async function createEvent(formData: unknown): Promise<EventCreateResult> {
  try {
    // バリデーション
    const validation = validateEventCreate(formData)
    if (!validation.success) {
      return {
        success: false,
        message: validation.errors.join(', '),
      }
    }

    const data = validation.data
    const eventData = formData as any // Type assertion for id field

    // トランザクションでイベント、店舗、景品を作成
    const result = await prisma.$transaction(async (tx: any) => {
      // イベント作成
      const event = await tx.event.create({
        data: {
          id: eventData.id,
          name: data.name,
          description: data.description || null,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          status: 'draft',
          conditions: data.conditions || null,
        },
      })

      // 店舗情報作成
      const storePromises = (['a', 'b', 'c', 'd'] as const).map((code) =>
        tx.store.create({
          data: {
            eventId: event.id,
            storeCode: code,
            name: data.stores[code].name,
            description: data.stores[code].description || null,
            instagramUrl: data.stores[code].instagramUrl || null,
            twitterUrl: data.stores[code].twitterUrl || null,
            tiktokUrl: data.stores[code].tiktokUrl || null,
          },
        })
      )

      // 景品情報作成
      const prizePromises = [1, 2, 3].map((lineCount) => {
        const key = `line${lineCount}` as 'line1' | 'line2' | 'line3'
        return tx.prize.create({
          data: {
            eventId: event.id,
            lineCount,
            name: data.prizes[key].name,
            description: data.prizes[key].description || null,
            validUntil: data.prizes[key].validUntil
              ? new Date(data.prizes[key].validUntil!)
              : null,
          },
        })
      })

      await Promise.all([...storePromises, ...prizePromises])

      return event
    })

    // QRコード生成
    const qrCodes = await generateQRCodes(result.id)

    return {
      success: true,
      message: 'イベントを作成しました',
      eventId: result.id,
      qrCodes,
    }
  } catch (error) {
    console.error('createEvent error:', error)
    return {
      success: false,
      message: 'イベントの作成に失敗しました',
      error: {
        code: 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

/**
 * イベントステータス更新
 */
export async function updateEventStatus(
  eventId: string,
  status: 'draft' | 'active' | 'ended'
): Promise<ApiResponse> {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { status },
    })

    return {
      success: true,
      message: `イベントステータスを${status}に更新しました`,
    }
  } catch (error) {
    console.error('updateEventStatus error:', error)
    return {
      success: false,
      message: 'ステータスの更新に失敗しました',
      error: {
        code: 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

/**
 * イベントステータス更新（フォームアクション用）
 */
export async function updateEventStatusAction(formData: FormData) {
  'use server'
  const eventId = formData.get('eventId') as string
  const status = formData.get('status') as 'draft' | 'active' | 'ended'
  await updateEventStatus(eventId, status)
}

/**
 * イベント一覧取得
 */
export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      include: {
        stores: true,
        prizes: true,
        _count: {
          select: {
            userProgress: true,
            bingoAchievements: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return events
  } catch (error) {
    console.error('getEvents error:', error)
    return []
  }
}

/**
 * イベント詳細取得
 */
export async function getEvent(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        stores: true,
        prizes: true,
      },
    })

    return event
  } catch (error) {
    console.error('getEvent error:', error)
    return null
  }
}

/**
 * イベント統計取得
 */
export async function getEventStatistics(eventId: string): Promise<EventStatistics | null> {
  try {
    // 参加者数
    const participantCount = await prisma.userProgress.count({
      where: { eventId },
    })

    // 各店舗のスタンプ数
    const progressData = await prisma.userProgress.findMany({
      where: { eventId },
      select: {
        storeAVisits: true,
        storeBVisits: true,
        storeCVisits: true,
        storeDVisits: true,
      },
    })

    const stampCounts = progressData.reduce(
      (acc: { a: number; b: number; c: number; d: number }, progress: any) => ({
        a: acc.a + progress.storeAVisits,
        b: acc.b + progress.storeBVisits,
        c: acc.c + progress.storeCVisits,
        d: acc.d + progress.storeDVisits,
      }),
      { a: 0, b: 0, c: 0, d: 0 }
    )

    // ビンゴ達成数
    const achievements = await prisma.bingoAchievement.groupBy({
      by: ['lineCount'],
      where: { eventId },
      _count: true,
    })

    const bingoAchievements = {
      line1: achievements.find((a: any) => a.lineCount === 1)?._count || 0,
      line2: achievements.find((a: any) => a.lineCount === 2)?._count || 0,
      line3: achievements.find((a: any) => a.lineCount === 3)?._count || 0,
    }

    // 景品引換数
    const redeemedData = await prisma.bingoAchievement.groupBy({
      by: ['lineCount'],
      where: { eventId, isRedeemed: true },
      _count: true,
    })

    const redeemedCount = {
      line1: redeemedData.find((a: any) => a.lineCount === 1)?._count || 0,
      line2: redeemedData.find((a: any) => a.lineCount === 2)?._count || 0,
      line3: redeemedData.find((a: any) => a.lineCount === 3)?._count || 0,
    }

    // 日別参加者数（過去30日）
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyData = await prisma.userProgress.groupBy({
      by: ['createdAt'],
      where: {
        eventId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    })

    const dailyParticipants = dailyData.map((item: any) => ({
      date: item.createdAt.toISOString().split('T')[0],
      count: item._count,
    }))

    return {
      participantCount,
      stampCounts,
      bingoAchievements,
      redeemedCount,
      dailyParticipants,
    }
  } catch (error) {
    console.error('getEventStatistics error:', error)
    return null
  }
}

/**
 * QRコード生成
 */
async function generateQRCodes(eventId: string) {
  const codes: { a: string; b: string; c: string; d: string } = {
    a: '',
    b: '',
    c: '',
    d: '',
  }

  for (const store of ['a', 'b', 'c', 'd'] as const) {
    const qrData = `bingo://stamp/${eventId}/${store}`
    codes[store] = await QRCode.toDataURL(qrData, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
  }

  return codes
}

/**
 * QRコード再生成
 */
export async function regenerateQRCodes(eventId: string) {
  try {
    const qrCodes = await generateQRCodes(eventId)
    return {
      success: true,
      data: qrCodes,
    }
  } catch (error) {
    console.error('regenerateQRCodes error:', error)
    return {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}
