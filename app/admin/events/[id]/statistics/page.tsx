import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/app/actions/admin/auth'
import { getEvent, getEventStatistics } from '@/app/actions/admin/event'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'

export default async function EventStatisticsPage({ params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }

  const event = await getEvent(params.id)
  if (!event) {
    redirect('/admin/dashboard')
  }

  const stats = await getEventStatistics(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <p className="text-sm text-gray-600 mt-1">イベント統計</p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                ← ダッシュボードに戻る
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {stats ? (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card variant="elevated" className="text-center">
                <div className="text-sm text-gray-600 mb-1">総参加者数</div>
                <div className="text-4xl font-bold text-purple-600">
                  {stats.participantCount}
                </div>
                <div className="text-xs text-gray-500 mt-1">人</div>
              </Card>

              <Card variant="elevated" className="text-center">
                <div className="text-sm text-gray-600 mb-1">総スタンプ数</div>
                <div className="text-4xl font-bold text-blue-600">
                  {stats.stampCounts.a +
                    stats.stampCounts.b +
                    stats.stampCounts.c +
                    stats.stampCounts.d}
                </div>
                <div className="text-xs text-gray-500 mt-1">個</div>
              </Card>

              <Card variant="elevated" className="text-center">
                <div className="text-sm text-gray-600 mb-1">ビンゴ達成者数</div>
                <div className="text-4xl font-bold text-green-600">
                  {stats.bingoAchievements.line1 +
                    stats.bingoAchievements.line2 +
                    stats.bingoAchievements.line3}
                </div>
                <div className="text-xs text-gray-500 mt-1">人</div>
              </Card>

              <Card variant="elevated" className="text-center">
                <div className="text-sm text-gray-600 mb-1">景品引換数</div>
                <div className="text-4xl font-bold text-orange-600">
                  {stats.redeemedCount.line1 +
                    stats.redeemedCount.line2 +
                    stats.redeemedCount.line3}
                </div>
                <div className="text-xs text-gray-500 mt-1">個</div>
              </Card>
            </div>

            {/* Store Stats */}
            <Card variant="bordered">
              <h2 className="text-xl font-bold text-gray-900 mb-4">店舗別スタンプ数</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['a', 'b', 'c', 'd'] as const).map((storeCode) => {
                  const store = event.stores.find((s: any) => s.storeCode === storeCode)
                  return (
                    <div key={storeCode} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">
                        {storeCode.toUpperCase()}店
                      </div>
                      <div className="text-sm font-medium text-gray-700 truncate mb-2">
                        {store?.name}
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        {stats.stampCounts[storeCode]}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">スタンプ</div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Bingo Achievements */}
            <Card variant="bordered">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ビンゴ達成状況</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((lineCount) => {
                  const key = `line${lineCount}` as 'line1' | 'line2' | 'line3'
                  const achieved = stats.bingoAchievements[key]
                  const redeemed = stats.redeemedCount[key]
                  const prize = event.prizes.find((p: any) => p.lineCount === lineCount)

                  return (
                    <div key={lineCount} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-lg text-gray-900">
                            {lineCount}ライン達成
                          </span>
                          <span className="text-sm text-gray-600 ml-2">{prize?.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{achieved}</div>
                          <div className="text-xs text-gray-500">達成者</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">引換済み:</span>{' '}
                          <span className="font-semibold">{redeemed}人</span>
                        </div>
                        <div>
                          <span className="text-gray-600">未引換:</span>{' '}
                          <span className="font-semibold">{achieved - redeemed}人</span>
                        </div>
                        {achieved > 0 && (
                          <div>
                            <span className="text-gray-600">引換率:</span>{' '}
                            <span className="font-semibold">
                              {((redeemed / achieved) * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Event Info */}
            <Card variant="bordered">
              <h2 className="text-xl font-bold text-gray-900 mb-4">イベント情報</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">イベントID:</span>
                  <span className="font-mono">{event.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">開催期間:</span>
                  <span>
                    {event.startDate.toISOString().split('T')[0]} 〜{' '}
                    {event.endDate.toISOString().split('T')[0]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ステータス:</span>
                  <span className="font-semibold">
                    {event.status === 'active'
                      ? '開催中'
                      : event.status === 'draft'
                        ? '下書き'
                        : '終了'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card variant="bordered" className="text-center py-12">
            <p className="text-gray-500">統計データの読み込みに失敗しました</p>
          </Card>
        )}
      </main>
    </div>
  )
}
