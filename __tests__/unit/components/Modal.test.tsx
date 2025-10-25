import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '@/components/ui/Modal'

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal Content</div>,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<Modal {...defaultProps} />)
      expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    it('should not render modal when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />)
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
    })

    it('should render modal with title', () => {
      render(<Modal {...defaultProps} title="Test Title" />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('should render close button by default', () => {
      render(<Modal {...defaultProps} title="Title" />)
      expect(screen.getByLabelText('閉じる')).toBeInTheDocument()
    })

    it('should not render close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />)
      expect(screen.queryByLabelText('閉じる')).not.toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should apply correct size classes', () => {
      const { rerender } = render(<Modal {...defaultProps} size="sm" />)
      expect(screen.getByRole('dialog')).toHaveClass('max-w-sm')

      rerender(<Modal {...defaultProps} size="md" />)
      expect(screen.getByRole('dialog')).toHaveClass('max-w-md')

      rerender(<Modal {...defaultProps} size="lg" />)
      expect(screen.getByRole('dialog')).toHaveClass('max-w-lg')

      rerender(<Modal {...defaultProps} size="xl" />)
      expect(screen.getByRole('dialog')).toHaveClass('max-w-xl')
    })
  })

  describe('Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      render(<Modal {...defaultProps} onClose={onClose} title="Title" />)

      await user.click(screen.getByLabelText('閉じる'))
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      render(<Modal {...defaultProps} onClose={onClose} />)

      const backdrop = screen.getByRole('dialog').previousSibling as HTMLElement
      await user.click(backdrop)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Escape key is pressed', async () => {
      const user = userEvent.setup()
      const onClose = jest.fn()

      render(<Modal {...defaultProps} onClose={onClose} />)

      await user.keyboard('{Escape}')
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(<Modal {...defaultProps} title="Test Modal" />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
    })

    it('should have aria-labelledby only when title is provided', () => {
      render(<Modal {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).not.toHaveAttribute('aria-labelledby')
    })
  })
})
