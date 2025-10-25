'use client'

import { useState } from 'react'
import { BingoCardData } from '@/types/api'
import { BINGO_LAYOUT, getCellStates } from '@/lib/bingo-logic'
import BingoCell from './BingoCell'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

export interface BingoCardProps {
  data: BingoCardData
  onCellClick?: (index: number) => void
}

export default function BingoCard({ data, onCellClick }: BingoCardProps) {
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const cellStates = getCellStates(data.progress)

  const handleCellClick = (index: number) => {
    setSelectedCell(index)
    onCellClick?.(index)
  }

  const selectedCellData = selectedCell !== null ? BINGO_LAYOUT[selectedCell] : null
  const storeCode = selectedCellData?.store !== 'free' ? selectedCellData?.store : null
  const storeInfo = storeCode ? data.stores[storeCode] : null

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        {/* Event Info */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {data.eventInfo.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">{data.eventInfo.description}</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500">
            <span>開催期間: {data.eventInfo.startDate} 〜 {data.eventInfo.endDate}</span>
          </div>
        </div>

        {/* Bingo Lines Achievement */}
        <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center shadow-lg">
          <div className="text-lg font-semibold mb-1">達成ライン数</div>
          <div className="text-4xl font-bold">
            {data.bingoLines.length}
            <span className="text-xl ml-2">/ 12</span>
          </div>
          {data.bingoLines.length > 0 && (
            <div className="mt-2 text-sm">
              {data.bingoLines.map((line) => `${line}ライン`).join(', ')} 達成！
            </div>
          )}
        </div>

        {/* Bingo Grid */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 p-4 bg-white rounded-xl shadow-lg">
          {BINGO_LAYOUT.map((cell, index) => {
            const storeName =
              cell.store !== 'free' ? data.stores[cell.store]?.name : undefined
            return (
              <BingoCell
                key={index}
                store={cell.store}
                visit={cell.visit}
                isCompleted={cellStates[index]}
                storeName={storeName}
                onClick={() => handleCellClick(index)}
              />
            )
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['a', 'b', 'c', 'd'] as const).map((store) => {
            const storeData = data.stores[store]
            const visits =
              store === 'a'
                ? data.progress.storeAVisits
                : store === 'b'
                  ? data.progress.storeBVisits
                  : store === 'c'
                    ? data.progress.storeCVisits
                    : data.progress.storeDVisits

            return (
              <div
                key={store}
                className="bg-white border border-gray-200 rounded-lg p-3 text-center"
              >
                <div className="text-xs text-gray-500 uppercase font-semibold">{store}店</div>
                <div className="text-sm font-medium text-gray-700 truncate mt-1">
                  {storeData?.name}
                </div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {visits}
                  <span className="text-sm text-gray-500 ml-1">/ 6</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Prizes Info */}
        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900">景品情報</h2>
          {(['line1', 'line2', 'line3'] as const).map((lineKey) => {
            const lineCount = parseInt(lineKey.replace('line', ''))
            const prize = data.prizes[lineKey]
            const isAchieved = data.bingoLines.includes(lineCount)

            return (
              <div
                key={lineKey}
                className={`p-4 rounded-lg border-2 ${
                  isAchieved
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-900">
                        {lineCount}ライン達成
                      </span>
                      {isAchieved && (
                        <span className="text-green-600 font-semibold text-sm">✓ 達成済み</span>
                      )}
                    </div>
                    <div className="text-xl font-bold text-purple-600 mt-1">{prize.name}</div>
                    <p className="text-sm text-gray-600 mt-1">{prize.description}</p>
                    {prize.validUntil && (
                      <p className="text-xs text-gray-500 mt-1">
                        有効期限: {prize.validUntil}まで
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Store Info Modal */}
      <Modal
        isOpen={selectedCell !== null && storeCode !== null}
        onClose={() => setSelectedCell(null)}
        title={storeInfo?.name}
        size="md"
      >
        {storeInfo && (
          <div className="space-y-4">
            <p className="text-gray-700">{storeInfo.description}</p>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">SNSアカウント</h3>
              <div className="flex gap-3">
                {storeInfo.instagramUrl && (
                  <a
                    href={storeInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <span>Instagram</span>
                  </a>
                )}
                {storeInfo.twitterUrl && (
                  <a
                    href={storeInfo.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <span>X (Twitter)</span>
                  </a>
                )}
                {storeInfo.tiktokUrl && (
                  <a
                    href={storeInfo.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <span>TikTok</span>
                  </a>
                )}
              </div>
            </div>

            <Button variant="secondary" onClick={() => setSelectedCell(null)} className="w-full">
              閉じる
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}
