import { expect, test } from '@playwright/test'

// Safari paints the root past either end of a page and behind its toolbars,
// so the root needs the page's own colour, not the default white
for (const path of ['/', '/about.html', '/contact.html']) {
  test(`${path} paints a dark background behind the page`, async ({ page }) => {
    await page.goto(path)
    const root = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      return { background: style.backgroundColor, scheme: style.colorScheme }
    })
    expect(root.background).toBe('rgb(26, 26, 46)')
    expect(root.scheme).toBe('dark')
  })
}
