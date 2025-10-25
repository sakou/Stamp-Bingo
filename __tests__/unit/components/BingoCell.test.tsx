import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BingoCell from '@/components/user/BingoCell'

describe('BingoCell Component', () => {
  describe('Free Cell', () => {
    it('should render free cell correctly', () => {
      render(<BingoCell store="free" visit={0} isCompleted={true} />)

      expect(screen.getByText('FREE')).toBeInTheDocument()
      expect(screen.getByText('フリー')).toBeInTheDocument()
    })

    it('should have correct aria-label for free cell', () => {
      render(<BingoCell store="free" visit={0} isCompleted={true} />)

      expect(screen.getByLabelText('フリーセル')).toBeInTheDocument()
    })
  })

  describe('Store Cell', () => {
    it('should render store cell with correct information', () => {
      render(
        <BingoCell
          store="a"
          visit={3}
          isCompleted={false}
          storeName="テスト店舗"
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('3回目')
      expect(button).toHaveTextContent('テスト店舗')
    })

    it('should have correct aria-label for store cell', () => {
      render(
        <BingoCell
          store="b"
          visit={2}
          isCompleted={false}
          storeName="イタリアンB"
        />
      )

      expect(screen.getByLabelText('イタリアンB店 2回目 未達成')).toBeInTheDocument()
    })

    it('should show completed status in aria-label', () => {
      render(
        <BingoCell
          store="c"
          visit={1}
          isCompleted={true}
          storeName="和食C"
        />
      )

      expect(screen.getByLabelText('和食C店 1回目 達成済み')).toBeInTheDocument()
    })
  })

  describe('Completed State', () => {
    it('should show checkmark when completed and not free', () => {
      render(
        <BingoCell
          store="d"
          visit={4}
          isCompleted={true}
          storeName="バーD"
        />
      )

      const button = screen.getByRole('button')
      const checkmark = button.querySelector('svg')
      expect(checkmark).toBeInTheDocument()
    })

    it('should not show checkmark for free cell', () => {
      render(<BingoCell store="free" visit={0} isCompleted={true} />)

      const button = screen.getByRole('button')
      const checkmark = button.querySelector('svg')
      expect(checkmark).not.toBeInTheDocument()
    })

    it('should apply completed styles', () => {
      render(
        <BingoCell
          store="a"
          visit={1}
          isCompleted={true}
        />
      )

      expect(screen.getByRole('button')).toHaveClass('bg-red-500')
    })

    it('should apply uncompleted styles', () => {
      render(
        <BingoCell
          store="a"
          visit={1}
          isCompleted={false}
        />
      )

      expect(screen.getByRole('button')).toHaveClass('bg-red-100')
    })
  })

  describe('Color Coding', () => {
    it('should apply correct color for store A', () => {
      render(<BingoCell store="a" visit={1} isCompleted={false} />)
      expect(screen.getByRole('button')).toHaveClass('bg-red-100')
    })

    it('should apply correct color for store B', () => {
      render(<BingoCell store="b" visit={1} isCompleted={false} />)
      expect(screen.getByRole('button')).toHaveClass('bg-blue-100')
    })

    it('should apply correct color for store C', () => {
      render(<BingoCell store="c" visit={1} isCompleted={false} />)
      expect(screen.getByRole('button')).toHaveClass('bg-green-100')
    })

    it('should apply correct color for store D', () => {
      render(<BingoCell store="d" visit={1} isCompleted={false} />)
      expect(screen.getByRole('button')).toHaveClass('bg-yellow-100')
    })

    it('should apply correct color for free cell', () => {
      render(<BingoCell store="free" visit={0} isCompleted={true} />)
      expect(screen.getByRole('button')).toHaveClass('bg-purple-500')
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked and not completed', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()

      render(
        <BingoCell
          store="a"
          visit={1}
          isCompleted={false}
          onClick={onClick}
        />
      )

      await user.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when completed', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()

      render(
        <BingoCell
          store="a"
          visit={1}
          isCompleted={true}
          onClick={onClick}
        />
      )

      await user.click(screen.getByRole('button'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should be disabled when completed', () => {
      render(
        <BingoCell
          store="a"
          visit={1}
          isCompleted={true}
          onClick={jest.fn()}
        />
      )

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should not be clickable when no onClick provided', () => {
      render(<BingoCell store="a" visit={1} isCompleted={false} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cursor-default')
    })
  })
})
