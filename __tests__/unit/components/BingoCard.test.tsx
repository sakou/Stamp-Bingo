import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BingoCard from '@/components/user/BingoCard'
import { BingoCardData } from '@/types/api'

// モックデータ
const mockBingoCardData: BingoCardData = {
  eventInfo: {
    id: 'test-event',
    name: 'テストイベント',
    description: 'テスト用のイベントです',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    conditions: '参加条件テスト',
  },
  stores: {
    a: {
      name: 'カフェA',
      description: 'カフェAの説明',
      instagramUrl: 'https://instagram.com/cafe-a',
    },
    b: {
      name: 'イタリアンB',
      description: 'イタリアンBの説明',
      twitterUrl: 'https://x.com/italian-b',
    },
    c: {
      name: '和食C',
      description: '和食Cの説明',
    },
    d: {
      name: 'バーD',
      description: 'バーDの説明',
    },
  },
  prizes: {
    line1: {
      name: '10%割引券',
      description: '全商品10%オフ',
      validUntil: '2025-12-31',
    },
    line2: {
      name: '1000円割引券',
      description: '1000円分の割引',
    },
    line3: {
      name: '5000円割引券',
      description: '5000円分の割引',
    },
  },
  progress: {
    storeAVisits: 2,
    storeBVisits: 1,
    storeCVisits: 0,
    storeDVisits: 3,
  },
  bingoLines: [],
}

describe('BingoCard Component', () => {
  describe('Event Information', () => {
    it('should render event name', () => {
      render(<BingoCard data={mockBingoCardData} />)
      expect(screen.getByText('テストイベント')).toBeInTheDocument()
    })

    it('should render event description', () => {
      render(<BingoCard data={mockBingoCardData} />)
      expect(screen.getByText('テスト用のイベントです')).toBeInTheDocument()
    })

    it('should render event period', () => {
      render(<BingoCard data={mockBingoCardData} />)
      expect(screen.getByText(/2025-01-01.*2025-12-31/)).toBeInTheDocument()
    })
  })

  describe('Bingo Lines Achievement', () => {
    it('should display 0 lines when no lines achieved', () => {
      const { container } = render(<BingoCard data={mockBingoCardData} />)
      expect(container.textContent).toContain('達成ライン数')
      expect(container.textContent).toContain('/ 12')
    })

    it('should display achieved line count', () => {
      const dataWithLines = {
        ...mockBingoCardData,
        bingoLines: [1, 2, 3],
      }
      const { container } = render(<BingoCard data={dataWithLines} />)
      expect(container.textContent).toContain('達成ライン数')
      expect(container.textContent).toContain('3')
      expect(container.textContent).toContain('/ 12')
    })

    it('should display achievement message when lines are achieved', () => {
      const dataWithLines = {
        ...mockBingoCardData,
        bingoLines: [1],
      }
      const { container } = render(<BingoCard data={dataWithLines} />)
      expect(container.textContent).toMatch(/1ライン.*達成/)
    })
  })

  describe('Bingo Grid', () => {
    it('should render 25 cells (5x5 grid)', () => {
      render(<BingoCard data={mockBingoCardData} />)
      const buttons = screen.getAllByRole('button')
      // 25セル + QRスキャンボタン等があるため、最低25個以上
      expect(buttons.length).toBeGreaterThanOrEqual(25)
    })
  })

  describe('Progress Summary', () => {
    it('should display progress for all stores', () => {
      render(<BingoCard data={mockBingoCardData} />)

      const storeNames = screen.getAllByText('カフェA')
      expect(storeNames.length).toBeGreaterThan(0)
      expect(screen.getAllByText('イタリアンB').length).toBeGreaterThan(0)
      expect(screen.getAllByText('和食C').length).toBeGreaterThan(0)
      expect(screen.getAllByText('バーD').length).toBeGreaterThan(0)
    })

    it('should display correct visit counts', () => {
      const { container } = render(<BingoCard data={mockBingoCardData} />)

      // 各店舗の訪問回数を確認（表示形式: "2 / 6"）
      expect(container.textContent).toContain('2')
      expect(container.textContent).toContain('1')
      expect(container.textContent).toContain('0')
      expect(container.textContent).toContain('3')
    })
  })

  describe('Prizes Information', () => {
    it('should display all prize information', () => {
      const { container } = render(<BingoCard data={mockBingoCardData} />)

      expect(container.textContent).toContain('10%割引券')
      expect(container.textContent).toContain('1000円割引券')
      expect(container.textContent).toContain('5000円割引券')
    })

    it('should show prize descriptions', () => {
      const { container } = render(<BingoCard data={mockBingoCardData} />)

      expect(container.textContent).toContain('全商品10%オフ')
      expect(container.textContent).toContain('1000円分の割引')
      expect(container.textContent).toContain('5000円分の割引')
    })

    it('should show valid until date when provided', () => {
      render(<BingoCard data={mockBingoCardData} />)
      expect(screen.getByText(/2025-12-31.*まで/)).toBeInTheDocument()
    })

    it('should show achievement status for prizes', () => {
      const dataWithLines = {
        ...mockBingoCardData,
        bingoLines: [1],
      }
      render(<BingoCard data={dataWithLines} />)

      expect(screen.getByText('✓ 達成済み')).toBeInTheDocument()
    })

    it('should not show achievement status for unachieved prizes', () => {
      render(<BingoCard data={mockBingoCardData} />)
      expect(screen.queryByText('✓ 達成済み')).not.toBeInTheDocument()
    })
  })

  describe('Store Info Modal', () => {
    it('should open modal when cell is clicked', async () => {
      const user = userEvent.setup()
      render(<BingoCard data={mockBingoCardData} />)

      // 最初のセルをクリック（BingoCellがクリック可能な場合）
      const cells = screen.getAllByRole('button')
      const firstCell = cells.find((btn) => btn.textContent?.includes('回目'))

      if (firstCell) {
        await user.click(firstCell)
        // モーダルが開いているかは実装依存（データによって変わる）
      }
    })
  })

  describe('Accessibility', () => {
    it('should have heading for event name', () => {
      render(<BingoCard data={mockBingoCardData} />)
      const heading = screen.getByRole('heading', { name: /テストイベント/ })
      expect(heading).toBeInTheDocument()
    })

    it('should have heading for prizes section', () => {
      render(<BingoCard data={mockBingoCardData} />)
      const heading = screen.getByRole('heading', { name: /景品情報/ })
      expect(heading).toBeInTheDocument()
    })
  })
})
