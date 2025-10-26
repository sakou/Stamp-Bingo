'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEvent } from '@/app/actions/admin/event'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function EventForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const data = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      conditions: formData.get('conditions') as string,
      stores: {
        a: {
          name: formData.get('store_a_name') as string,
          description: formData.get('store_a_description') as string,
          instagramUrl: formData.get('store_a_instagram') as string,
          twitterUrl: formData.get('store_a_twitter') as string,
          tiktokUrl: formData.get('store_a_tiktok') as string,
        },
        b: {
          name: formData.get('store_b_name') as string,
          description: formData.get('store_b_description') as string,
          instagramUrl: formData.get('store_b_instagram') as string,
          twitterUrl: formData.get('store_b_twitter') as string,
          tiktokUrl: formData.get('store_b_tiktok') as string,
        },
        c: {
          name: formData.get('store_c_name') as string,
          description: formData.get('store_c_description') as string,
          instagramUrl: formData.get('store_c_instagram') as string,
          twitterUrl: formData.get('store_c_twitter') as string,
          tiktokUrl: formData.get('store_c_tiktok') as string,
        },
        d: {
          name: formData.get('store_d_name') as string,
          description: formData.get('store_d_description') as string,
          instagramUrl: formData.get('store_d_instagram') as string,
          twitterUrl: formData.get('store_d_twitter') as string,
          tiktokUrl: formData.get('store_d_tiktok') as string,
        },
      },
      prizes: {
        line1: {
          name: formData.get('prize_1_name') as string,
          description: formData.get('prize_1_description') as string,
          validUntil: formData.get('prize_1_validUntil') as string,
        },
        line2: {
          name: formData.get('prize_2_name') as string,
          description: formData.get('prize_2_description') as string,
          validUntil: formData.get('prize_2_validUntil') as string,
        },
        line3: {
          name: formData.get('prize_3_name') as string,
          description: formData.get('prize_3_description') as string,
          validUntil: formData.get('prize_3_validUntil') as string,
        },
      },
    }

    const result = await createEvent(data)

    if (result.success) {
      router.push(`/admin/events/${result.eventId}/qr`)
    } else {
      setError(result.message || 'イベントの作成に失敗しました')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Event Basic Info */}
      <Card variant="bordered">
        <h2 className="text-xl font-bold text-gray-900 mb-4">基本情報</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
              イベントID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="id"
              name="id"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="evt_2025_spring_001"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              イベント名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="春の4店舗合同ビンゴラリー"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="4店舗を巡って豪華景品をゲット！"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                開始日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                終了日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-1">
              参加条件
            </label>
            <textarea
              id="conditions"
              name="conditions"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="① 各店舗でコラボメニューを注文&#10;② 店舗のInstagramをフォロー"
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      {/* Stores */}
      {(['a', 'b', 'c', 'd'] as const).map((storeCode) => (
        <Card key={storeCode} variant="bordered">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {storeCode.toUpperCase()}店 情報
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor={`store_${storeCode}_name`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                店舗名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`store_${storeCode}_name`}
                name={`store_${storeCode}_name`}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor={`store_${storeCode}_description`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                説明
              </label>
              <textarea
                id={`store_${storeCode}_description`}
                name={`store_${storeCode}_description`}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor={`store_${storeCode}_instagram`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Instagram
                </label>
                <input
                  type="url"
                  id={`store_${storeCode}_instagram`}
                  name={`store_${storeCode}_instagram`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://instagram.com/..."
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor={`store_${storeCode}_twitter`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  X (Twitter)
                </label>
                <input
                  type="url"
                  id={`store_${storeCode}_twitter`}
                  name={`store_${storeCode}_twitter`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://x.com/..."
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor={`store_${storeCode}_tiktok`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  TikTok
                </label>
                <input
                  type="url"
                  id={`store_${storeCode}_tiktok`}
                  name={`store_${storeCode}_tiktok`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://tiktok.com/@..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Prizes */}
      {[1, 2, 3].map((lineCount) => (
        <Card key={lineCount} variant="bordered">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{lineCount}ライン達成景品</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor={`prize_${lineCount}_name`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                景品名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`prize_${lineCount}_name`}
                name={`prize_${lineCount}_name`}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor={`prize_${lineCount}_description`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                説明
              </label>
              <textarea
                id={`prize_${lineCount}_description`}
                name={`prize_${lineCount}_description`}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor={`prize_${lineCount}_validUntil`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                有効期限
              </label>
              <input
                type="date"
                id={`prize_${lineCount}_validUntil`}
                name={`prize_${lineCount}_validUntil`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>
          </div>
        </Card>
      ))}

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/dashboard')}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        <Button type="submit" isLoading={isLoading}>
          イベントを作成
        </Button>
      </div>
    </form>
  )
}
