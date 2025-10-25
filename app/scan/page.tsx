import { getActiveEventId } from '@/app/actions/bingo'
import QRScanner from '@/components/user/QRScanner'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default async function ScanPage() {
  const eventId = await getActiveEventId()

  if (!eventId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-purple-700 mb-4">
            QRコードスキャン
          </h1>
          <p className="text-gray-600 mb-6">
            現在開催中のイベントはありません。
          </p>
          <Link href="/">
            <Button>ホームに戻る</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              ビンゴカードに戻る
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            QRコードスキャン
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            店舗のQRコードをスキャンしてスタンプを獲得しましょう
          </p>

          <QRScanner eventId={eventId} />
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-semibold text-blue-900 mb-2">スタンプ獲得の流れ</h2>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>各店舗に設置されているQRコードを探す</li>
            <li>上のカメラボタンをタップしてスキャン</li>
            <li>QRコードを画面中央に収める</li>
            <li>自動的にスタンプが獲得されます</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
