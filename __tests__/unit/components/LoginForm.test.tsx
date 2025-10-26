/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/admin/LoginForm'
import { adminLogin } from '@/app/actions/admin/auth'

// useRouterのモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// adminLoginのモック
jest.mock('@/app/actions/admin/auth', () => ({
  adminLogin: jest.fn(),
}))

const mockAdminLogin = adminLogin as jest.MockedFunction<typeof adminLogin>

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render email input field', () => {
      render(<LoginForm />)
      expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    })

    it('should render password input field', () => {
      render(<LoginForm />)
      expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument()
    })

    it('should render login button', () => {
      render(<LoginForm />)
      expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument()
    })

    it('should have email input with correct type', () => {
      render(<LoginForm />)
      const emailInput = screen.getByLabelText(/メールアドレス/i)
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('should have password input with correct type', () => {
      render(<LoginForm />)
      const passwordInput = screen.getByLabelText(/パスワード/i)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Form Validation', () => {
    it('should have required email field', () => {
      render(<LoginForm />)
      const emailInput = screen.getByLabelText(/メールアドレス/i)
      expect(emailInput).toBeRequired()
    })

    it('should have required password field', () => {
      render(<LoginForm />)
      const passwordInput = screen.getByLabelText(/パスワード/i)
      expect(passwordInput).toBeRequired()
    })
  })

  describe('User Interactions', () => {
    it('should allow typing in email field', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/メールアドレス/i) as HTMLInputElement
      await user.type(emailInput, 'test@example.com')

      expect(emailInput.value).toBe('test@example.com')
    })

    it('should allow typing in password field', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      const passwordInput = screen.getByLabelText(/パスワード/i) as HTMLInputElement
      await user.type(passwordInput, 'password123')

      expect(passwordInput.value).toBe('password123')
    })

    it('should call adminLogin on form submission with correct data', async () => {
      const user = userEvent.setup()
      mockAdminLogin.mockResolvedValueOnce({
        success: true,
        message: 'ログインしました',
        data: { adminId: 1, name: 'Test Admin' },
      })

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/メールアドレス/i), 'admin@example.com')
      await user.type(screen.getByLabelText(/パスワード/i), 'admin123')
      await user.click(screen.getByRole('button', { name: /ログイン/i }))

      await waitFor(() => {
        expect(mockAdminLogin).toHaveBeenCalledWith('admin@example.com', 'admin123')
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message when login fails', async () => {
      const user = userEvent.setup()
      mockAdminLogin.mockResolvedValueOnce({
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません',
      })

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/メールアドレス/i), 'wrong@example.com')
      await user.type(screen.getByLabelText(/パスワード/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /ログイン/i }))

      await waitFor(() => {
        expect(
          screen.getByText(/メールアドレスまたはパスワードが正しくありません/i)
        ).toBeInTheDocument()
      })
    })

    it('should disable inputs while loading', async () => {
      const user = userEvent.setup()
      mockAdminLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      )

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/メールアドレス/i), 'admin@example.com')
      await user.type(screen.getByLabelText(/パスワード/i), 'admin123')

      const submitButton = screen.getByRole('button', { name: /ログイン/i })
      await user.click(submitButton)

      // ローディング中は入力が無効化される
      expect(screen.getByLabelText(/メールアドレス/i)).toBeDisabled()
      expect(screen.getByLabelText(/パスワード/i)).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<LoginForm />)
      const form = screen.getByRole('button', { name: /ログイン/i }).closest('form')
      expect(form).toBeInTheDocument()
    })

    it('should have labels associated with inputs', () => {
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/メールアドレス/i)
      const passwordInput = screen.getByLabelText(/パスワード/i)

      expect(emailInput).toHaveAttribute('id')
      expect(passwordInput).toHaveAttribute('id')
    })
  })
})
