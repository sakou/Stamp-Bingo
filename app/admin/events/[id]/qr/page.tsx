import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/app/actions/admin/auth'
import { getEvent, regenerateQRCodes, updateEventStatusAction } from '@/app/actions/admin/event'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import Image from 'next/image'

export default async function EventQRPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }

  const { id } = await params
  const event = await getEvent(id)
  if (!event) {
    redirect('/admin/dashboard')
  }

  const qrResult = await regenerateQRCodes(id)
  const qrCodes = qrResult.success ? qrResult.data : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <p className="text-sm text-gray-600 mt-1">QRコード一覧</p>
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
        {/* Event Status */}
        <Card variant="bordered" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">イベントステータス</h2>
              <p className="text-sm text-gray-600">
                現在のステータス:{' '}
                <span className="font-semibold">
                  {event.status === 'active'
                    ? '開催中'
                    : event.status === 'draft'
                      ? '下書き'
                      : '終了'}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              {event.status === 'draft' && (
                <form action={updateEventStatusAction}>
                  <input type="hidden" name="eventId" value={id} />
                  <input type="hidden" name="status" value="active" />
                  <Button type="submit" variant="primary">
                    公開する
                  </Button>
                </form>
              )}
              {event.status === 'active' && (
                <form action={updateEventStatusAction}>
                  <input type="hidden" name="eventId" value={id} />
                  <input type="hidden" name="status" value="ended" />
                  <Button type="submit" variant="danger">
                    終了する
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card variant="bordered" className="mb-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-2">QRコードの使い方</h2>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>各店舗のQRコードを印刷してください</li>
            <li>店舗の見やすい場所に掲示してください</li>
            <li>ユーザーがQRコードをスキャンするとスタンプが獲得されます</li>
            <li>画像を右クリックして保存、またはダウンロードボタンを使用してください</li>
          </ol>
        </Card>

        {/* QR Codes */}
        {qrCodes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['a', 'b', 'c', 'd'] as const).map((storeCode) => {
              const store = event.stores.find((s: any) => s.storeCode === storeCode)
              return (
                <Card key={storeCode} variant="bordered">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {storeCode.toUpperCase()}店
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{store?.name}</p>

                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <Image
                        src={qrCodes[storeCode]}
                        alt={`${storeCode.toUpperCase()}店 QRコード`}
                        width={256}
                        height={256}
                        className="w-64 h-64"
                      />
                    </div>

                    {/* Download Button */}
                    <a
                      href={qrCodes[storeCode]}
                      download={`qr_${id}_${storeCode}.png`}
                      className="inline-block"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        ダウンロード
                      </Button>
                    </a>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card variant="bordered" className="text-center py-12">
            <p className="text-red-600">QRコードの生成に失敗しました</p>
          </Card>
        )}
      </main>
    </div>
  )
}
