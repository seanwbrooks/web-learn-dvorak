import { expect, test } from '@playwright/test'

const warning = 'Learn Dvorak needs a keyboard'
const intro = 'Welcome to Learn Dvorak'

test('on a phone, the keyboard warning comes first, then the intro', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'only phones and tablets get the warning')
  await page.goto('/')
  await expect(page.getByRole('dialog', { name: warning })).toBeVisible()
  await expect(page.getByRole('dialog', { name: intro })).toBeHidden()

  await page.getByRole('button', { name: 'Continue anyway' }).click()
  await expect(page.getByRole('dialog', { name: warning })).toBeHidden()
  await expect(page.getByRole('dialog', { name: intro })).toBeVisible()
})

test('with a keyboard, the intro opens, and closing it starts the Test', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'phones see the keyboard warning first')
  await page.goto('/')
  await expect(page.getByRole('dialog', { name: warning })).toBeHidden()
  await expect(page.getByRole('dialog', { name: intro })).toBeVisible()

  await page.getByRole('button', { name: 'Start typing' }).click()
  await expect(page.getByRole('dialog', { name: intro })).toBeHidden()

  const passage = await page.locator('.remaining-passage').textContent()
  await page.keyboard.press(passage!.charAt(0))
  await expect(page.locator('.typed-portion')).toHaveText(passage!.charAt(0))
})
