import { redirect } from 'next/navigation'
import { getCurrentAdmin, adminLogoutAction } from '@/app/actions/admin/auth'
import { getEvents } from '@/app/actions/admin/event'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import Card from '@/components/ui/Card'

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }

  const events = await getEvents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">管理画面</h1>
              <p className="text-sm text-gray-600 mt-1">ようこそ、{admin.name}さん</p>
            </div>
            <form action={adminLogoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">クイックアクション</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/events/new">
              <Card variant="bordered" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">新規イベント作成</h3>
                    <p className="text-sm text-gray-600">新しいビンゴイベントを作成</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/">
              <Card variant="bordered" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ユーザー画面を確認</h3>
                    <p className="text-sm text-gray-600">ユーザー向けページを表示</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Events List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">イベント一覧</h2>
            <Link href="/admin/events/new">
              <Button size="sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新規作成
              </Button>
            </Link>
          </div>

          {events.length === 0 ? (
            <Card variant="bordered" className="text-center py-12">
              <p className="text-gray-500">まだイベントがありません</p>
              <Link href="/admin/events/new">
                <Button className="mt-4">最初のイベントを作成</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event: any) => (
                <Card key={event.id} variant="bordered" className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{event.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'draft'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {event.status === 'active' ? '開催中' : event.status === 'draft' ? '下書き' : '終了'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>
                          期間: {event.startDate.toISOString().split('T')[0]} 〜{' '}
                          {event.endDate.toISOString().split('T')[0]}
                        </span>
                        <span>参加者: {event._count.userProgress}人</span>
                        <span>ビンゴ達成: {event._count.bingoAchievements}件</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/events/${event.id}/statistics`}>
                        <Button variant="outline" size="sm">
                          統計
                        </Button>
                      </Link>
                      <Link href={`/admin/events/${event.id}/qr`}>
                        <Button variant="outline" size="sm">
                          QRコード
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
