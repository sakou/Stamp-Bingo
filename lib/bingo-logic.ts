import { Progress, BingoCellLayout } from '@/types/bingo'
import { StoreCode } from '@/types'

// ビンゴカード配置定義（5×5 = 25セル）
// 要件定義書のビンゴカード配置に基づく
export const BINGO_LAYOUT: BingoCellLayout[] = [
  // Row 0
  { store: 'a', visit: 1 },
  { store: 'c', visit: 1 },
  { store: 'b', visit: 1 },
  { store: 'd', visit: 1 },
  { store: 'b', visit: 2 },
  // Row 1
  { store: 'b', visit: 3 },
  { store: 'd', visit: 2 },
  { store: 'c', visit: 2 },
  { store: 'a', visit: 2 },
  { store: 'a', visit: 3 },
  // Row 2
  { store: 'c', visit: 3 },
  { store: 'a', visit: 4 },
  { store: 'free', visit: 0 },
  { store: 'b', visit: 4 },
  { store: 'd', visit: 3 },
  // Row 3
  { store: 'd', visit: 4 },
  { store: 'b', visit: 5 },
  { store: 'a', visit: 5 },
  { store: 'c', visit: 4 },
  { store: 'd', visit: 5 },
  // Row 4
  { store: 'a', visit: 6 },
  { store: 'c', visit: 5 },
  { store: 'd', visit: 6 },
  { store: 'c', visit: 6 },
  { store: 'b', visit: 6 },
]

// ビンゴライン定義（12本）
const BINGO_LINES: number[][] = [
  // 横5本
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // 縦5本
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // 斜め2本
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
]

/**
 * ユーザーの進捗からビンゴライン数を計算
 *
 * @param progress - ユーザーの各店舗への訪問回数
 * @returns 達成したビンゴライン数（0〜12）
 */
export function checkBingoLines(progress: Progress): number {
  const completedCells = new Set<number>()

  // 各セルの達成状態をチェック
  BINGO_LAYOUT.forEach((cell, index) => {
    if (cell.store === 'free') {
      completedCells.add(index)
    } else {
      const visits = getVisitsForStore(progress, cell.store as StoreCode)
      if (visits >= cell.visit) {
        completedCells.add(index)
      }
    }
  })

  // ビンゴライン数をカウント
  let lineCount = 0
  for (const line of BINGO_LINES) {
    if (line.every((cellIndex) => completedCells.has(cellIndex))) {
      lineCount++
    }
  }

  return lineCount
}

/**
 * セルの達成状態を配列で返す
 *
 * @param progress - ユーザーの各店舗への訪問回数
 * @returns 各セルの達成状態（true: 達成, false: 未達成）
 */
export function getCellStates(progress: Progress): boolean[] {
  return BINGO_LAYOUT.map((cell) => {
    if (cell.store === 'free') return true

    const visits = getVisitsForStore(progress, cell.store as StoreCode)
    return visits >= cell.visit
  })
}

/**
 * 店舗コードから訪問回数を取得
 */
function getVisitsForStore(progress: Progress, storeCode: StoreCode): number {
  switch (storeCode) {
    case 'a':
      return progress.storeAVisits
    case 'b':
      return progress.storeBVisits
    case 'c':
      return progress.storeCVisits
    case 'd':
      return progress.storeDVisits
  }
}
