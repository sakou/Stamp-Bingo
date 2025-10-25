import { test, expect } from '@playwright/test'

test.describe('User Bingo Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display bingo card on homepage', async ({ page }) => {
    // イベント名が表示されていることを確認
    await expect(page.locator('h1')).toBeVisible()

    // ビンゴカードが表示されていることを確認（5x5 = 25セル）
    const cells = page.locator('button[aria-label*="回目"], button[aria-label="フリーセル"]')
    await expect(cells).toHaveCount(25)
  })

  test('should show QR scan button', async ({ page }) => {
    // QRスキャンボタンを探す
    const qrButton = page.getByRole('link', { name: /QRコードをスキャン/i })
    await expect(qrButton).toBeVisible()
  })

  test('should navigate to scan page', async ({ page }) => {
    // QRスキャンページへ移動
    await page.click('text=QRコードをスキャン')

    // URLが変わったことを確認
    await expect(page).toHaveURL('/scan')

    // スキャンページのヘッダーを確認
    await expect(page.getByRole('heading', { name: /QRコード/i })).toBeVisible()
  })

  test('should display store progress summary', async ({ page }) => {
    // 各店舗の進捗サマリーが表示されていることを確認
    const progressSection = page.locator('text=/訪問/i').first()
    await expect(progressSection).toBeVisible()
  })

  test('should display prizes information', async ({ page }) => {
    // 景品情報セクションが表示されていることを確認
    await expect(page.getByRole('heading', { name: /景品/i })).toBeVisible()

    // 少なくとも1つの景品が表示されていることを確認
    const prizeElements = page.locator('text=/ライン達成/i')
    await expect(prizeElements.first()).toBeVisible()
  })

  test('should show achievement status', async ({ page }) => {
    // 達成ライン数が表示されていることを確認
    await expect(page.locator('text=/達成ライン数/i')).toBeVisible()
    await expect(page.locator('text=/ 12')).toBeVisible()
  })

  test('should be responsive - mobile view', async ({ page }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 })

    // ビンゴカードが表示されることを確認
    await expect(page.locator('h1')).toBeVisible()

    // セルが見えることを確認
    const cells = page.locator('button[aria-label*="回目"], button[aria-label="フリーセル"]')
    await expect(cells.first()).toBeVisible()
  })

  test('should handle back navigation from scan page', async ({ page }) => {
    // スキャンページへ移動
    await page.click('text=QRコードをスキャン')
    await expect(page).toHaveURL('/scan')

    // 戻るボタンをクリック
    await page.click('text=/ビンゴカード/i')

    // ホームページに戻ったことを確認
    await expect(page).toHaveURL('/')
  })
})
