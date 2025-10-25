import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/ui/Button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('should render with different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-purple-600')

      rerender(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-gray-200')

      rerender(<Button variant="danger">Danger</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-red-600')
    })

    it('should render with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-9')

      rerender(<Button size="md">Medium</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-11')

      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-13')
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()

      render(<Button onClick={handleClick}>Click</Button>)

      await user.click(screen.getByText('Click'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()

      render(<Button onClick={handleClick} disabled>Click</Button>)

      await user.click(screen.getByText('Click'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()

      render(<Button onClick={handleClick} isLoading>Click</Button>)

      await user.click(screen.getByText('Click'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>)

      const button = screen.getByRole('button')
      const spinner = button.querySelector('svg.animate-spin')

      expect(spinner).toBeInTheDocument()
    })

    it('should be disabled when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>)

      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have correct button role', () => {
      render(<Button>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should support custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('should support type attribute', () => {
      render(<Button type="submit">Submit</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
  })
})
