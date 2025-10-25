'use client'

import { StoreCode } from '@/types'
import { cn } from '@/lib/utils'

export interface BingoCellProps {
  store: StoreCode | 'free'
  visit: number
  isCompleted: boolean
  storeName?: string
  onClick?: () => void
}

const STORE_COLORS: Record<StoreCode | 'free', string> = {
  a: 'bg-red-100 border-red-300 text-red-900',
  b: 'bg-blue-100 border-blue-300 text-blue-900',
  c: 'bg-green-100 border-green-300 text-green-900',
  d: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  free: 'bg-purple-100 border-purple-300 text-purple-900',
}

const STORE_COMPLETED_COLORS: Record<StoreCode | 'free', string> = {
  a: 'bg-red-500 border-red-600 text-white',
  b: 'bg-blue-500 border-blue-600 text-white',
  c: 'bg-green-500 border-green-600 text-white',
  d: 'bg-yellow-500 border-yellow-600 text-white',
  free: 'bg-purple-500 border-purple-600 text-white',
}

export default function BingoCell({
  store,
  visit,
  isCompleted,
  storeName,
  onClick,
}: BingoCellProps) {
  const isFree = store === 'free'
  const colorClass = isCompleted ? STORE_COMPLETED_COLORS[store] : STORE_COLORS[store]

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative aspect-square flex flex-col items-center justify-center',
        'border-2 rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
        colorClass,
        onClick && !isCompleted && 'hover:scale-105 cursor-pointer',
        isCompleted && 'shadow-md',
        !onClick && 'cursor-default'
      )}
      disabled={!onClick || isCompleted}
      aria-label={
        isFree
          ? 'フリーセル'
          : `${storeName || store.toUpperCase()}店 ${visit}回目 ${isCompleted ? '達成済み' : '未達成'}`
      }
    >
      {/* Completed stamp */}
      {isCompleted && !isFree && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 opacity-80"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Cell content */}
      <div className="text-center z-10">
        {isFree ? (
          <>
            <div className="text-2xl sm:text-3xl font-bold">FREE</div>
            <div className="text-xs sm:text-sm mt-1">フリー</div>
          </>
        ) : (
          <>
            <div className="text-xl sm:text-2xl font-bold uppercase">{store}</div>
            <div className="text-xs sm:text-sm font-medium mt-1">
              {storeName && <div className="hidden sm:block">{storeName}</div>}
              <div>{visit}回目</div>
            </div>
          </>
        )}
      </div>

      {/* Completion overlay */}
      {isCompleted && !isFree && (
        <div className="absolute inset-0 bg-black/10 rounded-lg pointer-events-none" />
      )}
    </button>
  )
}
