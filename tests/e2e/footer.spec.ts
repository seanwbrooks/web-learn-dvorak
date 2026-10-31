import { expect, test } from '@playwright/test'

const year = new Date().getFullYear()

for (const path of ['/', '/about.html', '/contact.html']) {
  test(`${path} ends with the copyright`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('.site-footer')).toHaveText(
      `© ${year} Sean Brooks`
    )
  })
}

test('the footer shows without scrolling during a Test', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'phones scroll while typing')
  await page.goto('/')
  await expect(page.locator('.site-footer')).toBeInViewport({ ratio: 1 })
})
