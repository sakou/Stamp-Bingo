import { test, expect } from '@playwright/test'

test.describe('Admin Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/admin/login')

    // ログインフォームの要素を確認
    await expect(page.getByRole('heading', { name: /管理画面/i })).toBeVisible()
    await expect(page.getByLabel(/メールアドレス/i)).toBeVisible()
    await expect(page.getByLabel(/パスワード/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /ログイン/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/admin/login')

    // 空のままログインボタンをクリック
    await page.click('button[type="submit"]')

    // HTML5バリデーションが働くことを確認（required属性）
    const emailInput = page.getByLabel(/メールアドレス/i)
    const isEmailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
    expect(isEmailInvalid).toBeTruthy()
  })

  test('should fill login form', async ({ page }) => {
    await page.goto('/admin/login')

    // フォームに入力
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')

    // 入力値が正しく設定されたことを確認
    await expect(page.getByLabel(/メールアドレス/i)).toHaveValue('admin@example.com')
    await expect(page.getByLabel(/パスワード/i)).toHaveValue('admin123')
  })

  test('should show default admin credentials hint', async ({ page }) => {
    await page.goto('/admin/login')

    // デフォルト認証情報のヒントが表示されていることを確認
    await expect(page.locator('text=admin@example.com')).toBeVisible()
    await expect(page.locator('text=admin123')).toBeVisible()
  })

  test('should be responsive - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/admin/login')

    // モバイルでもフォームが表示されることを確認
    await expect(page.getByLabel(/メールアドレス/i)).toBeVisible()
    await expect(page.getByLabel(/パスワード/i)).toBeVisible()
  })
})

test.describe('Admin Dashboard (requires auth)', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // 認証されていない場合はログインページにリダイレクト
    await expect(page).toHaveURL('/admin/login')
  })
})
