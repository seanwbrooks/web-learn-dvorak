// @vitest-environment jsdom
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Practice from './Practice'

// The learner's keypresses: the app listens for keyup on the window
const press = (key: string, target: Element = document.body) =>
  fireEvent.keyUp(target, { key })
const typeText = (text: string) => [...text].forEach((key) => press(key))
const typed = () => document.querySelector('.typed-portion')?.textContent ?? ''
const remaining = () =>
  document.querySelector('.remaining-passage')?.textContent ?? ''
const wordCount = () => remaining().split(' ').length
const litKeys = () =>
  Array.from(
    document.querySelectorAll('.keyboard .highlight'),
    (key) => key.textContent
  )
const weakKeys = () =>
  Array.from(
    document.querySelectorAll('.keyboard .weak'),
    (key) => key.textContent
  )

// Types the rest of the Passage at the given speed. Before each space listed
// in missedSpaces (counting from the first), presses x `wrongPresses` times.
const finishPassage = (
  wpm: number,
  { missedSpaces = 0, wrongPresses = 1 } = {}
) => {
  const text = remaining()
  let spaces = 0
  for (const char of text.slice(0, -1)) {
    if (char === ' ' && spaces++ < missedSpaces) {
      for (let i = 0; i < wrongPresses; i++) press('x')
    }
    press(char)
  }
  // Every five characters count as one word
  vi.setSystemTime(Date.now() + (text.length / 5 / wpm) * 60000)
  press(text.slice(-1))
}

beforeEach(() => {
  // A returning learner, so the intro stays closed
  window.localStorage.setItem('dvorakIntroSeen', 'true')
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-10-26T12:00:00Z'))
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('a Test', () => {
  it('ends with the WPM once the whole Passage is typed', () => {
    render(<Practice />)
    finishPassage(40)

    expect(screen.getByText('40 wpm')).toBeTruthy()
    expect(screen.getByText('Personal Best: 40 WPM')).toBeTruthy()
  })

  it('stays put on a wrong key and lights the key that was needed', () => {
    render(<Practice />)
    const passage = remaining()
    const wrong = passage[0] === 'x' ? 'z' : 'x'

    press(wrong)

    expect(typed()).toBe('')
    expect(remaining()).toBe(passage)
    expect(litKeys()).toHaveLength(1)
    expect(litKeys()[0]?.toLowerCase()).toContain(passage[0].toLowerCase())
  })

  it('takes back the last typed character on Backspace', () => {
    render(<Practice />)
    const passage = remaining()

    typeText(passage.slice(0, 3))
    press('Backspace')

    expect(typed()).toBe(passage.slice(0, 2))
  })

  it('ignores Shift and other keys that type nothing', () => {
    render(<Practice />)
    press('Shift')
    press('Tab')

    expect(litKeys()).toEqual([])
    expect(typed()).toBe('')
  })
})

describe('Weak Keys', () => {
  // A 50-word Passage needs Space 49 times; more than 5% missed makes it Weak
  it('marks a key missed often enough on the keyboard', () => {
    render(<Practice />)
    finishPassage(40, { missedSpaces: 5 })

    expect(weakKeys()).toEqual(['Space'])
  })

  it('counts repeated wrong presses at one position as one Missed Key', () => {
    render(<Practice />)
    // 2 Missed Keys (4%), not 6 (12%)
    finishPassage(40, { missedSpaces: 2, wrongPresses: 3 })

    expect(weakKeys()).toEqual([])
  })

  it('are remembered on the next visit', () => {
    const { unmount } = render(<Practice />)
    finishPassage(40, { missedSpaces: 5 })
    unmount()

    render(<Practice />)
    expect(weakKeys()).toEqual(['Space'])
  })
})

describe('a Practice Test', () => {
  it('targets the Weak Keys and never sets a Personal Best', () => {
    render(<Practice />)
    finishPassage(40, { missedSpaces: 5 })

    fireEvent.click(screen.getByText('Practice Weak Keys'))
    expect(screen.getByText('Practice: Space')).toBeTruthy()
    expect(wordCount()).toBe(25)
    finishPassage(90)
    expect(screen.getByText('Practice: 90 wpm')).toBeTruthy()

    fireEvent.click(screen.getByText('Back to Test'))
    finishPassage(30)
    expect(screen.getByText('Personal Best: 40 WPM')).toBeTruthy()
  })
})

describe('Personal Best', () => {
  it('keeps the fastest Test across visits', () => {
    const { unmount } = render(<Practice />)
    finishPassage(55)
    unmount()

    render(<Practice />)
    finishPassage(45)
    expect(screen.getByText('45 wpm')).toBeTruthy()
    expect(screen.getByText('Personal Best: 55 WPM')).toBeTruthy()
  })
})

describe('Passage length', () => {
  it('starts at 50 words and switches to 25, starting a fresh Test', () => {
    render(<Practice />)
    expect(wordCount()).toBe(50)
    typeText(remaining().slice(0, 3))

    fireEvent.click(screen.getByRole('button', { name: '25' }))

    expect(typed()).toBe('')
    expect(wordCount()).toBe(25)
  })

  it('remembers the choice on the next visit', () => {
    const { unmount } = render(<Practice />)
    fireEvent.click(screen.getByRole('button', { name: '25' }))
    unmount()

    render(<Practice />)
    expect(wordCount()).toBe(25)
    finishPassage(40)
    fireEvent.click(screen.getByText('Try Again'))
    expect(wordCount()).toBe(25)
  })

  it('treats Space pressed on the toggle as working it, not typing', () => {
    render(<Practice />)
    const selected = screen.getByRole('button', { name: '50' })

    press(' ', selected)

    expect(typed()).toBe('')
    expect(litKeys()).toEqual([])
  })
})

describe('the intro', () => {
  it('opens on a first visit and holds typing until closed', () => {
    window.localStorage.clear()
    render(<Practice />)
    const passage = remaining()
    expect(screen.getByRole('dialog').hasAttribute('open')).toBe(true)

    press(passage[0])
    expect(typed()).toBe('')

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    press(passage[0])
    expect(typed()).toBe(passage[0])
  })

  it('stays closed for a returning learner', () => {
    render(<Practice />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
