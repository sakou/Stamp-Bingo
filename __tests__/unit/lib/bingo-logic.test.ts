import { checkBingoLines, getCellStates, BINGO_LAYOUT } from '@/lib/bingo-logic'
import { Progress } from '@/types/bingo'

describe('ビンゴ判定ロジック', () => {
  describe('checkBingoLines', () => {
    it('訪問回数が0のとき、0ラインを返す（FREEのみでは不成立）', () => {
      const progress: Progress = {
        storeAVisits: 0,
        storeBVisits: 0,
        storeCVisits: 0,
        storeDVisits: 0,
      }

      const lineCount = checkBingoLines(progress)
      expect(lineCount).toBe(0)
    })

    it('1行目のライン達成: A1,C1,B1,D1,B2が全て達成', () => {
      const progress: Progress = {
        storeAVisits: 1,
        storeBVisits: 2,
        storeCVisits: 1,
        storeDVisits: 1,
      }

      const lineCount = checkBingoLines(progress)
      expect(lineCount).toBe(1)
    })

    it('2ライン達成のケース', () => {
      const progress: Progress = {
        storeAVisits: 2,
        storeBVisits: 3,
        storeCVisits: 2,
        storeDVisits: 2,
      }

      const lineCount = checkBingoLines(progress)
      expect(lineCount).toBeGreaterThanOrEqual(2)
    })

    it('全ての店舗を6回訪問すると、12ライン全て達成', () => {
      const progress: Progress = {
        storeAVisits: 6,
        storeBVisits: 6,
        storeCVisits: 6,
        storeDVisits: 6,
      }

      const lineCount = checkBingoLines(progress)
      expect(lineCount).toBe(12)
    })

    it('一部の店舗のみ訪問した場合、ビンゴにならない配置を確認', () => {
      // A店のみ6回訪問してもビンゴにならないことを確認
      const progress: Progress = {
        storeAVisits: 6,
        storeBVisits: 0,
        storeCVisits: 0,
        storeDVisits: 0,
      }

      const lineCount = checkBingoLines(progress)
      expect(lineCount).toBe(0)
    })
  })

  describe('getCellStates', () => {
    it('訪問回数0のとき、FREEのみtrueを返す', () => {
      const progress: Progress = {
        storeAVisits: 0,
        storeBVisits: 0,
        storeCVisits: 0,
        storeDVisits: 0,
      }

      const cellStates = getCellStates(progress)

      // 25セル分の配列
      expect(cellStates).toHaveLength(25)

      // FREEセル(12番目)のみtrue
      expect(cellStates[12]).toBe(true)

      // 他は全てfalse
      cellStates.forEach((state, index) => {
        if (index !== 12) {
          expect(state).toBe(false)
        }
      })
    })

    it('A店1回訪問のとき、A店1回目のマスがtrueになる', () => {
      const progress: Progress = {
        storeAVisits: 1,
        storeBVisits: 0,
        storeCVisits: 0,
        storeDVisits: 0,
      }

      const cellStates = getCellStates(progress)

      // A店1回目のセルを探す
      const a1Index = BINGO_LAYOUT.findIndex(
        (cell) => cell.store === 'a' && cell.visit === 1
      )

      expect(cellStates[a1Index]).toBe(true)
    })

    it('全店舗6回訪問のとき、全セルがtrueになる', () => {
      const progress: Progress = {
        storeAVisits: 6,
        storeBVisits: 6,
        storeCVisits: 6,
        storeDVisits: 6,
      }

      const cellStates = getCellStates(progress)

      // 全て達成
      expect(cellStates.every((state) => state === true)).toBe(true)
    })
  })

  describe('BINGO_LAYOUT', () => {
    it('25セルが定義されている', () => {
      expect(BINGO_LAYOUT).toHaveLength(25)
    })

    it('中央(12番目)がFREEセルである', () => {
      expect(BINGO_LAYOUT[12].store).toBe('free')
      expect(BINGO_LAYOUT[12].visit).toBe(0)
    })

    it('各店舗が6回ずつ登場する', () => {
      const storeCount = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        free: 0,
      }

      BINGO_LAYOUT.forEach((cell) => {
        storeCount[cell.store]++
      })

      expect(storeCount.a).toBe(6)
      expect(storeCount.b).toBe(6)
      expect(storeCount.c).toBe(6)
      expect(storeCount.d).toBe(6)
      expect(storeCount.free).toBe(1)
    })

    it('各店舗の訪問回数が1〜6で揃っている', () => {
      const stores: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd']

      stores.forEach((store) => {
        const visits = BINGO_LAYOUT.filter((cell) => cell.store === store).map(
          (cell) => cell.visit
        )

        expect(visits.sort()).toEqual([1, 2, 3, 4, 5, 6])
      })
    })
  })
})
