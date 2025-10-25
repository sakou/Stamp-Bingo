import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/app/actions/admin/auth'
import EventForm from '@/components/admin/EventForm'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default async function NewEventPage() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">新規イベント作成</h1>
              <p className="text-sm text-gray-600 mt-1">ビンゴスタンプラリーのイベントを作成</p>
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <EventForm />
      </main>
    </div>
  )
}
