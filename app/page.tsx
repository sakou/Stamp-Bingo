import { redirect } from 'next/navigation'
import { getBingoCard, getActiveEventId } from '@/app/actions/bingo'
import BingoCard from '@/components/user/BingoCard'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default async function HomePage() {
  // アクティブなイベントIDを取得
  const eventId = await getActiveEventId()

  if (!eventId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">
            4店舗合同
            <br />
            ビンゴスタンプラリー
          </h1>
          <p className="text-gray-600 mb-6">
            現在開催中のイベントはありません。
            <br />
            次回のイベントをお待ちください！
          </p>
        </div>
      </div>
    )
  }

  // ビンゴカードデータを取得
  const bingoData = await getBingoCard(eventId)

  if (!bingoData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">エラー</h1>
          <p className="text-gray-600 mb-6">イベントデータの読み込みに失敗しました。</p>
          <Button onClick={() => window.location.reload()}>再読み込み</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* QR Scan Button */}
        <div className="mb-6 flex justify-center">
          <Link href="/scan">
            <Button size="lg" className="shadow-lg">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              QRコードをスキャン
            </Button>
          </Link>
        </div>

        {/* Bingo Card */}
        <BingoCard data={bingoData} />

        {/* Conditions */}
        {bingoData.eventInfo.conditions && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">参加条件</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {bingoData.eventInfo.conditions}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>各店舗でQRコードをスキャンしてスタンプを集めよう！</p>
          <p className="mt-2">ビンゴを達成して豪華景品をゲット！</p>
        </div>
      </div>
    </div>
  )
}
